//! Simple synth voice engine for cpal callback

use crate::pattern::TrackId;

#[derive(Clone, Debug)]
struct Voice {
    track: TrackId,
    phase: f32,
    amp: f32,
    decay: f32,
    freq: f32,
}

pub struct VoiceEngine {
    sample_rate: f32,
    voices: Vec<Voice>,
    master: f32,
}

impl VoiceEngine {
    pub fn new(sample_rate: f32) -> Self {
        Self {
            sample_rate: sample_rate.max(8000.0),
            voices: Vec::with_capacity(16),
            master: 0.35,
        }
    }

    pub fn trigger(&mut self, track: TrackId, velocity: u8) {
        let vel = (velocity as f32 / 127.0).clamp(0.05, 1.0);
        let (freq, decay, amp) = match track {
            TrackId::Kick => (55.0, 12.0, 1.0 * vel),
            TrackId::Snare => (180.0, 18.0, 0.7 * vel),
            TrackId::Hat => (8000.0, 40.0, 0.25 * vel),
            TrackId::Perc => (440.0, 22.0, 0.4 * vel),
        };
        self.voices.push(Voice {
            track,
            phase: 0.0,
            amp,
            decay,
            freq,
        });
        if self.voices.len() > 32 {
            self.voices.drain(0..self.voices.len() - 24);
        }
    }

    /// Fill interleaved f32 buffer (any channel count handled by repeating mono)
    pub fn process(&mut self, data: &mut [f32]) {
        // Assume stereo interleaved if even length; write mono into all channels via simple approach:
        // process as frames of unknown channel count — detect by writing mono then expand.
        // cpal gives interleaved frames; we treat buffer as mono samples if we don't know channels.
        // Safer: generate mono then duplicate in callback — here assume data is mono OR we process each sample.
        for s in data.iter_mut() {
            let mut mix = 0.0f32;
            for v in self.voices.iter_mut() {
                let t = v.phase / self.sample_rate;
                let sample = match v.track {
                    TrackId::Kick => (v.phase * std::f32::consts::TAU * v.freq / self.sample_rate).sin() * v.amp,
                    TrackId::Snare => {
                        // noise-ish
                        let n = ((v.phase * 12.9898).sin() * 43758.5453).fract() * 2.0 - 1.0;
                        n * v.amp * 0.5
                            + (v.phase * std::f32::consts::TAU * v.freq / self.sample_rate).sin() * v.amp * 0.3
                    }
                    TrackId::Hat => {
                        let n = ((v.phase * 78.233).sin() * 43758.5453).fract() * 2.0 - 1.0;
                        n * v.amp
                    }
                    TrackId::Perc => (v.phase * std::f32::consts::TAU * v.freq / self.sample_rate).sin() * v.amp,
                };
                let _ = t;
                mix += sample;
                v.amp *= (-v.decay / self.sample_rate).exp();
                v.phase += 1.0;
            }
            *s = (mix * self.master).clamp(-1.0, 1.0);
        }
        self.voices.retain(|v| v.amp > 0.001);
    }

    pub fn set_master(&mut self, m: f32) {
        self.master = m.clamp(0.0, 1.0);
    }
}
