/**
 * Long-form product pages, one module per model.
 *
 * Split out of the old single-file `showcase.js`: each page's section list is
 * the thing being designed, so it deserves its own file to read top to bottom.
 *
 * A model absent from here falls back to the standard overview layout in
 * ModelPage, so this can be filled a model at a time.
 */
import mff_dp10 from "./mff-dp10";
import mtam5_pro_ai from "./mt-am5-pro-ai";
import mtamd_am4 from "./mt-amd-am4";
import mth610_ddr4 from "./mt-h610-ddr4";
import mth610_ddr5 from "./mt-h610-ddr5";
import mtpro_h610_ddr5 from "./mt-pro-h610-ddr5";
import mtq670_ddr5 from "./mt-q670-ddr5";
import promax_q870 from "./promax-q870";
import promax_t2_w680 from "./promax-t2-w680";
import promax_t2_w880 from "./promax-t2-w880";
import promax_t4_plus from "./promax-t4-plus";
import sffam5_pro_ai from "./sff-am5-pro-ai";
import sffb860_pro_ai from "./sff-b860-pro-ai";
import sffh610_ddr5 from "./sff-h610-ddr5";
import sffh810_pro_ai from "./sff-h810-pro-ai";

export const PDP = {
  "mff-dp10": mff_dp10,
  "mt-am5-pro-ai": mtam5_pro_ai,
  "mt-amd-am4": mtamd_am4,
  "mt-h610-ddr4": mth610_ddr4,
  "mt-h610-ddr5": mth610_ddr5,
  "mt-pro-h610-ddr5": mtpro_h610_ddr5,
  "mt-q670-ddr5": mtq670_ddr5,
  "promax-q870": promax_q870,
  "promax-t2-w680": promax_t2_w680,
  "promax-t2-w880": promax_t2_w880,
  "promax-t4-plus": promax_t4_plus,
  "sff-am5-pro-ai": sffam5_pro_ai,
  "sff-b860-pro-ai": sffb860_pro_ai,
  "sff-h610-ddr5": sffh610_ddr5,
  "sff-h810-pro-ai": sffh810_pro_ai,
};

export const getPdp = (slug) => PDP[slug] ?? null;
