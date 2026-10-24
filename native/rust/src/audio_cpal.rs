//! cpal output — enable: cargo run --features audio
//! System deps (Linux): pkg-config libasound2-dev

use std::sync::{Arc, Mutex};

use crate::engine::VoiceEngine;

/// Holds the live stream so it is not dropped (and stopped) immediately.
#[cfg(feature = "audio")]
pub struct AudioStream {
    // Stream is !Send on some hosts; keep as Option in Arc<Mutex> behind feature
    _keep: Option<()>,
}

#[cfg(feature = "audio")]
static STREAM_SLOT: Mutex<Option<cpal::Stream>> = Mutex::new(None);

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
        eng.set_master(0.4);
    }

    let eng_cb = Arc::clone(&engine);
    let stream = device
        .build_output_stream(
            &config,
            move |data: &mut [f32], _| {
                let ch = channels.max(1);
                let frames = data.len() / ch;
                let mut mono = vec![0.0f32; frames];
                if let Ok(mut eng) = eng_cb.lock() {
                    eng.process(&mut mono);
                }
                for (i, frame) in mono.iter().enumerate() {
                    for c in 0..ch {
                        let idx = i * ch + c;
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

    // Keep stream alive for process lifetime
    if let Ok(mut slot) = STREAM_SLOT.lock() {
        *slot = Some(stream);
    } else {
        std::mem::forget(stream);
    }
    Ok(())
}

#[cfg(not(feature = "audio"))]
pub fn start_output(_engine: Arc<Mutex<VoiceEngine>>) -> Result<(), String> {
    Err("build with --features audio (needs pkg-config + libasound2-dev on Linux)".into())
}

#[cfg(feature = "audio")]
pub fn stop_output() {
    if let Ok(mut slot) = STREAM_SLOT.lock() {
        *slot = None;
    }
}

#[cfg(not(feature = "audio"))]
pub fn stop_output() {}

#[cfg(feature = "audio")]
pub fn list_hosts() -> Vec<String> {
    use cpal::traits::{DeviceTrait, HostTrait};
    let mut out = Vec::new();
    for id in cpal::available_hosts() {
        out.push(format!("host:{id:?}"));
        if let Ok(host) = cpal::host_from_id(id) {
            if let Some(dev) = host.default_output_device() {
                if let Ok(name) = dev.name() {
                    out.push(format!("  default_out: {name}"));
                }
                if let Ok(cfg) = dev.default_output_config() {
                    out.push(format!(
                        "  rate={} ch={} fmt={:?}",
                        cfg.sample_rate().0,
                        cfg.channels(),
                        cfg.sample_format()
                    ));
                }
            }
        }
    }
    if out.is_empty() {
        out.push(format!("default_host:{:?}", cpal::default_host().id()));
    }
    out
}

#[cfg(not(feature = "audio"))]
pub fn list_hosts() -> Vec<String> {
    vec!["(enable feature audio — cargo build --features audio)".into()]
}

#[cfg(feature = "audio")]
pub fn list_output_devices() -> Vec<String> {
    use cpal::traits::{DeviceTrait, HostTrait};
    let host = cpal::default_host();
    match host.output_devices() {
        Ok(devs) => devs
            .filter_map(|d| d.name().ok())
            .collect(),
        Err(_) => vec![],
    }
}

#[cfg(not(feature = "audio"))]
pub fn list_output_devices() -> Vec<String> {
    vec!["(enable feature audio)".into()]
}
