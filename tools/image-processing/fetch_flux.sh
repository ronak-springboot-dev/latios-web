#!/usr/bin/env bash
# Fetch FLUX.1-schnell (Apache-2.0) GGUF + encoders + VAE into the Forge model tree.
# Resumable: re-running skips completed files and continues partial ones (curl -C -).
set -u

BASE="/c/Ronak/webui_forge_cu121_torch231/webui/models"
UNET="$BASE/Stable-diffusion"
TENC="$BASE/text_encoder"
VAE="$BASE/VAE"
mkdir -p "$UNET" "$TENC" "$VAE"

get () {
  local url="$1" dest="$2" expect_mb="$3"
  local name; name=$(basename "$dest")
  if [ -f "$dest" ]; then
    local have_mb=$(( $(stat -c%s "$dest") / 1048576 ))
    if [ "$have_mb" -ge "$expect_mb" ]; then
      echo "SKIP  $name (already ${have_mb}MB)"
      return 0
    fi
    echo "RESUME $name (have ${have_mb}MB / ${expect_mb}MB)"
  else
    echo "GET   $name (${expect_mb}MB)"
  fi
  curl -fL -C - --retry 5 --retry-delay 5 --retry-all-errors \
       -o "$dest" "$url" 2>&1 | tail -2
  local final_mb=$(( $(stat -c%s "$dest" 2>/dev/null || echo 0) / 1048576 ))
  echo "DONE  $name -> ${final_mb}MB"
}

get "https://huggingface.co/comfyanonymous/flux_text_encoders/resolve/main/clip_l.safetensors" \
    "$TENC/clip_l.safetensors" 230
get "https://huggingface.co/second-state/FLUX.1-schnell-GGUF/resolve/main/ae.safetensors" \
    "$VAE/ae.safetensors" 315
get "https://huggingface.co/comfyanonymous/flux_text_encoders/resolve/main/t5xxl_fp8_e4m3fn.safetensors" \
    "$TENC/t5xxl_fp8_e4m3fn.safetensors" 4600
get "https://huggingface.co/city96/FLUX.1-schnell-gguf/resolve/main/flux1-schnell-Q4_K_S.gguf" \
    "$UNET/flux1-schnell-Q4_K_S.gguf" 6400

echo
echo "=== final inventory ==="
ls -la "$UNET"/*.gguf "$TENC"/*.safetensors "$VAE"/*.safetensors 2>/dev/null
