// IMAGE SLOT GUIDE
// Drop your own files in /public/custom-images/ and swap any path below
// in products.js / models.js / Home.jsx. Nothing here is imported by the app —
// this file is a reference map of every image slot and its current value.

export const IMAGE_SLOTS = {
  "Category heroes (products.js > hero)": {
    laptops: "/images/laptops-hero.jpg",
    towers: "/images/dp180-1.webp (lineup tile) + pexels hero",
    audio: "/images/audio-hero.jpg",
    video: "/images/video-hero.jpg",
  },
  "Category chapters (products.js > chapters[].image)": {
    laptops: ["/images/laptop-real-1.jpg", "/images/laptop-rugged.jpg", "/images/laptop-archer.jpg"],
    towers: ["/images/office.png", "/images/ops.jpg", "/images/home-setup.png"],
    audio: ["/images/av-sp50.jpg", "/images/av-soundbar.jpg", "/images/av-hps.jpg"],
    video: ["/images/av-monitor.jpg", "/images/av-ptz.jpg", "/images/av-ifp.jpg"],
  },
  "Model cards + turntables (models.js > image / gallery)": {
    mt_models: "/images/dp180-1..4.webp",
    sff_models: "/images/dp80-1..2.webp",
    mff_model: "/images/dp10-1..2.webp",
    laptops: ["/images/laptop-pro14.jpg", "/images/laptop-rugged.jpg", "/images/laptop-archer.jpg"],
    audio: ["/images/av-sp50.jpg", "/images/av-soundbar.jpg", "/images/av-soundbar4k.jpg", "/images/av-hps.jpg"],
    video: [
      "/images/av-webcam.jpg",
      "/images/av-ptz.jpg",
      "/images/av-monitor.jpg",
      "/images/av-lfd.jpg",
      "/images/av-ifp.jpg",
      "/images/av-led.jpg",
    ],
  },
  "Model feature sections (models.js > *_FEATURES[].image)": {
    towers_mt: ["/images/perf.png", "/images/io-right.png", "/images/easy.png", "/images/chassis.png"],
    towers_sff: ["/images/office.png", "/images/versatile.png", "/images/speaker.png", "/images/chassis.png"],
    towers_mff: ["/images/palm.jpg", "/images/triple.png", "/images/cable.png"],
    promax: ["/images/rtx.jpg", "/images/ddr5.jpg", "/images/display.jpg"],
  },
  "Homepage (Home.jsx)": {
    about_factory: "/images/factory.jpg",
    applications: ["av-ifp.jpg", "laptop-rugged.jpg", "ops.jpg", "av-monitor.jpg", "factory.jpg", "audio-hero.jpg"],
  },
};
