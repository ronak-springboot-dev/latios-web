/**
 * Long-form product pages, one module per model.
 *
 * Each page's section list is the thing being designed, so it gets its own file
 * to read top to bottom. A model absent from here falls back to the standard
 * overview layout in ModelPage.
 */
import p_active_led from "./active-led";
import p_archer_ltg540z from "./archer-ltg540z";
import p_hps_controller from "./hps-controller";
import p_in_series_lfd from "./in-series-lfd";
import p_mff_dp10 from "./mff-dp10";
import p_mt_am5_pro_ai from "./mt-am5-pro-ai";
import p_mt_amd_am4 from "./mt-amd-am4";
import p_mt_h610_ddr4 from "./mt-h610-ddr4";
import p_mt_h610_ddr5 from "./mt-h610-ddr5";
import p_mt_pro_h610_ddr5 from "./mt-pro-h610-ddr5";
import p_mt_q670_ddr5 from "./mt-q670-ddr5";
import p_notebook_14 from "./notebook-14";
import p_pro_14 from "./pro-14";
import p_pro_ifp from "./pro-ifp";
import p_pro_monitor from "./pro-monitor";
import p_pro_ptz_camera from "./pro-ptz-camera";
import p_pro_video_soundbar from "./pro-video-soundbar";
import p_pro_web_camera from "./pro-web-camera";
import p_promax_q870 from "./promax-q870";
import p_promax_t2_w680 from "./promax-t2-w680";
import p_promax_t2_w880 from "./promax-t2-w880";
import p_promax_t4_plus from "./promax-t4-plus";
import p_sff_am5_pro_ai from "./sff-am5-pro-ai";
import p_sff_b860_pro_ai from "./sff-b860-pro-ai";
import p_sff_h610_ddr5 from "./sff-h610-ddr5";
import p_sff_h810_pro_ai from "./sff-h810-pro-ai";
import p_sp50_speakerphone from "./sp50-speakerphone";
import p_video_soundbar_4k from "./video-soundbar-4k";
import p_g4201_he from "./g4201-he";
import p_cx270_s5062 from "./cx270-s5062";
import p_cx271_s3066 from "./cx271-s3066";
import p_cx271_s4056 from "./cx271-s4056";
import p_cs280_s3065 from "./cs280-s3065";
import p_g4101 from "./g4101";
import p_cx171_s4056 from "./cx171-s4056";
import p_cx171_s3066 from "./cx171-s3066";
import p_cx170_s5062 from "./cx170-s5062";

export const PDP = {
  "active-led": p_active_led,
  "archer-ltg540z": p_archer_ltg540z,
  "hps-controller": p_hps_controller,
  "in-series-lfd": p_in_series_lfd,
  "mff-dp10": p_mff_dp10,
  "mt-am5-pro-ai": p_mt_am5_pro_ai,
  "mt-amd-am4": p_mt_amd_am4,
  "mt-h610-ddr4": p_mt_h610_ddr4,
  "mt-h610-ddr5": p_mt_h610_ddr5,
  "mt-pro-h610-ddr5": p_mt_pro_h610_ddr5,
  "mt-q670-ddr5": p_mt_q670_ddr5,
  "notebook-14": p_notebook_14,
  "pro-14": p_pro_14,
  "pro-ifp": p_pro_ifp,
  "pro-monitor": p_pro_monitor,
  "pro-ptz-camera": p_pro_ptz_camera,
  "pro-video-soundbar": p_pro_video_soundbar,
  "pro-web-camera": p_pro_web_camera,
  "promax-q870": p_promax_q870,
  "promax-t2-w680": p_promax_t2_w680,
  "promax-t2-w880": p_promax_t2_w880,
  "promax-t4-plus": p_promax_t4_plus,
  "sff-am5-pro-ai": p_sff_am5_pro_ai,
  "sff-b860-pro-ai": p_sff_b860_pro_ai,
  "sff-h610-ddr5": p_sff_h610_ddr5,
  "sff-h810-pro-ai": p_sff_h810_pro_ai,
  "sp50-speakerphone": p_sp50_speakerphone,
  "video-soundbar-4k": p_video_soundbar_4k,
  "g4201-he": p_g4201_he,
  "cx270-s5062": p_cx270_s5062,
  "cx271-s3066": p_cx271_s3066,
  "cx271-s4056": p_cx271_s4056,
  "cs280-s3065": p_cs280_s3065,
  "g4101": p_g4101,
  "cx171-s4056": p_cx171_s4056,
  "cx171-s3066": p_cx171_s3066,
  "cx170-s5062": p_cx170_s5062,
};

export const getPdp = (slug) => PDP[slug] ?? null;
