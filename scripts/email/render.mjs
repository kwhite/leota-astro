import { parse } from 'ultrahtml';
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const decode=s=>s.replace(/&#(x[\da-f]+|\d+);/gi,(_,v)=>String.fromCodePoint(v[0].toLowerCase()==='x'?parseInt(v.slice(1),16):Number(v))).replace(/&(amp|lt|gt|quot|apos|nbsp);/g,(_,v)=>({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '})[v]);
const cls = (n,c) => (n.attributes?.class || '').split(/\s+/).includes(c);
function find(n, predicate) { if(predicate(n)) return n; for(const child of n.children || []) { const found=find(child,predicate); if(found) return found; } }
const text = n => n.type === 2 ? n.value : (n.children || []).map(text).join('');
const styles = {
 p:'margin:0 0 20px;', h1:'font-size:32px;line-height:1.2;margin:24px 0;', h2:'font-size:26px;line-height:1.3;margin:32px 0 16px;', h3:'font-size:21px;margin:28px 0 14px;',
 blockquote:'border-left:4px solid #8959ce;padding:4px 20px;margin:24px 0;color:#ded7e9;', a:'color:#c6a5f5;text-decoration:underline;',
 img:'display:block;max-width:100%;height:auto;margin:16px auto;', table:'border-collapse:collapse;width:100%;', td:'border:1px solid #555;padding:8px;', th:'border:1px solid #555;padding:8px;text-align:left;',
 pre:'white-space:pre-wrap;overflow-wrap:anywhere;background:#23262a;padding:16px;font-size:13px;', hr:'border:0;border-top:1px solid #555;margin:32px 0;', figcaption:'font-size:14px;color:#bbb;margin:8px 0 24px;', li:'margin-bottom:8px;'
};
const allowed = new Set('p h1 h2 h3 h4 h5 h6 strong b em i u s del a img table thead tbody tr td th pre code hr br ul ol li blockquote figure figcaption div span aside section details summary sup sub'.split(' '));
export function renderEmail(page, postUrl) {
 const doc=parse(page), body=find(doc,n=>cls(n,'leota-content')), heading=find(doc,n=>cls(n,'article-title'));
 if(!body || !heading) throw new Error('Not a rendered post: article content/title missing.');
 const title=decode(text(heading)), hero=find(doc,n=>cls(n,'article-hero-image')), excerpt=find(doc,n=>cls(n,'article-excerpt'));
 function url(s) { try { const u=new URL(decode(s),postUrl); return ['https:','http:','mailto:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } }
 function html(n) {
  if(n.type===2) return n.value;
  if(n.type!==1) return (n.children || []).map(html).join('');
  if(['script','style','svg','button','input','dialog'].includes(n.name)) return '';
  if(n.name==='iframe') { const href=url(n.attributes.src); return href ? `<p><a style="${styles.a}" href="${esc(href.replace('/embed/','/'))}">Open embedded media</a></p>` : ''; }
  const children=(n.children||[]).map(html).join('');
  if(!allowed.has(n.name)) return children;
  let tag=n.name==='summary'?'h4':['aside','section','details'].includes(n.name)?'div':n.name;
  let style=styles[tag] || '';
  // Email disclosures stay expanded, but retain the original card boundary and heading.
  if(n.name==='details') style+='border:1px solid #424242;border-radius:4px;padding:20px;margin:0 0 24px;';
  if(n.name==='summary') style+='font-size:22px;line-height:1.3;font-weight:600;margin:0 0 12px;';
  if(cls(n,'kg-callout-card')) style+='background:'+(cls(n,'kg-callout-card-yellow')?'#443c20':'#203b4c')+';padding:20px;margin:24px 0;border-radius:6px;';
  if(cls(n,'kg-blockquote-alt')) style+='font-family:Georgia,serif;font-size:24px;font-style:italic;';
  let attrs='';
  for(const key of ['href','src','alt','colspan','rowspan','start']) {
   if(n.attributes[key]===undefined) continue;
   const value=['href','src'].includes(key)?url(n.attributes[key]):n.attributes[key];
   if(value) attrs+=` ${key}="${esc(decode(value))}"`;
  }
  if(tag==='img') attrs+=' width="600"';
  return `<${tag}${attrs}${style?` style="${style}"`:''}>${children}${['img','br','hr'].includes(tag)?'':`</${tag}>`}`;
 }
 const content=`<p style="font-size:14px;color:#bbb;">Game Notes &amp; Summaries · <a style="${styles.a}" href="${esc(postUrl)}">Read on the site</a></p>${hero?html(hero):''}<h1 style="${styles.h1}">${esc(title)}</h1>${excerpt?html(excerpt):''}${html(body)}<hr style="${styles.hr}"><p style="font-size:14px;color:#bbb;">Sent to our gaming table. <a style="${styles.a}" href="${esc(postUrl)}">View this recap online</a></p>`;
 const output=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title></head><body style="margin:0;background:#151719;color:#eee;font-family:Arial,sans-serif;font-size:17px;line-height:1.65;"><table role="presentation" width="100%" style="background:#151719;"><tr><td align="center"><table role="presentation" width="600" style="width:100%;max-width:600px;"><tr><td style="padding:24px;">${content}</td></tr></table></td></tr></table></body></html>`;
 function plain(n) {
  if(n.type===2) return n.value;
  if(['script','style'].includes(n.name)) return '';
  let s=(n.children||[]).map(plain).join('');
  if(n.name==='a' && n.attributes.href) s+=` (${n.attributes.href})`;
  if(n.name==='img') return n.attributes.alt?`[${n.attributes.alt}]\n`:'';
  if(['p','div','h1','h2','h3','h4','h5','h6','li','blockquote','hr','br','tr'].includes(n.name)) s+='\n\n';
  return s;
 }
 // The parser retains entity references; decode the common HTML/numeric entities for plain text and subject.

 return { subject:decode(title), html:output, text:decode(plain(parse(content))).replace(/\n[ \t]+/g,'\n').replace(/\n{3,}/g,'\n\n').trim() };
}
