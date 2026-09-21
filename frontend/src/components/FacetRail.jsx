/**
 * The filter rail, the mobile filter sheet, and the sort orders.
 *
 * These were written inside ProductPage and are lifted here unchanged so the
 * /machines finder can use the same controls. A second copy would drift, and
 * the behaviour they encode -- zero-count groups hidden, a `soon` bucket kept
 * visible, a 260px column collapsing to a sheet on phones -- was decided once
 * and is worth keeping decided.
 */
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, SlidersHorizontal, X } from "lucide-react";
import { getMaxMemoryGB } from "@/data/models";

const EASE = [0.16, 1, 0.3, 1];
/**

 * Sort orders offered in the rail.

 *

 * "Featured" is the authored order and keeps the editorial family sections;

 * every other order flattens them into one grid, because a sort that only

 * applies inside each section is not a sort of the results. Models with no

 * memory figure (a monitor, a speakerphone) sort last rather than as zero.

 */

export const SORTS = [

  { id: "featured", label: "Featured" },

  { id: "name", label: "Name A-Z", cmp: (a, b) => a.name.localeCompare(b.name) },

  { id: "memory", label: "Memory: high to low",

    cmp: (a, b) => (getMaxMemoryGB(b) ?? -1) - (getMaxMemoryGB(a) ?? -1) },

  { id: "ai", label: "AI ready first",

    cmp: (a, b) => Number(!!b.aiReady) - Number(!!a.aiReady) },

];



/**

 * Filter and sort rail.

 *

 * Lives in a sticky left column rather than a band above the grid, because the

 * band could only be reached by scrolling back to the top of the listing --

 * with fifteen towers on screen that is a long way back. The rail follows the

 * page, so the filters are reachable wherever the reader has got to.

 *

 * Four dimensions, combining as AND across groups and OR within one -- pick

 * "Micro tower" and "Small form factor" and you get both; add "AMD Ryzen" and

 * you get the AMD machines among those. Counts are computed against the other

 * active facets, so a number is always what you would actually get by clicking.

 *

 * Options with a zero count are hidden rather than shown disabled: a category

 * with no CPU in it (displays, AV) simply renders no processor group, instead of

 * a filter offering a single meaningless choice.

 *

 * On phones the rail collapses behind a "Filter & sort" button -- a 260px

 * column beside a single-column grid would leave no room for either.

 */

/** Groups worth showing: a facet whose every option matches nothing is noise. */

export const liveGroups = (groups) => groups.filter((g) => g.options.some((o) => o.n > 0));



/** The filter and sort controls themselves, shared by the rail and the sheet. */

export const FacetControls = ({ groups, active, onToggle, onClear, total, shown, sort, onSort, idPrefix }) => {

  const activeCount = Object.values(active).reduce((n, set) => n + set.size, 0);

  return (

    <>

      <div className="flex items-baseline justify-between gap-4 mb-6">

        <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">

          Showing <span className="text-white">{shown}</span> of {total}

        </p>

        {activeCount > 0 && (

          <button

            onClick={onClear}

            data-testid="facet-clear"

            className="text-[10px] uppercase tracking-[0.25em] text-[#6f93f2] hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/50 rounded"

          >

            Clear all

          </button>

        )}

      </div>



      <div className="mb-7 pb-7 border-b border-white/10">

        <label

          htmlFor={`${idPrefix}-sort`}

          className="block text-[10px] uppercase tracking-[0.22em] text-zinc-600 mb-2.5"

        >

          Sort by

        </label>

        <select

          id={`${idPrefix}-sort`}

          value={sort}

          onChange={(e) => onSort(e.target.value)}

          data-testid={`${idPrefix}-sort-select`}

          className="w-full bg-[#0A0A0A] border border-white/15 text-sm text-white px-3 py-2.5 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/50 transition-colors duration-300"

        >

          {SORTS.map((o) => (

            <option key={o.id} value={o.id} className="bg-[#0A0A0A]">

              {o.label}

            </option>

          ))}

        </select>

      </div>



      <div className="flex flex-col gap-7">

        {liveGroups(groups).map((g) => (

          <div key={g.id} data-testid={`facet-group-${g.id}`}>

            <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-600 mb-3">{g.label}</p>

            <div className="flex flex-col gap-1">

              {g.options

                // A `soon` option is always n === 0 -- the range holds no

                // models yet -- so it has to survive the zero-count filter that

                // hides genuinely empty combinations.

                .filter((o) => o.n > 0 || o.soon || active[g.id]?.has(o.id))

                .map((o) => {

                  const on = active[g.id]?.has(o.id);

                  return (

                    <button

                      key={o.id}

                      onClick={() => onToggle(g.id, o.id)}

                      data-testid={`facet-${g.id}-${o.id}`}

                      aria-pressed={!!on}

                      className={`group flex items-center gap-3 py-1.5 text-left text-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/50 rounded ${

                        on ? "text-white" : "text-zinc-400 hover:text-white"

                      }`}

                    >

                      <span

                        aria-hidden="true"

                        className={`w-4 h-4 shrink-0 rounded-[3px] border flex items-center justify-center transition-colors duration-300 ${

                          on

                            ? "bg-[#1a56e8] border-[#1a56e8]"

                            : "border-white/25 group-hover:border-white/50"

                        }`}

                      >

                        {on && <Check className="w-3 h-3 text-white" strokeWidth={3} />}

                      </span>

                      <span className="flex-1">{o.label}</span>

                      {o.soon ? (

                        <span className="text-[9px] uppercase tracking-[0.18em] text-zinc-600 border border-zinc-800 rounded px-1.5 py-0.5">

                          Soon

                        </span>

                      ) : (

                        <span className="text-xs text-zinc-600 tabular-nums">{o.n}</span>

                      )}

                    </button>

                  );

                })}

            </div>

          </div>

        ))}

      </div>

    </>

  );

};



