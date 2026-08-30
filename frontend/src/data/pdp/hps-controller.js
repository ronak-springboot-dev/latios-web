/**
 * Latios hps-controller.
 */
export default {
  sections: [
    {
      "type": "hero"
    },
    {
      "type": "statWall",
      "align": "center",
      "heading": "Max units, and what sits behind it.",
      "stats": [
        [
          "200",
          "Max units",
          "With external processor"
        ],
        [
          "5",
          "Band EQ",
          "Tuned per room"
        ],
        [
          "60",
          "Direct units",
          "Before expansion"
        ]
      ]
    },
    {
      "type": "walkthrough",
      "image": "/images/av-hps.jpg",
      "kicker": "Walkthrough",
      "heading": "Structured discussion, at scale.",
      "body": "Scroll through how a host-participant system stays orderly at 200 units.",
      "height": 240,
      "points": [
        {
          "at": 0.0,
          "x": 0.5,
          "y": 0.32,
          "label": "Touch control",
          "text": "Capacitive buttons rather than mechanical switches."
        },
        {
          "at": 0.3,
          "x": 0.32,
          "y": 0.58,
          "label": "60 units",
          "text": "Supported directly, before any expansion."
        },
        {
          "at": 0.58,
          "x": 0.68,
          "y": 0.56,
          "label": "200 with processor",
          "text": "An external processor takes it to full room scale."
        },
        {
          "at": 0.82,
          "x": 0.5,
          "y": 0.74,
          "label": "5-band EQ",
          "text": "Tuned per room, not per device."
        }
      ]
    },
    {
      "type": "featureGrid",
      "heading": "What you are actually buying.",
      "items": [
        {
          "icon": "Wifi",
          "title": "Up to 200 units",
          "desc": "60 directly, 200 with an external processor."
        },
        {
          "icon": "MemoryStick",
          "title": "5-band EQ",
          "desc": "Room tuning, not device tuning."
        },
        {
          "icon": "Usb",
          "title": "Touch buttons",
          "desc": "Capacitive, with a built-in loudspeaker."
        },
        {
          "icon": "ShieldCheck",
          "title": "Host-participant",
          "desc": "Structured turn-taking by design."
        }
      ]
    },
    {
      "type": "specTeaser"
    }
  ],
};
