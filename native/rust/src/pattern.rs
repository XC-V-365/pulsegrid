pub const STEPS: usize = 16;
pub const TRACKS: usize = 4;
pub const SONG_SLOTS: usize = 8;

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum TrackId {
    Kick = 0,
    Snare = 1,
    Hat = 2,
    Perc = 3,
}

#[derive(Clone, Copy, Debug, Default)]
pub struct StepCell {
    pub vel: u8,  // 0–3
    pub prob: u8, // 0–100
}

pub type TrackPattern = [StepCell; STEPS];
pub type Pattern = [TrackPattern; TRACKS];

#[derive(Clone, Debug)]
pub struct Banks {
    pub a: Pattern,
    pub b: Pattern,
}

#[derive(Clone, Debug)]
pub struct Transport {
    pub bpm: f32,
    pub swing: f32,
    pub volume: f32,
    pub playing: bool,
    pub step: usize,
    pub active_bank: char,
    pub song_mode: bool,
    pub song_index: usize,
    pub song_chain: [char; SONG_SLOTS],
}

impl Default for Transport {
    fn default() -> Self {
        Self {
            bpm: 120.0,
            swing: 0.0,
            volume: 0.7,
            playing: false,
            step: 0,
            active_bank: 'A',
            song_mode: false,
            song_index: 0,
            song_chain: ['A', 'A', 'B', 'A', 'A', 'A', 'B', 'B'],
        }
    }
}

impl Default for Banks {
    fn default() -> Self {
        Self {
            a: default_pattern(),
            b: empty_pattern(),
        }
    }
}

pub fn empty_pattern() -> Pattern {
    [[StepCell::default(); STEPS]; TRACKS]
}

pub fn default_pattern() -> Pattern {
    let mut p = empty_pattern();
    for &i in &[0usize, 4, 8, 12] {
        p[0][i] = StepCell { vel: 3, prob: 100 };
    }
    for &i in &[4usize, 12] {
        p[1][i] = StepCell { vel: 3, prob: 100 };
    }
    for i in (0..STEPS).step_by(2) {
        p[2][i] = StepCell {
            vel: if i % 4 == 0 { 2 } else { 1 },
            prob: 100,
        };
    }
    p[3][6] = StepCell { vel: 2, prob: 85 };
    p[3][14] = StepCell { vel: 2, prob: 85 };
    p
}

pub fn active_pattern<'a>(banks: &'a Banks, bank: char) -> &'a Pattern {
    if bank == 'B' {
        &banks.b
    } else {
        &banks.a
    }
}

pub fn active_pattern_mut<'a>(banks: &'a mut Banks, bank: char) -> &'a mut Pattern {
    if bank == 'B' {
        &mut banks.b
    } else {
        &mut banks.a
    }
}

pub fn midi_note(track: TrackId, vel: u8) -> u8 {
    match track {
        TrackId::Kick => 36,
        TrackId::Snare => 38,
        TrackId::Hat => {
            if vel >= 3 {
                46
            } else {
                42
            }
        }
        TrackId::Perc => 39,
    }
}

pub fn midi_velocity(vel: u8) -> u8 {
    (40 + vel as u16 * 28).min(127) as u8
}

pub fn seconds_per_step(bpm: f32) -> f64 {
    60.0 / bpm as f64 / 4.0
}
