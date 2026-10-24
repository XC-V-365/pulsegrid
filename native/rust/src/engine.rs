use crate::pattern::{TrackId, TRACKS};

/// Sample kit + synth trigger stub. Wire to `cpal` + buffer playback.
pub struct VoiceEngine {
    has_sample: [bool; TRACKS],
    master_gain: f32,
}

impl Default for VoiceEngine {
    fn default() -> Self {
        Self {
            has_sample: [false; TRACKS],
            master_gain: 0.7,
        }
    }
}

impl VoiceEngine {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn load_sample_flag(&mut self, track: TrackId, loaded: bool) {
        self.has_sample[track as usize] = loaded;
    }

    pub fn clear_kit(&mut self) {
        self.has_sample = [false; TRACKS];
    }

    pub fn set_master_gain(&mut self, g: f32) {
        self.master_gain = g;
    }

    /// Schedule voice at host time. Prefer sample if present, else synth recipe.
    pub fn trigger(&mut self, track: TrackId, vel: u8, _time_sec: f64) {
        let _ = (track, vel, self.master_gain, self.has_sample);
        // TODO: push to lock-free voice queue consumed in cpal callback
    }

    pub fn process(&mut self, out: &mut [f32]) {
        for s in out.iter_mut() {
            *s = 0.0;
        }
    }
}
