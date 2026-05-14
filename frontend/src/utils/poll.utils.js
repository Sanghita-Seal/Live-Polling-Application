import { createId } from "./id.utils";

const FINGERPRINT_KEY = "live_poll_fingerprint";

export function getPollId(poll) {
  return poll?._id || poll?.id || "";
}

export function getOptionId(option) {
  return option?._id || option?.id || "";
}

export function getPublicPollUrl(shareCode) {
  return `${window.location.origin}/p/${shareCode}`;
}

export function getAnalyticsUrl(analyticsCode) {
  return `${window.location.origin}/analytics/${analyticsCode}`;
}

export function getVoterFingerprint() {
  const existing = localStorage.getItem(FINGERPRINT_KEY);

  if (existing) {
    return existing;
  }

  const fingerprint = createId();
  localStorage.setItem(FINGERPRINT_KEY, fingerprint);
  return fingerprint;
}

export function formatDateTime(value) {
  if (!value) return "Not set";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function getStatusLabel(status) {
  const labels = {
    draft: "Draft",
    active: "Live",
    ended: "Ended",
  };

  return labels[status] || "Unknown";
}
