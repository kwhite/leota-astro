"""Audit built HTML links, fragment targets, and bundled redirect destinations.
Run after the production build: python3 scripts/tests/internal-links.py
External links are inventoried, not fetched; Cloudflare execution requires deployment.
"""
import json,re
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,urljoin,unquote
ROOT=Path(__file__).resolve().parents[2]
DIST=ROOT/'dist'
class Document(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.ids=set()
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if a.get('id'):self.ids.add(a['id'])
  if tag=='a' and 'href' in a:self.links.append(a['href'])
docs={}
for f in DIST.rglob('*.html'):
 route='/'+str(f.relative_to(DIST)).removesuffix('index.html')
 p=Document();p.feed(f.read_text());docs[route]=p
rules=[]
for line in (DIST/'_redirects').read_text().splitlines():
 if not line.strip() or line.startswith('#'):continue
 source,target,status=line.split();assert status=='301',line
 rules.append((source,target))
def redirect(path):
 for source,target in rules:
  if source.endswith('*') and path.startswith(source[:-1]):return target.replace(':splat',path[len(source)-1:])
  if source==path:return target
 return None
def resolve(path):
 seen=set()
 while (target:=redirect(path)) is not None:
  assert path not in seen, f'Redirect cycle: {path}'
  seen.add(path);path=target
 return path
failures=[];external=set();count=0
for route,p in docs.items():
 for href in p.links:
  u=urlsplit(urljoin('https://herebedragons.club'+route,href))
  if u.scheme not in ('http','https'):continue
  if u.hostname not in ('herebedragons.club','www.herebedragons.club'):
   external.add(href);continue
  count+=1;path=unquote(resolve(u.path));target=docs.get(path) or docs.get(path.rstrip('/')+'/')
  if target is None and not (DIST/path.lstrip('/')).is_file():failures.append({'page':route,'href':href,'reason':'missing route'})
  elif target is not None and u.fragment and unquote(u.fragment) not in target.ids:failures.append({'page':route,'href':href,'reason':'missing fragment'})
redirect_checks=[]
for source,target in rules:
 # Every archive wildcard must support the archive itself and its feed.
 samples=[source[:-1],source[:-1]+'feed.xml'] if source.endswith('*') else [source]
 for sample in samples:
  dest=resolve(sample);exists=dest in docs or dest.rstrip('/')+'/' in docs or (DIST/dest.lstrip('/')).is_file()
  redirect_checks.append({'from':sample,'to':dest,'exists':exists})
  if not exists:failures.append({'page':'_redirects','href':sample,'reason':'missing redirect destination: '+dest})
report={'builtHtmlPages':len(docs),'internalLinkOccurrences':count,'redirectChecks':redirect_checks,'failures':failures,'externalLinksNotNetworkChecked':sorted(external)}
(ROOT/'docs/link-audit.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='externalLinksNotNetworkChecked'},indent=2))
raise SystemExit(bool(failures))
