//! Soft-synth voice engine for cpal callback (kick/snare/hat/perc)

use crate::pattern::TrackId;

#[derive(Clone, Debug)]
struct Voice {
    track: TrackId,
    phase: f32,
    amp: f32,
    decay: f32,
    freq: f32,
    pitch_env: f32,
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

    pub fn sample_rate(&self) -> f32 {
        self.sample_rate
    }

    pub fn trigger(&mut self, track: TrackId, velocity: u8) {
        let vel = (velocity as f32 / 127.0).clamp(0.05, 1.0);
        let (freq, decay, amp, pitch_env) = match track {
            TrackId::Kick => (55.0, 14.0, 1.0 * vel, 80.0),
            TrackId::Snare => (180.0, 20.0, 0.75 * vel, 0.0),
            TrackId::Hat => (9000.0, 55.0, 0.28 * vel, 0.0),
            TrackId::Perc => (440.0, 24.0, 0.45 * vel, 30.0),
        };
        self.voices.push(Voice {
            track,
            phase: 0.0,
            amp,
            decay,
            freq,
            pitch_env,
        });
        if self.voices.len() > 32 {
            self.voices.drain(0..self.voices.len() - 24);
        }
    }

    /// Fill mono f32 buffer (cpal callback expands to channels)
    pub fn process(&mut self, data: &mut [f32]) {
        let sr = self.sample_rate;
        for s in data.iter_mut() {
            let mut mix = 0.0f32;
            for v in self.voices.iter_mut() {
                let f = v.freq + v.pitch_env * v.amp;
                let sample = match v.track {
                    TrackId::Kick => {
                        (v.phase * std::f32::consts::TAU * f / sr).sin() * v.amp
                    }
                    TrackId::Snare => {
                        let n = hash_noise(v.phase);
                        n * v.amp * 0.55
                            + (v.phase * std::f32::consts::TAU * v.freq / sr).sin() * v.amp * 0.25
                    }
                    TrackId::Hat => hash_noise(v.phase * 1.7) * v.amp,
                    TrackId::Perc => {
                        (v.phase * std::f32::consts::TAU * f / sr).sin() * v.amp
                    }
                };
                mix += sample;
                v.amp *= (-v.decay / sr).exp();
                v.phase += 1.0;
            }
            *s = (mix * self.master).clamp(-1.0, 1.0);
        }
        self.voices.retain(|v| v.amp > 0.001);
    }

    pub fn set_master(&mut self, m: f32) {
        self.master = m.clamp(0.0, 1.0);
    }

    pub fn voice_count(&self) -> usize {
        self.voices.len()
    }
}

fn hash_noise(phase: f32) -> f32 {
    ((phase * 12.9898).sin() * 43758.5453).fract() * 2.0 - 1.0
}
