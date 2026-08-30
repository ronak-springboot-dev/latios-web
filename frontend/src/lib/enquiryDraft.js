import { useSyncExternalStore } from "react";

/**
 * A one-value store carrying a configuration from a product page down to the
 * enquiry form in the footer.
 *
 * The configurator and the form sit in unrelated parts of the tree and the app
 * has no state library, so the alternatives were prop-drilling through
 * ModelPage or adding a context provider around the whole router for a single
 * string. useSyncExternalStore is the smaller answer: no provider, no re-render
 * of anything that does not subscribe.
 *
 * Deliberately NOT persisted. A configuration is only meaningful next to the
 * page it was chosen on — restoring it into a later session's enquiry form
 * would attach a stale spec to an unrelated question.
 */
let draft = "";
const listeners = new Set();

const emit = () => listeners.forEach((l) => l());

export const setEnquiryDraft = (text) => {
  if (text === draft) return;
  draft = text || "";
  emit();
};

export const clearEnquiryDraft = () => setEnquiryDraft("");

const subscribe = (cb) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

const getSnapshot = () => draft;

export const useEnquiryDraft = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

/**
 * Render a chosen configuration as the body of an enquiry.
 *
 * Folded into the existing free-text `message` rather than added as a new API
 * field: EnquiryCreate.message already allows 5000 characters and the admin
 * inbox renders it, so this needs no backend or dashboard change to be useful
 * to whoever picks the lead up.
 */
export const formatConfiguration = (modelName, selections) => {
  const lines = Object.entries(selections)
    .filter(([, v]) => v)
    .map(([k, v]) => `  ${k}: ${v}`);
  if (!lines.length) return `Enquiry about the ${modelName}.\n\n`;
  return [
    `Enquiry about the ${modelName}, configured as:`,
    "",
    ...lines,
    "",
    "", // leaves the cursor on a blank line for the customer's own message
  ].join("\n");
};