/**

 * Desktop: a rail that follows the page.

 *

 * It sits in a sticky left column rather than a band above the grid, because

 * the band could only be reached by scrolling back to the top of the listing --

 * with fifteen towers on screen that is a long way back.

 *

 * Four dimensions, combining as AND across groups and OR within one: pick

 * "Micro tower" and "Small form factor" and you get both; add "AMD Ryzen" and

 * you get the AMD machines among those. Counts are computed against the other

 * active facets, so a number is always what clicking it would actually yield,

 * and a zero-count option is hidden rather than shown disabled -- a category

 * with no CPU in it (displays, AV) renders no processor group at all.

 */

export const FilterRail = (props) => {

  if (!liveGroups(props.groups).length) return null;

  return (

    <aside

      className="hidden lg:block lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto lg:pr-2"

      data-testid="facet-panel"

      aria-label="Filter and sort products"

    >

      <FacetControls {...props} idPrefix="rail" />

    </aside>

  );

};



/**

 * Phone: a pinned trigger and a sheet.

 *

 * A 240px rail beside a single-column grid would leave room for neither, and a

 * panel at the top of the listing is the thing that made filtering mean

 * scrolling back up in the first place.

 *

 * The trigger is `sticky bottom-6`, not `fixed`. Two reasons: framer-motion

 * leaves a transform on the page's <main> even after the entry animation

 * settles, and a transformed ancestor makes `position: fixed` resolve against

 * that ancestor rather than the viewport -- the button lands thousands of

 * pixels down the document. Sticky is unaffected by that, and it also gives the

 * behaviour for free: pinned above the fold for as long as the listing is on

 * screen, gone once it has been scrolled past, with no observer or scroll

 * listener. Which matters here, because Lenis drives scrolling and window

 * scroll events are not a reliable signal.

 *

 * The sheet itself does need a portal, for the same transform reason: a

 * full-screen overlay has to be measured against the viewport.

 */

export const MobileFilterBar = (props) => {

  const [open, setOpen] = useState(false);

  const { active, shown } = props;



  useEffect(() => {

    if (!open) return undefined;

    const prev = document.body.style.overflow;

    document.body.style.overflow = "hidden";        // the sheet is the only scroller

    return () => { document.body.style.overflow = prev; };

  }, [open]);



  useEffect(() => {

    if (!open) return undefined;

    const onKey = (e) => e.key === "Escape" && setOpen(false);

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);

  }, [open]);



  const activeCount = Object.values(active).reduce((n, set) => n + set.size, 0);

  if (!liveGroups(props.groups).length) return null;



  return (

    <>

      <div className="lg:hidden sticky bottom-6 z-40 mt-12 flex justify-center pointer-events-none">

        <button

          onClick={() => setOpen(true)}

          data-testid="facet-toggle"

          aria-expanded={open}

          className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-white/20 bg-[#111] px-6 py-3.5 text-[10px] uppercase tracking-[0.25em] text-white shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/50"

        >

          <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />

          Filter &amp; sort

          {activeCount > 0 && (

            <span className="btn-blue rounded-full px-2 py-0.5 text-[9px]">{activeCount}</span>

          )}

        </button>

      </div>



      {open &&

        createPortal(

          <div

            className="lg:hidden fixed inset-0 z-[60]"

            data-testid="facet-sheet"

            role="dialog"

            aria-modal="true"

            aria-label="Filter and sort products"

          >

            <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />

            <div className="absolute inset-x-0 bottom-0 max-h-[85vh] flex flex-col border-t border-white/15 bg-[#050505]">

              <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-white/10">

                <span className="text-[10px] uppercase tracking-[0.25em] text-white">Filter &amp; sort</span>

                <button

                  onClick={() => setOpen(false)}

                  data-testid="facet-sheet-close"

                  aria-label="Close filters"

                  className="text-zinc-400 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/50 rounded"

                >

                  <X className="w-5 h-5" />

                </button>

              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">

                <FacetControls {...props} idPrefix="sheet" />

              </div>

              <div className="px-6 py-4 border-t border-white/10">

                <button

                  onClick={() => setOpen(false)}

                  data-testid="facet-sheet-apply"

                  className="w-full btn-blue py-3.5 text-[10px] uppercase tracking-[0.25em] focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/50"

                >

                  Show {shown} {shown === 1 ? "result" : "results"}

                </button>

              </div>

            </div>

          </div>,

          document.body

        )}

    </>

  );

};



