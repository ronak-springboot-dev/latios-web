/**
 * Long-form product pages, one module per model.
 *
 * Split out of the old single-file `showcase.js`: fifteen rich entries in one
 * file would be unreadable, and each page's section list is the thing being
 * designed, so it deserves its own file to read top to bottom.
 *
 * A model absent from here falls back to the standard overview layout in
 * ModelPage — so this can be filled in a model at a time without leaving the
 * rest of the catalogue broken.
 */
import mtAmdAm4 from "./mt-amd-am4";
import promaxT4Plus from "./promax-t4-plus";

export const PDP = {
  "mt-amd-am4": mtAmdAm4,
  "promax-t4-plus": promaxT4Plus,
};

export const getPdp = (slug) => PDP[slug] ?? null;
