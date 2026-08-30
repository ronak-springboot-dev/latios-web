#!/usr/bin/env bash
# Upgrade the Edit model from Q4_K_M to Q6_K.
#
# Q4 is where the wordmark garbled ("Lohxs") when it re-rendered a product into
# a scene. Q6 holds identity and lettering materially better, which matters when
# the output is a launch asset rather than a test.
#
# The Q4 file is deliberately left in place: it is ~3x faster and still the
# right choice for iteration passes.
set -u
UNET="/c/Ronak/ComfyUI/models/diffusion_models"
DEST="$UNET/Qwen-Image-Edit-2509-Q6_K.gguf"
URL="https://huggingface.co/QuantStack/Qwen-Image-Edit-2509-GGUF/resolve/main/Qwen-Image-Edit-2509-Q6_K.gguf"
if [ -f "$DEST" ] && [ "$(( $(stat -c%s "$DEST") / 1048576 ))" -ge 16000 ]; then
  echo "SKIP already present"; exit 0
fi
curl -fL -C - --retry 5 --retry-delay 5 --retry-all-errors -o "$DEST" "$URL" 2>&1 | tail -1
echo "DONE -> $(( $(stat -c%s "$DEST" 2>/dev/null || echo 0) / 1048576 ))MB"
