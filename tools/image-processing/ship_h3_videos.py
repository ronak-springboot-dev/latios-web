"""
Publish reviewed H3 clips into frontend/public.

    python ship_h3_videos.py sff-h610-ddr5 sff-am5-pro-ai ...

Deliberately takes an explicit list and has no "--all". Every clip named here
is one a human has actually watched, because H3 is generative: unlike the
composited clips from make_product_video.py, which are the real photograph and
the registered interior moved by a transform and so cannot drift, an H3 clip
can quietly become a different machine. Two of the three mt-amd-am4 attempts
did exactly that.

What passing looks like, checked frame by frame against generated/fronts/:
  - the chassis keeps its proportions and its silhouette
  - the port row keeps its count, order and colours
  - any marking visible in the source photograph stays correctly formed
  - nothing is added that the machine does not have

Naming matches make_product_video.py exactly ({slug}-loop.mp4 and
{slug}-loop.webp), so shipping is a file replacement and no page data changes -
the pages already point at these paths.

Writes into generated/videos, which is what deploy_pdp.py syncs from, rather
than straight into frontend/public. Copying only to public would work until the
next `deploy_pdp.py videos` silently put the composited clip back. The cost of
using the same slot is the reverse: re-running make_product_video.py for a
slug overwrites its H3 clip, so re-ship after doing that.
"""
import shutil
import sys
from pathlib import Path

HERE = Path(__file__).parent
STAGED = HERE / "generated" / "h3" / "videos"
VIDEOS = HERE / "generated" / "videos"
POSTERS = HERE / "generated" / "posters"


def ship(slug):
    clip = STAGED / f"{slug}-loop.mp4"
    if not clip.exists():
        print(f"  {slug:19s} no staged clip - run build_h3_videos.py first")
        return False
    VIDEOS.mkdir(parents=True, exist_ok=True)
    dest = VIDEOS / f"{slug}-loop.mp4"
    was = dest.stat().st_size if dest.exists() else 0
    shutil.copyfile(clip, dest)
    # build_h3_videos.py already wrote the poster into generated/posters from
    # the clip's own first frame, so it is in the right place already.
    poster = POSTERS / f"{slug}-loop.webp"
    print(f"  {slug:19s} composited {was/1e6:.1f} MB -> H3 {dest.stat().st_size/1e6:.1f} MB"
          f"{'' if poster.exists() else '  (NO POSTER)'}")
    return True


if __name__ == "__main__":
    slugs = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not slugs:
        print(__doc__)
        sys.exit(1)
    n = sum(ship(s) for s in slugs)
    print(f"\n  {n}/{len(slugs)} shipped into generated/videos"
          f"\n  now run: python deploy_pdp.py videos posters")
