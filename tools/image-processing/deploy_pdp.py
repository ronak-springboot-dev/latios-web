"""
Publish the generated PDP assets into frontend/public.

    python deploy_pdp.py            # reveal sequences and bands
    python deploy_pdp.py reveal     # just one of them
    python deploy_pdp.py --check    # report drift, copy nothing

Written because these were being copied by hand, which is how the frame counts
and the manifests in the page data drifted apart in the first place. The check
mode compares what is on disk against what the pages claim, and is the same
comparison tools/verify_pages.mjs makes from the other side.
"""
import shutil
import sys
from pathlib import Path

GEN = Path(__file__).parent / "generated"
PUBLIC = Path(r"C:\Ronak\latios-web\frontend\public")

JOBS = {
    "reveal": (GEN / "reveal", PUBLIC / "reveal", "*.webp"),
    "bands": (GEN / "bands", PUBLIC / "bands", "*.webp"),
    "videos": (GEN / "videos", PUBLIC / "videos", "*.mp4"),
    "posters": (GEN / "posters", PUBLIC / "images/posters", "*.webp"),
    "fronts": (GEN / "fronts", PUBLIC / "images/fronts", "*.webp"),
}


def deploy(name, check=False):
    src, dest, pattern = JOBS[name]
    if not src.exists():
        print(f"  {name}: nothing generated yet")
        return
    copied = skipped = 0
    for f in sorted(src.rglob(pattern)):
        rel = f.relative_to(src)
        # PROOF- files are layout tests, never product assets.
        if rel.name.startswith(("PROOF-", "_")):
            continue
        out = dest / rel
        if out.exists() and out.stat().st_mtime >= f.stat().st_mtime \
                and out.stat().st_size == f.stat().st_size:
            skipped += 1
            continue
        if not check:
            out.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(f, out)
        copied += 1
    # a manifest alongside, where one exists
    for man in ("manifests.json", "manifest.json"):
        m = src / man
        if m.exists() and not check:
            (dest / man).parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(m, dest / man)
    verb = "would copy" if check else "copied"
    print(f"  {name:8s} {verb} {copied}, up to date {skipped}  -> {dest}")


if __name__ == "__main__":
    names = [a for a in sys.argv[1:] if not a.startswith("--")] or list(JOBS)
    for n in names:
        deploy(n, check="--check" in sys.argv)
