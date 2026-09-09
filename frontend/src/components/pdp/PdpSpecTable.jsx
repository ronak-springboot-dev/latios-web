/**
 * The full specification, inline at the foot of the page.
 *
 * The reference ends its product pages with the table rather than hiding it
 * behind a tab, and it is right to: someone who has scrolled eleven screens of
 * marketing is exactly the person who wants the numbers, and asking them to
 * find a tab and lose their place is the wrong end of that trade.
 *
 * It keeps the family matrix rather than shrinking to the reference's two
 * columns. Minisforum sells one SKU per page; a Latios product is a family of
 * up to six builds around one chassis, so the comparison — and the "show the
 * differences" filter over it — is the more useful table, and it is the thing
 * this page does better than the page it is modelled on.
 *
 * The matrix itself lives in lib/specMatrix.js so this and the standalone
 * specification tab cannot disagree about what counts as a sibling.
 */
import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { FileDown } from "lucide-react";
import { DATASHEETS } from "@/data/models";
import { specMatrix, rowDiffers } from "@/lib/specMatrix";
import { ACCENT, ACCENT_SOFT, Band, Reveal, SectionHead } from "./primitives";

export const PdpSpecTable = ({ model, theme, datasheet, heading, body }) => {
  const [diffsOnly, setDiffsOnly] = useState(false);
  const { family, groups } = specMatrix(model);

  return (
    <Band theme={theme} id="specification" data-testid="pdp-spec-table">
      <SectionHead
        theme={theme}
        kicker="Specification"
        heading={heading ?? "Every number that matters."}
        body={body}
        align="left"
      />

      <div className="mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        {family.length > 1 ? (
          <label
            className="flex w-fit items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-zinc-400 cursor-pointer select-none"
            data-testid="pdp-spec-diff-label"
          >
            <input
              type="checkbox"
              checked={diffsOnly}
              onChange={(e) => setDiffsOnly(e.target.checked)}
              data-testid="pdp-spec-diff-toggle"
              className="w-4 h-4"
              style={{ accentColor: ACCENT }}
            />
            Show the differences
          </label>
        ) : (
          <span />
        )}
        {datasheet && (
          <a
            href={datasheet}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="pdp-spec-datasheet"
            className="group shrink-0 inline-flex items-center gap-3 px-7 py-3.5 text-xs uppercase tracking-[0.25em] font-semibold text-white transition-opacity duration-300 hover:opacity-85"
            style={{ background: ACCENT }}
          >
            <FileDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            Download datasheet
          </a>
        )}
      </div>

      <Reveal delay={0.06}>
        <div className="mt-8 overflow-x-auto border border-white/10" data-testid="pdp-spec-sheet">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-5 md:px-7 py-4 w-52 align-bottom text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-normal">
                  {family.length > 1 ? `${family.length} configurations` : "Specification"}
                </th>
                {family.map((m) => {
                  const pdf = DATASHEETS[m.slug];
                  const active = m.slug === model.slug;
                  return (
                    <th
                      key={m.slug}
                      data-testid={`pdp-spec-col-${m.slug}`}
                      className="px-5 md:px-7 py-4 align-bottom border-t-2"
                      style={{ borderTopColor: active ? ACCENT : "transparent" }}
                    >
                      <div className={`text-sm font-semibold leading-snug ${active ? "text-white" : "text-zinc-400"}`}>
                        {m.name.split(" — ")[1] || m.name}
                      </div>
                      <div className="mt-2.5 flex items-center gap-4">
                        {pdf && (
                          <a
                            href={pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Download datasheet (PDF)"
                            data-testid={`pdp-spec-pdf-${m.slug}`}
                            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] hover:text-white transition-colors duration-300"
                            style={{ color: ACCENT_SOFT }}
                          >
                            <FileDown className="w-4 h-4" /> PDF
                          </a>
                        )}
                        {!active && (
                          <Link
                            to={`/${m.category}/${m.slug}`}
                            data-testid={`pdp-spec-open-${m.slug}`}
                            className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors duration-300"
                          >
                            View
                          </Link>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {groups.map((g, gi) => {
                const visible = g.rows.filter((r) => !diffsOnly || rowDiffers(r));
                if (!visible.length) return null;
                return (
                  <Fragment key={g.name}>
                    <tr data-testid={`pdp-spec-group-${gi}`}>
                      <td
                        colSpan={family.length + 1}
                        className="px-5 md:px-7 py-3.5 text-[10px] uppercase tracking-[0.3em] text-zinc-400 bg-white/5 border-b border-white/10"
                      >
                        {g.name}
                      </td>
                    </tr>
                    {visible.map((r, ri) => {
                      const differs = rowDiffers(r);
                      return (
                        <tr
                          key={r.key}
                          data-testid={`pdp-spec-row-${gi}-${ri}`}
                          // Alternating shading is the reference's table
                          // treatment, and it is what makes a wide multi-column
                          // row readable across.
                          className="border-b border-white/10 last:border-b-0 even:bg-white/[0.02] hover:bg-white/[0.05] transition-colors duration-200"
                        >
                          <td className="px-5 md:px-7 py-4 text-sm text-zinc-500 align-top">{r.key}</td>
                          {r.values.map((v, vi) => (
                            <td
                              key={family[vi].slug}
                              className={`px-5 md:px-7 py-4 text-sm leading-relaxed align-top ${
                                differs ? "text-white" : "text-zinc-400"
                              }`}
                            >
                              {v ?? "—"}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </Reveal>

      <p className="mt-8 text-[10px] text-zinc-600 leading-relaxed max-w-2xl">
        Product specification, functions and appearance may vary by configuration. All
        specifications are subject to change without notice — check with our sales team for
        the exact offer and detailed specifications for your region.
      </p>
    </Band>
  );
};
