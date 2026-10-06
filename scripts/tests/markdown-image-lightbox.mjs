import assert from 'node:assert/strict';
import { createSatteriMarkdownProcessor, satteri } from '@astrojs/markdown-satteri';
import plugin from '../markdown-image-lightbox.mjs';

const renderer = await createSatteriMarkdownProcessor({ hastPlugins: [plugin], syntaxHighlight: false });
const render = async source => (await renderer.render(source)).code;
const standalone = await render('![Portrait](/portrait.webp "Title")');
assert.match(standalone, /<figure class="kg-card kg-image-card"><a href="\/portrait.webp"/);
assert.match(standalone, /alt="Portrait" title="Title" loading="lazy"/);
assert.match(standalone, /aria-label="Open Portrait in full size"/);
assert.match(await render('![](/portrait.webp)'), /aria-label="Open image in full size"/);
assert.match(await render('![Remote](https://example.com/image.jpg)'), /href="https:\/\/example.com\/image.jpg"/);
assert.match(await render('![Portrait][p]\n\n[p]: /portrait.webp'), /kg-image-card/);
for (const source of [
  'Before ![Inline](/inline.webp) after',
  '[![Linked](/image.webp)](/destination/)',
  '> ![Quoted](/image.webp)',
  '- ![List image](/image.webp)',
  '![One](/one.webp) ![Two](/two.webp)',
  '<img src="/plain.webp" alt="Opt out">',
]) assert.doesNotMatch(await render(source), /kg-image-card/);
for (const width of ['wide', 'full']) {
  const source = `<figure class="kg-card kg-image-card kg-width-${width}"><a href="/large.webp"><img src="/image.webp" alt="Image"></a></figure>`;
  assert.equal((await render(source)).trim(), source);
}
assert.equal((standalone.match(/<a\b/g) || []).length, 1);

// Exercise the MDX pipeline used by Astro, including component/HTML boundaries.
const mdx = await satteri({ hastPlugins: [plugin] }).createMdxRenderer({ syntaxHighlight: false }, { optimize: false });
const compile = async source => (await mdx.process(source, '/tmp/lightbox-test.mdx', {})).code;
assert.match(await compile('![Portrait](/portrait.webp)'), /kg-image-card/);
for (const source of [
  'Before ![Inline](/inline.webp) after',
  '[![Linked](/image.webp)](/destination/)',
  '<div>\n\n![Nested](/image.webp)\n\n</div>',
  '<Callout color="blue">\n\n![Nested](/image.webp)\n\n</Callout>',
]) assert.doesNotMatch(await compile(source), /kg-image-card/);
console.log('Markdown and MDX lightbox rendering verified; linked/inline images and existing layouts preserved.');
