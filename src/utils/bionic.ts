/**
 * Bionic reading utility. Bolds the first ~45% of each word so the eye
 * anchors on the bold portion and the brain completes the rest.
 *
 * Never call on user-generated content without sanitising first.
 */
export function bionic(text: string): string {
  return text.replace(/\b([a-zA-Z]{2,})\b/g, (word) => {
    const boldCount = Math.ceil(word.length * 0.45);
    return `<b>${word.slice(0, boldCount)}</b>${word.slice(boldCount)}`;
  });
}

export function bionicHTML(text: string): { dangerouslySetInnerHTML: { __html: string } } {
  return { dangerouslySetInnerHTML: { __html: bionic(text) } };
}

/** Bionic-safe version for strings that already contain inline HTML tags. */
export function bionicHTML_safe(html: string): { dangerouslySetInnerHTML: { __html: string } } {
  const parts = html.split(/(<[^>]+>)/);
  const processed = parts
    .map((part) => (part.startsWith('<') ? part : bionic(part)))
    .join('');
  return { dangerouslySetInnerHTML: { __html: processed } };
}
