#!/usr/bin/env bash
# Fetch ComfyUI + Qwen-Image-Edit-2509 (Apache-2.0) GGUF stack.
#
# Deliberately a SEPARATE install from the working Forge stack at
# /c/Ronak/webui_forge_cu121_torch231 — that one keeps its torch 2.11.0+cu128
# and FLUX GGUF weights untouched. Nothing here writes outside $ROOT.
#
# Resumable: re-running skips completed files and continues partial ones.
set -u

ROOT="/c/Ronak/ComfyUI"
UNET="$ROOT/models/diffusion_models"
TENC="$ROOT/models/text_encoders"
VAE="$ROOT/models/vae"

if [ ! -d "$ROOT/.git" ]; then
  echo "=== cloning ComfyUI ==="
  git clone --depth 1 https://github.com/comfyanonymous/ComfyUI "$ROOT" || exit 1
fi

# City96's GGUF loader nodes — Qwen GGUF will not load without these.
NODE="$ROOT/custom_nodes/ComfyUI-GGUF"
if [ ! -d "$NODE/.git" ]; then
  echo "=== cloning ComfyUI-GGUF ==="
  git clone --depth 1 https://github.com/city96/ComfyUI-GGUF "$NODE"
fi

mkdir -p "$UNET" "$TENC" "$VAE"

get () {
  local url="$1" dest="$2" expect_mb="$3"
  local name; name=$(basename "$dest")
  if [ -f "$dest" ]; then
    local have_mb=$(( $(stat -c%s "$dest") / 1048576 ))
    if [ "$have_mb" -ge "$expect_mb" ]; then
      echo "SKIP   $name (already ${have_mb}MB)"; return 0
    fi
    echo "RESUME $name (have ${have_mb}MB / ~${expect_mb}MB)"
  else
    echo "GET    $name (~${expect_mb}MB)"
  fi
  curl -fL -C - --retry 5 --retry-delay 5 --retry-all-errors -o "$dest" "$url" 2>&1 | tail -2
  echo "DONE   $name -> $(( $(stat -c%s "$dest" 2>/dev/null || echo 0) / 1048576 ))MB"
}

get "https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/resolve/main/split_files/vae/qwen_image_vae.safetensors" \
    "$VAE/qwen_image_vae.safetensors" 240
get "https://huggingface.co/QuantStack/Qwen-Image-Edit-2509-GGUF/resolve/main/Qwen-Image-Edit-2509-Q4_K_M.gguf" \
    "$UNET/Qwen-Image-Edit-2509-Q4_K_M.gguf" 11000
get "https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/resolve/main/split_files/text_encoders/qwen_2.5_vl_7b_fp8_scaled.safetensors" \
    "$TENC/qwen_2.5_vl_7b_fp8_scaled.safetensors" 8500

echo
echo "=== inventory ==="
ls -la "$UNET" "$TENC" "$VAE" 2>/dev/null | grep -v '^total\|^d'
