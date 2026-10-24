use pulsegrid::pattern::{default_pattern, empty_pattern, Banks, Transport};
use pulsegrid::{NullMidiOut, SequencerClock, VoiceEngine, MidiOut, pattern::TrackId, pattern::TRACKS};
use std::thread;
use std::time::{Duration, Instant};

fn main() {
    let banks = Banks {
        a: default_pattern(),
        b: empty_pattern(),
    };
    let mut tr = Transport::default();
    let mut engine = VoiceEngine::new();
    let mut midi = NullMidiOut;
    let mut clock = SequencerClock::new();

    println!("PulseGrid Rust scaffold — look-ahead clock demo (~8s)");
    clock.start(&mut tr, 0.0);
    let t0 = Instant::now();
    let mut last_print = 999usize;
    loop {
        let now = t0.elapsed().as_secs_f64();
        if now > 8.0 {
            break;
        }
        let before = tr.step;
        clock.tick(&mut tr, &banks, now);
        if tr.step != before || tr.step != last_print {
            // After tick, step has advanced; show previous sounding step
            let sounded = if tr.step == 0 { 15 } else { tr.step - 1 };
            if sounded != last_print {
                let pat = if tr.active_bank == 'B' { &banks.b } else { &banks.a };
                for ti in 0..TRACKS {
                    let cell = pat[ti][sounded];
                    if cell.vel == 0 {
                        continue;
                    }
                    let id = match ti {
                        0 => TrackId::Kick,
                        1 => TrackId::Snare,
                        2 => TrackId::Hat,
                        _ => TrackId::Perc,
                    };
                    engine.trigger(id, cell.vel, now);
                    midi.send_drum(id, cell.vel, 10, now);
                }
                println!("step {:2} bank {}", sounded + 1, tr.active_bank);
                last_print = sounded;
            }
        }
        thread::sleep(Duration::from_millis(5));
    }
    clock.stop(&mut tr);
    println!("done.");
}
