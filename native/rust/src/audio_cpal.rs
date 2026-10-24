//! cpal output — enable: cargo run --features audio

use std::sync::{Arc, Mutex};

use crate::engine::VoiceEngine;

#[cfg(feature = "audio")]
pub fn start_output(engine: Arc<Mutex<VoiceEngine>>) -> Result<(), String> {
    use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
    let host = cpal::default_host();
    let device = host
        .default_output_device()
        .ok_or_else(|| "no default output device".to_string())?;
    let supported = device
        .default_output_config()
        .map_err(|e| e.to_string())?;
    let sample_rate = supported.sample_rate().0 as f32;
    let channels = supported.channels() as usize;
    let config = supported.config();

    {
        let mut eng = engine.lock().map_err(|e| e.to_string())?;
        *eng = VoiceEngine::new(sample_rate);
    }

    let eng_cb = Arc::clone(&engine);
    let stream = device
        .build_output_stream(
            &config,
            move |data: &mut [f32], _| {
                let frames = data.len() / channels.max(1);
                let mut mono = vec![0.0f32; frames];
                if let Ok(mut eng) = eng_cb.lock() {
                    eng.process(&mut mono);
                }
                for (i, frame) in mono.iter().enumerate() {
                    for ch in 0..channels {
                        let idx = i * channels + ch;
                        if idx < data.len() {
                            data[idx] = *frame;
                        }
                    }
                }
            },
            |err| eprintln!("cpal stream error: {err}"),
            None,
        )
        .map_err(|e| e.to_string())?;
    stream.play().map_err(|e| e.to_string())?;
    std::mem::forget(stream);
    Ok(())
}

#[cfg(not(feature = "audio"))]
pub fn start_output(_engine: Arc<Mutex<VoiceEngine>>) -> Result<(), String> {
    Err("build with --features audio".into())
}

#[cfg(feature = "audio")]
pub fn list_hosts() -> Vec<String> {
    use cpal::traits::HostTrait;
    let host = cpal::default_host();
    vec![format!("{:?}", host.id())]
}

#[cfg(not(feature = "audio"))]
pub fn list_hosts() -> Vec<String> {
    vec!["(enable feature audio)".into()]
}
