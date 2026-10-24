//! Optional `cpal` output skeleton — enable with feature `audio`
//! cargo run --features audio
//!
//! Add to Cargo.toml:
//!   cpal = { version = "0.15", optional = true }
//!   [features]
//!   audio = ["cpal"]

#![allow(dead_code)]

use crate::engine::VoiceEngine;

/// Start a duplex-less output stream that pulls `VoiceEngine::process`.
/// Production: run SequencerClock on a high-res timer or inside the callback
/// with a lock-free command queue (e.g. rtrb).
#[cfg(feature = "audio")]
pub fn start_output(engine: std::sync::Arc<std::sync::Mutex<VoiceEngine>>) -> Result<(), String> {
    use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
    let host = cpal::default_host();
    let device = host
        .default_output_device()
        .ok_or_else(|| "no output device".to_string())?;
    let config = device
        .default_output_config()
        .map_err(|e| e.to_string())?
        .config();
    let channels = config.channels as usize;
    let stream = device
        .build_output_stream(
            &config,
            move |data: &mut [f32], _| {
                if let Ok(mut eng) = engine.lock() {
                    eng.process(data);
                } else {
                    for s in data.iter_mut() {
                        *s = 0.0;
                    }
                }
                let _ = channels;
            },
            |err| eprintln!("cpal error: {err}"),
            None,
        )
        .map_err(|e| e.to_string())?;
    stream.play().map_err(|e| e.to_string())?;
    // Leak stream for demo; real app stores it
    std::mem::forget(stream);
    Ok(())
}

#[cfg(not(feature = "audio"))]
pub fn start_output(_engine: std::sync::Arc<std::sync::Mutex<VoiceEngine>>) -> Result<(), String> {
    Err("build with --features audio (cpal)".into())
}
