# Media optimization pilot — 2026-10-05

Seven existing prototype assets compared at full dimensions using Pillow 12.3.0 / libwebp 1.6.0. Quality 80, quality 90 and exact lossless WebP were generated outside public; source checksums are unchanged. All outputs decode, preserve dimensions and alpha; lossless outputs preserve RGBA pixels exactly.

| Sample | Source KiB | Q80 KiB | Q90 KiB | Lossless KiB |
| --- | ---: | ---: | ---: | ---: |
| IMG_0489.png | 61 | 39 | 42 | 28 |
| IMG_0502.jpeg | 151 | 88 | 153 | 1032 |
| cillian-tennant.png | 6677 | 160 | 523 | 4721 |
| city-of-mist-map.jpg | 593 | 500 | 743 | 2748 |
| thegriffonssaddlebag-membership-card-patreon.png | 4236 | 196 | 338 | 2962 |
| musetta._A_dynamic_wide_angle_fantasy_image_of_a_wrecked_scho_7fe3cb9f-6c99-46a9-b917-5e1579966fea_0.png | 2101 | 170 | 287 | 1527 |
| granted3609_dnd_style_a_stocky_human_male_mariner_--v_6.1_e1868e4b-4422-4d5c-a575-7358089afee1-1.png | 1152 | 86 | 140 | 722 |

Total source: 14.62 MiB. All Q80: 1.21 MiB (91.7% smaller). All Q90: 2.17 MiB (85.1% smaller). Lossless: 13.42 MiB (8.2% smaller). Alternatives are for comparison, not all for deployment.

Initial recommendation pending full-size visual acceptance: lossless WebP for the transparent logo; Q90 for PNG portraits, illustrations and Patreon cards; retain existing JPEGs unless a specific conversion offers worthwhile savings without detail loss. The map Q90 is larger than its JPEG and Q80 saves only 15.5%, so keep the JPEG map/download. Already optimized WebPs should not be recompressed by default.

Contact-sheet inspection shows similar appearance at reduced display sizes; full-size user review remains required, especially text and portrait detail. No responsive resize variants were generated in this first quality comparison. The sample called photo is actually an illustrated city scene stored as JPEG; a genuine photographic source should be checked if the archive contains one. Animation and wider archive inventory remain future work.

Review artifacts (local only): /Users/kat/.codex/visualizations/2026/10/06/01a10e86-b72c-7181-979f-c03577d3f4f3/media-pilot/index.html. Machine-readable checksums/settings: /Users/kat/.codex/visualizations/2026/10/06/01a10e86-b72c-7181-979f-c03577d3f4f3/media-pilot/manifest.json. Reproduce with `python3 scripts/media-pilot.py --output <directory-outside-public>` using Pillow with WebP support.

No content references were changed, no assets uploaded, and no production build/deployment was triggered. R2 is empty and reachable using the local leota-r2 profile. Cloudflare Workers Static Assets now hosts the site; delivery uses R2 rather than the earlier AWS hosting proposal.
