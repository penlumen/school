export interface EmailContent {
  subject: string;
  greeting?: string;
  paragraphs: string[];
  action?: { label: string; url: string };
  /** Small print under the button, e.g. when a link expires. */
  footnote?: string;
}

const DEFAULT_PRIMARY = '#003884';

const escape = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** White or near-black text, whichever reads better on the button colour. */
function buttonText(hex: string) {
  const [r, g, b] = [1, 3, 5].map(
    (i) => parseInt(hex.slice(i, i + 2), 16) / 255,
  );
  const lum = (c: number) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  const l = 0.2126 * lum(r) + 0.7152 * lum(g) + 0.0722 * lum(b);
  // Contrast against white vs. against #212121 (luminance ~0.015).
  return 1.05 / (l + 0.05) >= (l + 0.05) / 0.065 ? '#ffffff' : '#212121';
}

/**
 * A plain, table-based layout that renders in every mail client, in the
 * school's brand colour, plus a text version for clients without HTML.
 */
export function renderEmail(
  content: EmailContent,
  school: { schoolName: string; logo?: string | null; primary?: string | null },
) {
  const primary = /^#[0-9a-f]{6}$/i.test(school.primary ?? '')
    ? school.primary!
    : DEFAULT_PRIMARY;
  const name = escape(school.schoolName);
  const paragraphs = content.paragraphs
    .map((p) => `<p style="margin:0 0 16px;line-height:1.6">${escape(p)}</p>`)
    .join('');
  const button = content.action
    ? `<p style="margin:24px 0"><a href="${escape(content.action.url)}" style="display:inline-block;background:${primary};color:${buttonText(primary)};text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600">${escape(content.action.label)}</a></p>`
    : '';
  const header = school.logo
    ? `<img src="${escape(school.logo)}" alt="${name}" height="40" style="height:40px;vertical-align:middle;border-radius:6px"> <span style="vertical-align:middle;font-weight:600;font-size:16px;color:#212121">${name}</span>`
    : `<span style="font-weight:600;font-size:16px;color:#212121">${name}</span>`;

  const html = `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(content.subject)}</title></head>
<body style="margin:0;background:#f0f1f3;font-family:Arial,Helvetica,sans-serif;color:#212121">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f1f3;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden">
<tr><td style="height:4px;background:${primary}"></td></tr>
<tr><td style="padding:24px 28px 8px">${header}</td></tr>
<tr><td style="padding:16px 28px 8px;font-size:15px">
<h1 style="margin:0 0 16px;font-size:20px;line-height:1.3">${escape(content.subject)}</h1>
${content.greeting ? `<p style="margin:0 0 16px">${escape(content.greeting)}</p>` : ''}
${paragraphs}${button}
${content.footnote ? `<p style="margin:0 0 16px;font-size:13px;color:#6c6c6c">${escape(content.footnote)}</p>` : ''}
</td></tr>
<tr><td style="padding:16px 28px 24px;border-top:1px solid #e7e7e7;font-size:12px;color:#6c6c6c">Sent by ${name}. Please don't share links from this email.</td></tr>
</table></td></tr></table></body></html>`;

  const text = [
    content.subject,
    '',
    content.greeting,
    ...content.paragraphs,
    content.action ? `${content.action.label}: ${content.action.url}` : '',
    content.footnote,
    '',
    `Sent by ${school.schoolName}`,
  ]
    .filter((line) => line !== undefined)
    .join('\n');

  return { html, text };
}
