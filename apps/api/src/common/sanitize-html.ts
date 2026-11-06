/**
 * Rich text from School Settings is rendered on the public website, so it is
 * reduced to a small whitelist of formatting tags with every attribute removed.
 */
const ALLOWED_TAGS = new Set([
  'p',
  'br',
  'h2',
  'h3',
  'strong',
  'b',
  'em',
  'i',
  'u',
  'ul',
  'ol',
  'li',
]);

export function sanitizeHtml(input: unknown): string | null {
  if (typeof input !== 'string') return null;

  const html = input
    // Drop elements whose content must never be kept.
    .replace(
      /<(script|style|iframe|object|embed|template)[\s\S]*?<\/\1\s*>/gi,
      '',
    )
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\s*(\/?)\s*([a-z0-9]+)[^>]*>/gi, (_match, slash, tag) => {
      const name = String(tag).toLowerCase();
      return ALLOWED_TAGS.has(name) ? `<${slash}${name}>` : '';
    })
    // Any stray angle bracket left over is not a tag we allowed.
    .replace(/<(?!\/?(p|br|h2|h3|strong|b|em|i|u|ul|ol|li)>)/gi, '&lt;')
    .trim();

  const text = html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
  return text ? html : null;
}
