// Only top-level Markdown image paragraphs become cards. Existing HTML/MDX
// figures, components, linked images, and images within prose remain untouched.
export default {
  name: 'markdown-image-lightbox',
  element: {
    filter: ['p'],
    visit(node, ctx) {
      if (ctx.parent(node)?.type !== 'root') return;
      const children = node.children.filter(child => child.type !== 'text' || child.value.trim());
      if (children.length !== 1) return;
      const image = children[0];
      if (image.type !== 'element' || image.tagName !== 'img') return;
      const { src, alt = '' } = image.properties ?? {};
      // Site content uses public-root paths or remote URLs. Relative imports
      // are processed by Astro and don't have a stable full-size URL here.
      if (typeof src !== 'string' || !/^(\/|https?:\/\/)/.test(src)) return;
      ctx.replaceNode(node, {
        type: 'element', tagName: 'figure',
        properties: { className: ['kg-card', 'kg-image-card'] },
        children: [{
          type: 'element', tagName: 'a',
          properties: { href: src, ariaLabel: alt ? `Open ${alt} in full size` : 'Open image in full size' },
          children: [{
            ...image,
            properties: { ...image.properties, loading: image.properties.loading ?? 'lazy' },
          }],
        }],
      });
    },
  },
};
