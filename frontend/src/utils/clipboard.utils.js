export async function copyText(value) {
  if (!value) {
    return false;
  }

  if (globalThis.navigator?.clipboard?.writeText && globalThis.isSecureContext) {
    try {
      await globalThis.navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Fall back to the textarea method below.
    }
  }

  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.top = "-9999px";
  textArea.style.left = "-9999px";

  document.body.appendChild(textArea);
  textArea.select();
  textArea.setSelectionRange(0, textArea.value.length);

  try {
    return document.execCommand("copy");
  } finally {
    document.body.removeChild(textArea);
  }
}
