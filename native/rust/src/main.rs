//! PulseGrid CLI — smoke + optional cpal/midir
//! cargo run --release
//! cargo run --release --features audio -- --beep
//! cargo run --release --features midi -- --list-midi
//! cargo run --release --features full -- --list-midi

use pulsegrid::pattern::{Banks, StepCell, TrackId, Transport, STEPS};
use pulsegrid::{VoiceEngine, NullMidiOut, MidiOut};
use pulsegrid::midi_midir::{list_ports, MidirOut};
use pulsegrid::audio_cpal::{list_hosts, start_output};
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;

fn track_idx(t: TrackId) -> usize {
    t as usize
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    println!(
        "PulseGrid Rust — audio={} midi={}",
        cfg!(feature = "audio"),
        cfg!(feature = "midi")
    );

    if args.iter().any(|a| a == "--list-midi") {
        for p in list_ports() {
            println!("  · {p}");
        }
        return;
    }
    if args.iter().any(|a| a == "--list-audio") {
        println!("hosts: {:?}", list_hosts());
        return;
    }

    let banks = Banks::default();
    let transport = Transport::default();
    let engine = Arc::new(Mutex::new(VoiceEngine::new(44100.0)));

    if args.iter().any(|a| a == "--beep") {
        match start_output(Arc::clone(&engine)) {
            Ok(()) => {
                println!("cpal stream started");
                if let Ok(mut e) = engine.lock() {
                    e.trigger(TrackId::Kick, 100);
                    e.trigger(TrackId::Snare, 90);
                    e.trigger(TrackId::Hat, 60);
                }
                thread::sleep(Duration::from_millis(900));
            }
            Err(err) => eprintln!("audio: {err}"),
        }
    }

    let mut midi: Box<dyn MidiOut> = if args.iter().any(|a| a == "--midi") {
        let mut m = MidirOut::new();
        let name = args
            .iter()
            .position(|a| a == "--midi-port")
            .and_then(|i| args.get(i + 1))
            .map(|s| s.as_str())
            .unwrap_or("");
        if m.open(name) {
            println!("MIDI out open");
            Box::new(m)
        } else {
            eprintln!("MIDI open failed — NullMidiOut");
            Box::new(NullMidiOut)
        }
    } else {
        Box::new(NullMidiOut)
    };

    let pat = &banks.a;
    let bpm = transport.bpm.max(60.0);
    let step_ms = (60_000.0 / bpm / 4.0) as u64;

    for step in 0..(STEPS * 2) {
        let s = step % STEPS;
        for track in [TrackId::Kick, TrackId::Snare, TrackId::Hat, TrackId::Perc] {
            let cell: StepCell = pat[track_idx(track)][s];
            if cell.vel > 0 {
                let vel = match cell.vel {
                    1 => 50,
                    2 => 85,
                    _ => 110,
                };
                let note = match track {
                    TrackId::Kick => 36,
                    TrackId::Snare => 38,
                    TrackId::Hat => 42,
                    TrackId::Perc => 39,
                };
                midi.note_on(10, note, vel, 0.0);
                if let Ok(mut e) = engine.lock() {
                    e.trigger(track, vel);
                }
            }
        }
        thread::sleep(Duration::from_millis(step_ms));
    }
    println!("done 2 bars @ {bpm} BPM");
}
