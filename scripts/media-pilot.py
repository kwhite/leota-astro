"""Non-destructive WebP comparison pilot. Requires Pillow with WebP support."""
import argparse
import hashlib
import html
import json
from pathlib import Path
from PIL import Image, ImageOps, features

ROOT = Path(__file__).resolve().parents[1]
SAMPLES = [
    ('branding', '2025/01/IMG_0489.png'),
    ('photo', '2025/02/IMG_0502.jpeg'),
    ('portrait', '2026/05/cillian-tennant.png'),
    ('map', '2026/05/city-of-mist-map.jpg'),
    ('text-card', '2025/04/thegriffonssaddlebag-membership-card-patreon.png'),
    ('illustration', '2025/03/musetta._A_dynamic_wide_angle_fantasy_image_of_a_wrecked_scho_7fe3cb9f-6c99-46a9-b917-5e1579966fea_0.png'),
    ('gallery', '2025/03/granted3609_dnd_style_a_stocky_human_male_mariner_--v_6.1_e1868e4b-4422-4d5c-a575-7358089afee1-1.png'),
]

def checksum(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    out = args.output.resolve()
    if out == ROOT / 'public' or ROOT / 'public' in out.parents:
        raise ValueError('Pilot outputs must stay outside public.')
    out.mkdir(parents=True, exist_ok=True)
    report = {'pillow': Image.__version__, 'webp': features.version('webp'), 'assets': []}
    sections = []
    for label, relative in SAMPLES:
        source = ROOT / 'public/assets/images' / relative
        before = checksum(source)
        with Image.open(source) as original:
            if getattr(original, 'n_frames', 1) > 1:
                raise ValueError(f'Animated source needs a separate policy: {relative}')
            image = ImageOps.exif_transpose(original).convert('RGBA' if 'A' in original.getbands() else 'RGB')
            record = {'source': '/assets/images/' + relative, 'sha256': before,
                      'bytes': source.stat().st_size, 'dimensions': list(image.size),
                      'hasTransparency': image.mode == 'RGBA' and image.getextrema()[-1][0] < 255,
                      'variants': []}
            figures = [f'<figure><figcaption>Source</figcaption><a href="{source.as_uri()}"><img src="{source.as_uri()}"></a></figure>']
            for name, settings in [('q80', {'quality': 80}), ('q90', {'quality': 90}), ('lossless', {'lossless': True, 'exact': True})]:
                dest = out / label / name / Path(relative).with_suffix('.webp')
                dest.parent.mkdir(parents=True, exist_ok=True)
                image.save(dest, 'WEBP', method=6, **settings)
                with Image.open(dest) as check:
                    check.load()
                    assert check.size == image.size
                    if image.mode == 'RGBA':
                        assert check.convert('RGBA').getchannel('A').tobytes() == image.getchannel('A').tobytes()
                    if name == 'lossless':
                        assert check.convert('RGBA').tobytes() == image.convert('RGBA').tobytes()
                size = dest.stat().st_size
                savings = round(100 * (1 - size / record['bytes']), 1)
                record['variants'].append({'name': name, 'settings': {'method': 6, **settings},
                    'file': str(dest.relative_to(out)), 'bytes': size, 'sha256': checksum(dest), 'savingsPercent': savings})
                url = html.escape(str(dest.relative_to(out)), quote=True)
                figures.append(f'<figure><figcaption>{name}: {size / 1024:.0f} KiB · {savings}% smaller</figcaption><a href="{url}"><img src="{url}"></a></figure>')
            assert checksum(source) == before
            report['assets'].append(record)
            sections.append(f'<section><h2>{label} · {image.width} × {image.height} · source {record["bytes"] / 1024:.0f} KiB</h2><div>{"".join(figures)}</div></section>')
    (out / 'manifest.json').write_text(json.dumps(report, indent=2) + '\n')
    (out / 'index.html').write_text('<!doctype html><meta charset="utf-8"><title>Leota media pilot</title><style>body{background:#151719;color:#eee;font:16px system-ui;margin:24px}section{margin:40px 0}section>div{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}figure{margin:0}img{width:100%;height:auto;background:repeating-conic-gradient(#555 0% 25%,#333 0% 50%) 0/20px 20px}figcaption{margin-bottom:12px}@media(max-width:800px){section>div{grid-template-columns:repeat(2,minmax(0,1fr))}}</style><h1>Leota media pilot</h1><p>Full dimensions retained. Click any image to inspect full size. These are comparison alternatives, not a deployment bundle.</p>' + ''.join(sections))
    print(json.dumps({'assets': len(report['assets']), 'sourceBytes': sum(a['bytes'] for a in report['assets']), 'variantBytes': {n: sum(next(v['bytes'] for v in a['variants'] if v['name'] == n) for a in report['assets']) for n in ['q80','q90','lossless']}, 'review': str(out / 'index.html')}))

if __name__ == '__main__':
    main()
