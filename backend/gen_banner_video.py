import os
import sys
from dotenv import load_dotenv

sys.path.insert(0, os.path.abspath(""))

from emergentintegrations.llm.openai.video_generation import OpenAIVideoGeneration

load_dotenv()

PROMPT = (
    "Slow cinematic orbit around a sleek black mid-tower business desktop computer standing on a "
    "matte dark surface, subtle cool blue LED accent lighting along the front edge, soft studio "
    "reflections gliding across the brushed metal panels, shallow depth of field, dark premium "
    "enterprise product commercial style, photorealistic, ultra detailed, smooth camera motion, "
    "seamless ambient loop"
)

video_gen = OpenAIVideoGeneration(api_key=os.environ["EMERGENT_LLM_KEY"])
video_bytes = video_gen.text_to_video(
    prompt=PROMPT,
    model="sora-2-pro",
    size="1792x1024",
    duration=8,
    max_wait_time=900,
)
if video_bytes:
    video_gen.save_video(video_bytes, "/app/frontend/public/videos/mt-amd-am4-loop.mp4")
    print("SUCCESS: video saved")
else:
    print("FAILED: no video bytes")
