#!/usr/bin/env bash
# Add Qwen-Image BASE (text-to-image) alongside the already-installed
# Qwen-Image-Edit. Only the unet is fetched: the base model reuses the very same
# qwen_2.5_vl_7b text encoder and qwen_image_vae already on disk.
#
# Q6_K for the component renders — these are the highest-clarity assets on the
# site and there is no wordmark in them to garble, so the extra offload is worth
# the render time.
#
# Plus RealESRGAN x4plus for the upscale pass. NOT UltraSharpV2, which is
# sharper but CC-BY-NC-SA-4.0 — non-commercial, and this is a storefront.
set -u
ROOT="/c/Ronak/ComfyUI"
UNET="$ROOT/models/diffusion_models"
UPS="$ROOT/models/upscale_models"
mkdir -p "$UNET" "$UPS"

get () {
  local url="$1" dest="$2" expect_mb="$3"
  local name; name=$(basename "$dest")
  if [ -f "$dest" ]; then
    local have=$(( $(stat -c%s "$dest") / 1048576 ))
    [ "$have" -ge "$expect_mb" ] && { echo "SKIP   $name (${have}MB)"; return 0; }
    echo "RESUME $name (${have}/${expect_mb}MB)"
  else
    echo "GET    $name (~${expect_mb}MB)"
  fi
  curl -fL -C - --retry 5 --retry-delay 5 --retry-all-errors -o "$dest" "$url" 2>&1 | tail -1
  echo "DONE   $name -> $(( $(stat -c%s "$dest" 2>/dev/null || echo 0) / 1048576 ))MB"
}

get "https://huggingface.co/city96/Qwen-Image-gguf/resolve/main/qwen-image-Q6_K.gguf" \
    "$UNET/qwen-image-Q6_K.gguf" 15000
get "https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth" \
    "$UPS/RealESRGAN_x4plus.pth" 60

echo; echo "=== inventory ==="
ls -la "$UNET"/*.gguf "$UPS"/* 2>/dev/null | awk '{printf "  %6.1f GB  %s\n", $5/1073741824, $9}'
