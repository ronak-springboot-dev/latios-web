#!/usr/bin/env bash
# Fetch Qwen-Image-Edit-2511 — the current edit model.
#
# There is no "Qwen 3 Image Edit": the line is dated rather than numbered, and
# 2511 (December 2025) is the release after the 2509 this project has been
# running. It holds identity better across pose and lighting changes, which is
# the whole job when a brand mark has to survive a re-render.
#
# Q6_K, not Q4. fetch_edit_q6.sh records why: Q4 is exactly where the wordmark
# came back "Lohxs". These banners carry Intel, AMD and NVIDIA lettering to
# production, so the quant that holds lettering is the only defensible one.
# Q4_K_M is fetched alongside it purely as the fast iteration model.
#
# Resumable: re-running skips a completed file and continues a partial one.
set -u

UNET="/c/Ronak/ComfyUI/models/diffusion_models"
BASE="https://huggingface.co/unsloth/Qwen-Image-Edit-2511-GGUF/resolve/main"

mkdir -p "$UNET"

# name  minimum-MB-to-count-as-complete
get () {
  local file="$1" floor="$2"
  local dest="$UNET/$file"
  if [ -f "$dest" ] && [ "$(( $(stat -c%s "$dest") / 1048576 ))" -ge "$floor" ]; then
    echo "SKIP $file already present"
    return 0
  fi
  echo "GET  $file"
  curl -fL -C - --retry 5 --retry-delay 5 --retry-all-errors \
       -o "$dest" "$BASE/$file" 2>&1 | tail -1
  echo "DONE $file -> $(( $(stat -c%s "$dest" 2>/dev/null || echo 0) / 1048576 ))MB"
}

get "qwen-image-edit-2511-Q6_K.gguf"   16000
get "qwen-image-edit-2511-Q4_K_M.gguf" 12500

echo "ALL DONE"
ls -la "$UNET" | grep 2511
