/**
 * Splits embedded <style> blocks out of HTML and returns cleaned markup + CSS.
 */
export function splitHtmlAndCss(html: string): { html: string; css: string } {
  if (!html || typeof html !== "string") {
    return { html: "", css: "" };
  }

  const cssBlocks: string[] = [];
  const cleanedHtml = html.replace(
    /<style[^>]*>([\s\S]*?)<\/style>/gi,
    (_match, cssContent: string) => {
      const trimmed = cssContent?.trim();
      if (trimmed) {
        cssBlocks.push(trimmed);
      }
      return "";
    },
  );

  return {
    html: cleanedHtml.trim(),
    css: cssBlocks.join("\n\n"),
  };
}

/** Merges manual CSS with any <style> tags still present in the HTML body. */
export function preparePageHtmlForSave(
  description: string,
  manualCss?: string,
): { description: string; customCss: string } {
  const { html, css: extractedCss } = splitHtmlAndCss(description || "");
  const customCss = [manualCss?.trim(), extractedCss]
    .filter(Boolean)
    .join("\n\n");

  return {
    description: html || " ",
    customCss,
  };
}
