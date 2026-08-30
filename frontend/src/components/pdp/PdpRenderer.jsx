/**
 * Renders a product page from its `sections` list.
 *
 * A model's page is defined by which sections it uses and in what order, so the
 * renderer is deliberately dumb: look up the type, hand it the model, the theme
 * and its own data. Adding a section type to the vocabulary makes it available
 * to every page without touching this file's callers.
 *
 * An unknown type renders nothing rather than throwing — a typo in one model's
 * data should cost that one band, not the whole page.
 */
import { ProductVideo } from "@/components/ProductVideo";
import {
  PdpHero, PdpBanner, PdpStatWall, PdpMarquee, PdpFeatureGrid, PdpAudiences,
  PdpBleed, PdpStickySplit, PdpCompare, PdpIoMap, PdpExploded, PdpSpecTeaser,
  PdpThermal,
} from "./sections";
import { PdpReveal } from "./PdpReveal";
import { PdpWalkthrough } from "./PdpWalkthrough";
import { getTheme, themeVars } from "./theme";

const REGISTRY = {
  hero: PdpHero,
  banner: PdpBanner,
  statWall: PdpStatWall,
  marquee: PdpMarquee,
  featureGrid: PdpFeatureGrid,
  audiences: PdpAudiences,
  bleed: PdpBleed,
  stickySplit: PdpStickySplit,
  compare: PdpCompare,
  ioMap: PdpIoMap,
  exploded: PdpExploded,
  thermal: PdpThermal,
  reveal: PdpReveal,
  walkthrough: PdpWalkthrough,
  specTeaser: PdpSpecTeaser,
  video: ProductVideo,
};

export const PdpRenderer = ({ model, page, datasheet, tabs, onViewSpecs, onEnquire }) => {
  const theme = getTheme(model.slug);
  const sections = page?.sections ?? [];

  return (
    <div data-testid="model-showcase" style={themeVars(theme)}>
      {sections.map((s, i) => {
        const Section = REGISTRY[s.type];
        if (!Section) return null;
        const { type, ...props } = s;

        // The tab bar sits directly under the hero, as it does on the reference
        // page — anchored to the product, not floating above the marketing.
        const node = (
          <Section
            key={`${type}-${i}`}
            model={model}
            theme={theme}
            datasheet={datasheet}
            onViewSpecs={onViewSpecs}
            onEnquire={onEnquire}
            index={i}
            {...props}
          />
        );
        return type === "hero" ? (
          <div key={`hero-wrap-${i}`}>
            {node}
            {tabs}
          </div>
        ) : (
          node
        );
      })}
    </div>
  );
};
