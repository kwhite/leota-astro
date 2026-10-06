"""Prepare only referenced site media; never overwrite public or backup sources.

Run with Python/Pillow: python3 scripts/prepare-media.py
Outputs ignored .media-delivery/ and a tracked delivery manifest.
"""
import hashlib
import json
import re
from pathlib import Path
from PIL import Image, ImageOps, features

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '.media-delivery'
MANIFEST = ROOT / 'docs/media-delivery-manifest.json'
PATTERN = re.compile(r'(?:/)?assets/images/[^\s\x22\x27<>\)\}\]]+\.(?:png|jpe?g|webp|gif|ico|svg)')

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def main():
    refs = {}
    for path in (ROOT / 'src').rglob('*'):
        if path.suffix in {'.md', '.mdx', '.json', '.ts', '.astro', '.css'}:
            for match in PATTERN.findall(path.read_text()):
                url = '/' + match.lstrip('/')
                refs.setdefault(url, set()).add(str(path.relative_to(ROOT)))
    previous_report = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}
    previous = {a['source']: a for a in previous_report.get('assets', [])}
    assets = []
    destinations = set()
    for url, usages in sorted(refs.items()):
        source = ROOT / 'public' / url.lstrip('/')
        if not source.is_file():
            raise ValueError(f'Missing source: {url}')
        source_sha = sha(source)
        with Image.open(source) as im:
            dimensions = list(im.size)
            animated = getattr(im, 'n_frames', 1) > 1
            transparent = 'A' in im.getbands() and im.getextrema()[-1][0] < 255
            # Keep favicon PNG as a deliberate compatibility exception.
            convert = source.suffix.lower() == '.png' and not animated
            convert = convert and url != '/assets/images/2024/12/IMG_0423-2.png'
            settings = {'method': 6, 'lossless': True, 'exact': True} if transparent else {'method': 6, 'quality': 90}
            delivery = str(Path(url).with_suffix('.webp')) if convert else url
            if convert and delivery in refs:
                delivery = str(Path(url).with_suffix('.optimized.webp'))
            if delivery in destinations:
                raise ValueError(f'Delivery name collision: {delivery}')
            destinations.add(delivery)
            dest = OUT / delivery.lstrip('/')
            dest.parent.mkdir(parents=True, exist_ok=True)
            old = previous.get(url)
            unchanged = old and old['sourceSha256'] == source_sha and old['settings'] == (settings if convert else None) and old['delivery'] == delivery and dest.exists() and sha(dest) == old['deliverySha256']
            if not unchanged:
                if convert:
                    image = ImageOps.exif_transpose(im).convert('RGBA' if transparent else 'RGB')
                    image.save(dest, 'WEBP', **settings)
                    with Image.open(dest) as check:
                        check.load()
                        assert check.size == image.size
                        if transparent:
                            assert check.convert('RGBA').tobytes() == image.convert('RGBA').tobytes()
                    dimensions = list(image.size)
                    if dest.stat().st_size >= source.stat().st_size:
                        delivery = url
                        dest = OUT / delivery.lstrip('/')
                        dest.parent.mkdir(parents=True, exist_ok=True)
                        dest.write_bytes(source.read_bytes())
                        convert = False
                else:
                    dest.write_bytes(source.read_bytes())
            assert sha(source) == source_sha
            assets.append({'source': url, 'delivery': delivery, 'sourceSha256': source_sha,
                'deliverySha256': sha(dest), 'sourceBytes': source.stat().st_size,
                'deliveryBytes': dest.stat().st_size, 'dimensions': dimensions,
                'transparent': transparent, 'animated': animated, 'settings': settings if convert else None,
                'status': 'converted' if convert else 'retained',
                'reason': ('lossless transparency' if transparent else 'quality 90 artwork') if convert else 'existing format, animation, favicon compatibility, or conversion not smaller',
                'usedIn': sorted(usages)})
        print(f'{len(assets)}/{len(refs)} {url}', flush=True)
    report = {'version': 1, 'pillow': Image.__version__, 'webp': features.version('webp'),
        'sourceBytes': sum(a['sourceBytes'] for a in assets),
        'deliveryBytes': sum(a['deliveryBytes'] for a in assets), 'assets': assets}
    if previous_report.get('publicDevelopmentUrl'):
        report['publicDevelopmentUrl'] = previous_report['publicDevelopmentUrl']
    MANIFEST.write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps({k: v for k, v in report.items() if k != 'assets'}))

if __name__ == '__main__':
    main()
