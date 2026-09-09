import { ALL_MODELS, familyKey } from "@/data/models";

/**
 * The specification of every sibling configuration, aligned into one matrix.
 *
 * A Latios "product" is really a family — six MT builds, four SFF — that share
 * a chassis and differ in board, CPU and memory. So the useful table is not one
 * column of specs, it is the family side by side, which is what makes "show me
 * only the rows that differ" possible and is the one thing the page does better
 * than the reference it is modelled on.
 *
 * Group names and row keys are unioned across the whole family rather than
 * taken from the current model, so a row that exists on only one sibling still
 * gets a line, with a null in the columns that do not have it. Reading it off
 * the current model instead would silently hide exactly the rows a buyer is
 * comparing.
 *
 * Lifted out of ModelPage so the inline `specTable` section and the standalone
 * specification tab cannot disagree about what a sibling is.
 */
export const specMatrix = (model) => {
  const family = ALL_MODELS.filter((m) => familyKey(m) === familyKey(model));

  const groupNames = [...new Set(family.flatMap((m) => m.specGroups.map((g) => g.group)))];
  const groups = groupNames.map((gname) => {
    const keys = [];
    family.forEach((m) => {
      m.specGroups.find((g) => g.group === gname)?.items.forEach(([k]) => {
        if (!keys.includes(k)) keys.push(k);
      });
    });
    return {
      name: gname,
      rows: keys.map((k) => ({
        key: k,
        values: family.map((m) => {
          const item = m.specGroups.find((g) => g.group === gname)?.items.find(([ik]) => ik === k);
          return item ? item[1] : null;
        }),
      })),
    };
  });

  return { family, groups };
};

/** True when the siblings do not all agree on this row. */
export const rowDiffers = (row) => new Set(row.values.map((v) => v ?? "")).size > 1;
