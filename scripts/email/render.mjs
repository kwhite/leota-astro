import { parse } from 'ultrahtml';
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const decode=s=>s.replace(/&#(x[\da-f]+|\d+);/gi,(_,v)=>String.fromCodePoint(v[0].toLowerCase()==='x'?parseInt(v.slice(1),16):Number(v))).replace(/&(amp|lt|gt|quot|apos|nbsp);/g,(_,v)=>({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '})[v]);
const cls = (n,c) => (n.attributes?.class || '').split(/\s+/).includes(c);
function find(n, predicate) { if(predicate(n)) return n; for(const child of n.children || []) { const found=find(child,predicate); if(found) return found; } }
const text = n => n.type === 2 ? n.value : (n.children || []).map(text).join('');
// Palette and type follow the original Ghost email. ACCENT mirrors accentColor in src/config.ts.
const ACCENT='#572b9e', TEXT='#15212A', MUTED='#73818c', RULE='#e0e7eb';
const FONT='-apple-system,BlinkMacSystemFont,Roboto,Helvetica,Arial,sans-serif';
const head = (size, margin) => `color:${TEXT};font-size:${size}px;line-height:1.11em;font-weight:700;margin:${margin};`;
const styles = {
 p:'margin:0 0 1.5em;line-height:1.6em;', h1:`${head(36,'32px 0 16px')}text-align:center;line-height:1.1em;`, h2:head(32,'1.5em 0 .5em'), h3:head(26,'1.5em 0 .5em'), h4:`color:${TEXT};font-size:22px;line-height:1.2em;font-weight:600;margin:1.8em 0 .5em;`,
 strong:'font-weight:700;', b:'font-weight:700;', a:`color:${ACCENT};text-decoration:underline;overflow-wrap:anywhere;`,
 blockquote:`margin:0;padding:0;border-left:2px solid ${ACCENT};font-size:17px;font-weight:500;line-height:1.6em;letter-spacing:-0.2px;`,
 img:'display:block;max-width:100%;height:auto;margin:0 auto 1.5em;border:0;', figure:'margin:0 0 1.5em;', figcaption:`font-size:14px;line-height:1.4em;color:${MUTED};text-align:center;margin:8px 0 0;`,
 table:'border-collapse:collapse;width:100%;margin:0 0 1.5em;', td:`border:1px solid ${RULE};padding:8px;`, th:`border:1px solid ${RULE};padding:8px;text-align:left;`,
 pre:'white-space:pre-wrap;overflow-wrap:anywhere;background:#f4f5f7;padding:16px;font-size:13px;margin:0 0 1.5em;', hr:`display:block;width:100%;height:1px;margin:3em 0;padding:0;border:0;border-top:1px solid ${RULE};`,
 ul:'margin:0 0 1.5em;padding:0 1.5em 0 1.3em;line-height:1.6em;max-width:100%;list-style:disc;', ol:'margin:0 0 1.5em;padding:0 1.5em 0 1.3em;line-height:1.6em;max-width:100%;list-style:decimal;', li:'margin:.5em 0;padding-left:.3em;line-height:1.6em;'
};
const callouts = { blue:'#E9F6FB', yellow:'#FDF3E0' };
// Phone layout: the 600px email shrinks to the screen with 16px text. Inline styles need !important to be overridden.
const mobile=`@media only screen and (max-width:620px){.em-main{padding:16px 16px!important;font-size:16px!important}.em-main blockquote{font-size:16px!important}.em-main blockquote p{margin:1.5em 16px!important}.em-main h1{font-size:28px!important;line-height:1.2em!important}.em-main h2{font-size:26px!important;line-height:1.22em!important}.em-main h3{font-size:21px!important;line-height:1.25em!important}.em-main h4{font-size:19px!important}.em-main hr{margin:2em 0!important}.em-main .em-callout{padding:16px!important}.em-main .em-panel{padding:16px 16px 0!important}.em-main blockquote.em-alt{font-size:18px!important;line-height:1.4em!important;padding:1.5em 16px!important}.em-main blockquote.em-alt p{margin:1.5em 16px!important}.em-main pre{word-break:break-word!important}}`;
const allowed = new Set('p h1 h2 h3 h4 h5 h6 strong b em i u s del a img table thead tbody tr td th pre code hr br ul ol li blockquote figure figcaption div span aside section details summary sup sub'.split(' '));
export function renderEmail(page, postUrl) {
 const doc=parse(page), body=find(doc,n=>cls(n,'leota-content')), heading=find(doc,n=>cls(n,'article-title'));
 if(!body || !heading) throw new Error('Not a rendered post: article content/title missing.');
 const title=decode(text(heading)), hero=find(doc,n=>cls(n,'article-hero-image')), excerpt=find(doc,n=>cls(n,'article-excerpt'));
 const published=find(doc,n=>n.name==='meta' && n.attributes.property==='article:published_time')?.attributes.content, when=published && !isNaN(new Date(published)) ? new Date(published).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}) : '';
 function url(s) { try { const u=new URL(decode(s),postUrl); return ['https:','http:','mailto:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } }
 // ctx carries the nearest enclosing treatment so paragraphs and images inside quotes, callouts and figures lay out correctly.
 function html(n, ctx={}) {
  if(n.type===2) return n.value;
  if(n.type!==1) return (n.children || []).map(c=>html(c,ctx)).join('');
  if(['script','style','svg','button','input','dialog'].includes(n.name)) return '';
  if(n.name==='iframe') { const href=url(n.attributes.src); if(!href) return ''; const name=decode(n.attributes.title||'').replace(/^Spotify Embed:\s*/,'').trim(), service=/spotify/.test(href)?' on Spotify':''; return `<p style="${styles.p}"><a style="${styles.a}" href="${esc(href.replace('/embed/','/'))}">${name?`♪ Listen to ${esc(name)}${service}`:'Open embedded media'}</a></p>`; }
  // Email disclosures stay expanded: the heading, then the full content inside the original light card boundary.
  if(n.name==='details') {
   const kids=n.children||[], summary=kids.filter(c=>c.name==='summary').map(c=>html(c,ctx)).join(''), rest=kids.filter(c=>c.name!=='summary').map(c=>html(c,ctx)).join('');
   return `<div class="em-panel" style="background:transparent;border:1px solid #dee2e6;border-radius:4px;padding:20px 20px 0;margin:0 0 1.5em;">${summary}<div style="font-size:16px;line-height:1.5;">${rest}</div></div>`;
  }
  const alt=cls(n,'kg-blockquote-alt'), callout=cls(n,'kg-callout-card');
  const inner = n.name==='blockquote' ? {...ctx,quote:alt?'alt':'plain'} : callout ? {...ctx,callout:true} : n.name==='figure' || cls(n,'kg-card') ? {...ctx,figure:true} : ctx;
  const children=(n.children||[]).map(c=>html(c,inner)).join('');
  if(!allowed.has(n.name)) return children;
  let tag=n.name==='summary'?'h4':['aside','section'].includes(n.name)?'div':n.name;
  let style=styles[tag] || '';
  if(n.name==='summary') style+='margin:0 0 8px;';
  if(tag==='p' && ctx.quote) style=`line-height:1.6em;margin:2em ${ctx.quote==='alt'?50:25}px;font-size:1em;padding:0;`;
  if(tag==='p' && ctx.callout) style='margin:0;line-height:1.5em;';
  if(tag==='img' && ctx.figure) style=style.replace('margin:0 auto 1.5em','margin:0 auto');
  if(callout) { const color=Object.keys(callouts).find(k=>cls(n,`kg-callout-card-${k}`)); style=`display:flex;margin:0 0 1.5em;padding:24px;border-radius:8px;background:${callouts[color]||'#f4f5f7'};`; }
  if(cls(n,'kg-callout-emoji')) style='padding-right:12px;font-size:20px;';
  if(cls(n,'kg-callout-text')) style='min-width:0;';
  // Alternate quotes are grey, centred and italic with no rule; verse is often bare text, so pad the quote itself.
  if(alt) style=`margin:0;padding:${(n.children||[]).some(c=>c.name==='p')?'0':'2em 50px'};border-left:0;text-align:center;font-size:1.2em;font-style:italic;font-weight:500;line-height:1.6em;letter-spacing:-0.2px;color:${MUTED};`;
  let attrs=callout?' class="em-callout"':alt?' class="em-alt"':'';
  for(const key of ['href','src','alt','colspan','rowspan','start']) {
   if(n.attributes[key]===undefined) continue;
   const value=['href','src'].includes(key)?url(n.attributes[key]):n.attributes[key];
   if(value) attrs+=` ${key}="${esc(decode(value))}"`;
  }
  if(tag==='img') attrs+=' width="600"';
  return `<${tag}${attrs}${style?` style="${style}"`:''}>${children}${['img','br','hr'].includes(tag)?'':`</${tag}>`}`;
 }
 const small=`font-size:13px;line-height:1.5em;color:${MUTED};text-align:center;`, muted=`color:${MUTED};text-decoration:underline;`;
 const content=`${excerpt?`<span style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${esc(decode(text(excerpt)).trim())}</span>`:''}<p style="${small}margin:0 0 24px;">Game Notes &amp; Summaries${when?` · ${esc(when)}`:''} · <a style="${muted}" href="${esc(postUrl)}">Read on the site</a></p>${hero?html(hero):''}<h1 style="${styles.h1}">${esc(title)}</h1>${html(body)}<hr style="${styles.hr}"><p style="${small}margin:0 0 10px;">Sent to our gaming table. <a style="${muted}" href="${esc(postUrl)}">View this recap online</a></p>`;
 const output=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>${mobile}</style></head><body style="margin:0;padding:0;background:#fff;color:${TEXT};font-family:${FONT};-webkit-font-smoothing:antialiased;font-size:18px;line-height:1.4;"><table role="presentation" width="100%" style="background:#fff;"><tr><td align="center" style="font-family:${FONT};"><table role="presentation" width="600" style="width:100%;max-width:600px;"><tr><td class="em-main" style="padding:24px 20px;font-family:${FONT};font-size:18px;color:${TEXT};">${content}</td></tr></table></td></tr></table></body></html>`;
 function plain(n) {
  if(n.type===2) return n.value;
  if(['script','style'].includes(n.name)) return '';
  let s=(n.children||[]).map(plain).join('');
  if(n.name==='a' && n.attributes.href) s+=` (${n.attributes.href})`;
  if(n.name==='img') return n.attributes.alt?`[${n.attributes.alt}]\n`:'';
  if(n.name==='span' && /display:none/.test(n.attributes.style||'')) s+='\n\n';
  if(['p','div','h1','h2','h3','h4','h5','h6','li','blockquote','hr','br','tr'].includes(n.name)) s+='\n\n';
  return s;
 }
 // The parser retains entity references; decode the common HTML/numeric entities for plain text and subject.

 return { subject:decode(title), html:output, text:decode(plain(parse(content))).replace(/\n[ \t]+/g,'\n').replace(/\n{3,}/g,'\n\n').trim() };
}
