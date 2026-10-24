//! midir MIDI out — enable: cargo run --features midi
//! Linux: midir links ALSA → needs pkg-config + libasound2-dev

use crate::midi::MidiOut;

pub struct MidirOut {
    #[cfg(feature = "midi")]
    conn: Option<midir::MidiOutputConnection>,
    #[cfg(feature = "midi")]
    last_port: String,
}

impl Default for MidirOut {
    fn default() -> Self {
        Self::new()
    }
}

impl MidirOut {
    pub fn new() -> Self {
        Self {
            #[cfg(feature = "midi")]
            conn: None,
            #[cfg(feature = "midi")]
            last_port: String::new(),
        }
    }

    pub fn is_open(&self) -> bool {
        #[cfg(feature = "midi")]
        {
            self.conn.is_some()
        }
        #[cfg(not(feature = "midi"))]
        {
            false
        }
    }

    #[cfg(feature = "midi")]
    pub fn port_name(&self) -> &str {
        &self.last_port
    }

    #[cfg(not(feature = "midi"))]
    pub fn port_name(&self) -> &str {
        ""
    }

    /// GM drum note-on then optional note-off after duration (best-effort immediate pair)
    pub fn drum_hit(&mut self, note: u8, velocity: u8, channel: u8) {
        self.note_on(channel, note, velocity, 0.0);
        self.note_off(channel, note, 0.0);
    }

    /// MIDI clock tick (0xF8)
    pub fn clock_tick(&mut self) {
        #[cfg(feature = "midi")]
        if let Some(c) = self.conn.as_mut() {
            let _ = c.send(&[0xF8]);
        }
    }

    pub fn start_transport(&mut self) {
        #[cfg(feature = "midi")]
        if let Some(c) = self.conn.as_mut() {
            let _ = c.send(&[0xFA]);
        }
    }

    pub fn stop_transport(&mut self) {
        #[cfg(feature = "midi")]
        if let Some(c) = self.conn.as_mut() {
            let _ = c.send(&[0xFC]);
        }
    }

    pub fn all_notes_off(&mut self, channel: u8) {
        #[cfg(feature = "midi")]
        if let Some(c) = self.conn.as_mut() {
            let ch = channel.saturating_sub(1) & 0x0f;
            let _ = c.send(&[0xB0 | ch, 123, 0]);
        }
        #[cfg(not(feature = "midi"))]
        {
            let _ = channel;
        }
    }
}

impl MidiOut for MidirOut {
    fn open(&mut self, port_name: &str) -> bool {
        #[cfg(feature = "midi")]
        {
            // Drop previous connection first
            self.conn = None;
            let out = match midir::MidiOutput::new("PulseGrid") {
                Ok(o) => o,
                Err(e) => {
                    eprintln!("midir: {e}");
                    return false;
                }
            };
            let ports = out.ports();
            if ports.is_empty() {
                eprintln!("midir: no output ports");
                return false;
            }
            let port = ports
                .iter()
                .find(|p| {
                    out.port_name(p)
                        .map(|n| {
                            port_name.is_empty()
                                || n.to_lowercase().contains(&port_name.to_lowercase())
                        })
                        .unwrap_or(false)
                })
                .or_else(|| ports.first());
            let Some(port) = port else {
                return false;
            };
            let name = out.port_name(port).unwrap_or_else(|_| "unknown".into());
            match out.connect(port, "pulsegrid-out") {
                Ok(c) => {
                    self.conn = Some(c);
                    self.last_port = name;
                    true
                }
                Err(e) => {
                    eprintln!("midir connect: {e}");
                    false
                }
            }
        }
        #[cfg(not(feature = "midi"))]
        {
            let _ = port_name;
            false
        }
    }

    fn close(&mut self) {
        #[cfg(feature = "midi")]
        {
            self.conn = None;
            self.last_port.clear();
        }
    }

    fn note_on(&mut self, channel: u8, note: u8, velocity: u8, _time_sec: f64) {
        #[cfg(feature = "midi")]
        if let Some(c) = self.conn.as_mut() {
            let ch = channel.saturating_sub(1) & 0x0f;
            let _ = c.send(&[0x90 | ch, note.min(127), velocity.min(127)]);
        }
        #[cfg(not(feature = "midi"))]
        {
            let _ = (channel, note, velocity);
        }
    }

    fn note_off(&mut self, channel: u8, note: u8, _time_sec: f64) {
        #[cfg(feature = "midi")]
        if let Some(c) = self.conn.as_mut() {
            let ch = channel.saturating_sub(1) & 0x0f;
            let _ = c.send(&[0x80 | ch, note.min(127), 0]);
        }
        #[cfg(not(feature = "midi"))]
        {
            let _ = (channel, note);
        }
    }
}

pub fn list_ports() -> Vec<String> {
    #[cfg(feature = "midi")]
    {
        let out = match midir::MidiOutput::new("PulseGrid-list") {
            Ok(o) => o,
            Err(e) => return vec![format!("(midir error: {e})")],
        };
        let ports = out.ports();
        if ports.is_empty() {
            return vec!["(no MIDI output ports)".into()];
        }
        ports
            .iter()
            .filter_map(|p| out.port_name(p).ok())
            .collect()
    }
    #[cfg(not(feature = "midi"))]
    {
        vec!["(enable --features midi)".into()]
    }
}

pub fn list_input_ports() -> Vec<String> {
    #[cfg(feature = "midi")]
    {
        let inp = match midir::MidiInput::new("PulseGrid-in-list") {
            Ok(i) => i,
            Err(_) => return vec![],
        };
        inp.ports()
            .iter()
            .filter_map(|p| inp.port_name(p).ok())
            .collect()
    }
    #[cfg(not(feature = "midi"))]
    {
        vec!["(enable --features midi)".into()]
    }
}
