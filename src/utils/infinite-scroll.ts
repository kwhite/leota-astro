/** Progressively enhance the server-rendered pagination links. */
export function initInfiniteScroll(selector = '.post-feed') {
  const postFeed = document.querySelector<HTMLElement>(selector);
  if (!postFeed) return;

  let currentPage = Number(postFeed.dataset.currentPage || 1);
  const maxPages = Number(postFeed.dataset.maxPages || 1);
  const baseUrl = postFeed.dataset.baseUrl || '/';
  const controller = new AbortController();
  let isLoading = false;
  let failed = false;

  const infiniteScroll = async () => {
    if (isLoading || failed || currentPage >= maxPages) return;
    if (window.scrollY + window.innerHeight < document.documentElement.scrollHeight - 100) return;
    isLoading = true;
    const nextPage = currentPage + 1;

    try {
      const response = await fetch(`${baseUrl}page${nextPage}/`, { signal: controller.signal });
      if (!response.ok) throw new Error('Page fetch failed');
      const html = await response.text();
      if (controller.signal.aborted) return;
      const documentFragment = new DOMParser().parseFromString(html, 'text/html');
      const cards = documentFragment.querySelectorAll(`${selector} > .post-card`);
      if (!cards.length) throw new Error('The next page contains no posts');
      postFeed.append(...cards);
      currentPage = nextPage;
      postFeed.dataset.currentPage = String(currentPage);

      // Keep manual navigation accurate after loading more content.
      const pagination = document.querySelector('.feed-pagination');
      const nextPagination = documentFragment.querySelector('.feed-pagination');
      if (pagination && nextPagination) pagination.replaceWith(nextPagination);
    } catch (error) {
      if (!controller.signal.aborted) {
        failed = true;
        console.error('Error loading next page; pagination links remain available:', error);
      }
    } finally {
      isLoading = false;
    }
  };

  const cleanup = () => {
    controller.abort();
    window.removeEventListener('scroll', infiniteScroll);
    window.removeEventListener('resize', infiniteScroll);
    document.removeEventListener('astro:before-swap', cleanup);
  };
  document.addEventListener('astro:before-swap', cleanup);
  window.addEventListener('scroll', infiniteScroll, { passive: true });
  window.addEventListener('resize', infiniteScroll, { passive: true });
}
