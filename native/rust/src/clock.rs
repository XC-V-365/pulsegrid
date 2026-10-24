use crate::pattern::{
    active_pattern, seconds_per_step, Banks, Pattern, Transport, SONG_SLOTS, STEPS,
};

pub type StepFn = Box<dyn FnMut(usize, f64, &Pattern) + Send>;

pub struct SequencerClock {
    next_note_time: f64,
    loops_in_slot: u32,
    on_step: Option<StepFn>,
}

impl Default for SequencerClock {
    fn default() -> Self {
        Self {
            next_note_time: 0.0,
            loops_in_slot: 0,
            on_step: None,
        }
    }
}

impl SequencerClock {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn set_callback<F>(&mut self, f: F)
    where
        F: FnMut(usize, f64, &Pattern) + Send + 'static,
    {
        self.on_step = Some(Box::new(f));
    }

    pub fn start(&mut self, tr: &mut Transport, now: f64) {
        tr.playing = true;
        tr.step = 0;
        self.loops_in_slot = 0;
        self.next_note_time = now + 0.05;
        if tr.song_mode {
            tr.song_index = 0;
            tr.active_bank = tr.song_chain[0];
        }
    }

    pub fn stop(&mut self, tr: &mut Transport) {
        tr.playing = false;
    }

    fn advance_song(&mut self, tr: &mut Transport) {
        if !tr.song_mode || tr.step != 0 {
            return;
        }
        if self.loops_in_slot > 0 {
            tr.song_index = (tr.song_index + 1) % SONG_SLOTS;
            tr.active_bank = tr.song_chain[tr.song_index];
        }
        self.loops_in_slot += 1;
    }

    pub fn tick(&mut self, tr: &mut Transport, banks: &Banks, now: f64) {
        if !tr.playing {
            return;
        }
        let ahead = 0.1;
        while self.next_note_time < now + ahead {
            self.advance_song(tr);
            let step = tr.step;
            let mut t = self.next_note_time;
            if step % 2 == 1 {
                t += tr.swing as f64 * 0.75 * seconds_per_step(tr.bpm);
            }
            let pat = active_pattern(banks, tr.active_bank);
            if let Some(cb) = self.on_step.as_mut() {
                cb(step, t, pat);
            }
            tr.step = (step + 1) % STEPS;
            self.next_note_time += seconds_per_step(tr.bpm);
        }
    }
}
