/**
 * Latios Notebook 14.  The everyday notebook of the range, in teal.
 *
 * There is no specification sheet for this machine yet, so this page claims no
 * numbers at all: no spec table, no stat rows, and copy that describes only
 * what its renders actually show -- a slim aluminium body, a full-size
 * keyboard, and the ports along its sides. The one number a reader wants,
 * the specification, is promised rather than guessed.
 *
 * Its images are the factory's CAD views (ID-open), with the Latios wordmark
 * on the lid and a Latios screen on the display, both composited from the real
 * wordmark file (tools/image-processing/gen_notebook.py).
 */
export default {
  sections: [
    {
      "type": "hero"
    },
    {
      "type": "featureSplit",
      "pill": "Latios Notebook 14",
      "heading": "The everyday",
      "headingAccent": "notebook.",
      "body": "A slim aluminium body, a full-size keyboard and a screen that fills its lid — the machine for the ordinary working day, in a shape that disappears into a bag.",
      "image": "/images/laptops/notebook14/hero.webp",
      "alt": "The Latios Notebook 14 open, seen from the right, against a dark studio ground",
      "glow": "horizon",
      "frame": "rounded"
    },
    {
      "type": "bento",
      "heading": "What the pictures show.",
      "cards": [
        {
          "col": 1, "size": "tall",
          "title": "Slim aluminium", "subtitle": "A lid that closes flat and flush",
          "image": "/images/laptops/notebook14/lid.webp",
          "alt": "The Latios Notebook 14 from the rear, its wordmark on the lid",
          "fit": "cover"
        },
        {
          "col": 1, "size": "short",
          "title": "Full-size keyboard", "subtitle": "Number row, arrows, and a trackpad to match",
          "image": "/images/laptops/notebook14/keyboard.webp",
          "alt": "The Latios Notebook 14's keyboard, seen from above",
          "fit": "cover"
        },
        {
          "col": 2, "size": "text",
          "title": "Ports, not dongles", "subtitle": "USB-C, USB-A, HDMI and a headphone jack along its sides"
        },
        {
          "col": 2, "size": "short",
          "title": "Open", "subtitle": "The screen you actually work on",
          "image": "/images/laptops/notebook14/angle.webp",
          "alt": "The Latios Notebook 14 open, seen from the left",
          "fit": "cover"
        },
        {
          "col": 3, "size": "text",
          "title": "Specifications soon", "subtitle": "The full sheet for this machine is being finalised. Ask us for it and we will send it the day it lands."
        }
      ]
    },
    {
      "type": "featureSplit",
      "pill": "Design",
      "heading": "Made to be",
      "headingAccent": "carried.",
      "body": "The lid is aluminium, the edges are cut clean, and the wordmark is the only thing on it. Closed, it is flat enough to slide between a notebook and a folder.",
      "image": "/images/laptops/notebook14/lid.webp",
      "alt": "The Latios Notebook 14 closed at an angle, its lid lit",
      "flip": true
    },
    {
      "type": "banner",
      "image": "/images/laptops/notebook14/hero.webp",
      "kicker": "The everyday notebook",
      "headline": "Specifications, shortly.",
      "subline": "This page will carry the full sheet — processor, memory, display and battery — the moment it is confirmed."
    }
  ]
};
