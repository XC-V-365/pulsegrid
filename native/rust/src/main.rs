//! PulseGrid CLI — smoke + optional cpal/midir
//!
//! cargo run --release
//! cargo run --release --features audio -- --beep
//! cargo run --release --features audio -- --list-audio
//! cargo run --release --features midi -- --list-midi
//! cargo run --release --features full -- --play
//! cargo run --release --features full -- --midi --midi-port "IAC"

use pulsegrid::audio_cpal::{list_hosts, list_output_devices, start_output, stop_output};
use pulsegrid::midi_midir::{list_input_ports, list_ports, MidirOut};
use pulsegrid::pattern::{
    midi_note, midi_velocity, Banks, StepCell, TrackId, Transport, STEPS,
};
use pulsegrid::{MidiOut, NullMidiOut, SequencerClock, VoiceEngine};
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::{Duration, Instant};

fn track_idx(t: TrackId) -> usize {
    t as usize
}

fn fire_step(
    step: usize,
    pat: &pulsegrid::Pattern,
    midi: &mut dyn MidiOut,
    engine: &Arc<Mutex<VoiceEngine>>,
) {
    for track in [TrackId::Kick, TrackId::Snare, TrackId::Hat, TrackId::Perc] {
        let cell: StepCell = pat[track_idx(track)][step];
        if cell.vel == 0 {
            continue;
        }
        // Simple probability gate
        if cell.prob < 100 {
            let r = (step as u32 * 17 + track_idx(track) as u32 * 31) % 100;
            if r as u8 >= cell.prob {
                continue;
            }
        }
        let vel = midi_velocity(cell.vel);
        let note = midi_note(track, cell.vel);
        midi.note_on(10, note, vel, 0.0);
        if let Ok(mut e) = engine.lock() {
            e.trigger(track, vel);
        }
    }
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    println!(
        "PulseGrid Rust v5 — audio={} midi={}",
        cfg!(feature = "audio"),
        cfg!(feature = "midi")
    );

    if args.iter().any(|a| a == "--help" || a == "-h") {
        println!(
            "Usage:
  --list-midi          list MIDI out ports
  --list-midi-in       list MIDI in ports
  --list-audio         list audio hosts/devices
  --beep               short cpal beep (needs --features audio)
  --play               2 bars via SequencerClock (default demo)
  --midi               open MIDI out
  --midi-port NAME     substring match for MIDI port
  --bars N             number of 16-step bars (default 2)
  --bpm N              tempo (default 120)
"
        );
        return;
    }

    if args.iter().any(|a| a == "--list-midi") {
        for p in list_ports() {
            println!("  · {p}");
        }
        return;
    }
    if args.iter().any(|a| a == "--list-midi-in") {
        for p in list_input_ports() {
            println!("  · {p}");
        }
        return;
    }
    if args.iter().any(|a| a == "--list-audio") {
        for line in list_hosts() {
            println!("  {line}");
        }
        for d in list_output_devices() {
            println!("  device: {d}");
        }
        return;
    }

    let mut bpm = 120.0f32;
    if let Some(i) = args.iter().position(|a| a == "--bpm") {
        if let Some(v) = args.get(i + 1).and_then(|s| s.parse::<f32>().ok()) {
            bpm = v;
        }
    }
    let mut bars: usize = 2;
    if let Some(i) = args.iter().position(|a| a == "--bars") {
        if let Some(v) = args.get(i + 1).and_then(|s| s.parse::<usize>().ok()) {
            bars = v.max(1).min(64);
        }
    }

    let banks = Banks::default();
    let mut transport = Transport {
        bpm,
        ..Transport::default()
    };
    let engine = Arc::new(Mutex::new(VoiceEngine::new(44100.0)));

    let want_audio = args.iter().any(|a| a == "--beep" || a == "--play")
        || cfg!(feature = "audio") && args.iter().any(|a| a == "--audio");

    if want_audio || args.iter().any(|a| a == "--beep") {
        match start_output(Arc::clone(&engine)) {
            Ok(()) => println!("cpal stream started"),
            Err(err) => eprintln!("audio: {err}"),
        }
    }

    if args.iter().any(|a| a == "--beep") {
        if let Ok(mut e) = engine.lock() {
            e.trigger(TrackId::Kick, 100);
            e.trigger(TrackId::Snare, 90);
            e.trigger(TrackId::Hat, 60);
            e.trigger(TrackId::Perc, 80);
        }
        thread::sleep(Duration::from_millis(1000));
        stop_output();
        println!("beep done");
        return;
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
            println!("MIDI out open: {}", m.port_name());
            Box::new(m)
        } else {
            eprintln!("MIDI open failed — NullMidiOut");
            Box::new(NullMidiOut)
        }
    } else {
        Box::new(NullMidiOut)
    };

    // SequencerClock path (--play or default)
    let mut clock = SequencerClock::new();
    let eng_cb = Arc::clone(&engine);
    // Collect steps into a channel-like vec for sequential fire (callback can't hold midi easily)
    let steps_fired = Arc::new(Mutex::new(Vec::<(usize, f64)>::new()));
    let steps_cb = Arc::clone(&steps_fired);
    clock.set_callback(move |step, t, _pat| {
        if let Ok(mut v) = steps_cb.lock() {
            v.push((step, t));
        }
    });

    let start = Instant::now();
    clock.start(&mut transport, 0.0);
    let total_steps = STEPS * bars;
    let mut fired = 0usize;

    while fired < total_steps {
        let now = start.elapsed().as_secs_f64();
        clock.tick(&mut transport, &banks, now);
        let batch: Vec<(usize, f64)> = {
            let mut g = steps_fired.lock().unwrap();
            let b = g.drain(..).collect();
            b
        };
        for (step, _t) in batch {
            let pat = pulsegrid::active_pattern(&banks, transport.active_bank);
            fire_step(step, pat, midi.as_mut(), &eng_cb);
            fired += 1;
            if fired >= total_steps {
                break;
            }
        }
        thread::sleep(Duration::from_millis(2));
        if start.elapsed().as_secs_f64() > (bars as f64) * 16.0 * (60.0 / bpm as f64 / 4.0) + 2.0
        {
            break;
        }
    }
    clock.stop(&mut transport);
    stop_output();
    println!("done {bars} bars @ {bpm} BPM (steps≈{fired})");
}
