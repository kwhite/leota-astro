import assert from 'node:assert/strict';
import { initInfiniteScroll } from '../../src/utils/infinite-scroll.ts';

function listing(currentPage, maxPages, failOnPage) {
  const events = new Map();
  const pagination = page => ({
    page, hidden: false,
    setAttribute(name) { if (name === 'hidden') this.hidden = true; },
    removeAttribute(name) { if (name === 'hidden') this.hidden = false; },
    replaceWith(next) { state.pagination = next; },
  });
  const state = {
    pagination: pagination(currentPage), requests: [], cards: [],
    feed: {
      dataset: { currentPage: String(currentPage), maxPages: String(maxPages), baseUrl: '/tag/arc-1/' },
      append(...cards) { state.cards.push(...cards); },
    },
  };
  globalThis.document = {
    querySelector(selector) { return selector === '.post-feed' ? state.feed : state.pagination; },
    documentElement: { scrollHeight: 1000 },
    addEventListener() {}, removeEventListener() {},
  };
  globalThis.window = {
    scrollY: 900, innerHeight: 500,
    addEventListener(name, callback) { events.set(name, callback); },
    removeEventListener() {},
  };
  globalThis.fetch = async url => {
    const page = Number(url.match(/page(\d+)/)[1]);
    state.requests.push(page);
    return { ok: page !== failOnPage, text: async () => String(page) };
  };
  globalThis.DOMParser = class {
    parseFromString(html) {
      const page = Number(html);
      return { querySelectorAll: () => [{ page }], querySelector: () => pagination(page) };
    }
  };
  initInfiniteScroll();
  state.scroll = () => events.get('scroll')();
  return state;
}

const complete = listing(1, 2);
assert.equal(complete.pagination.hidden, true);
await complete.scroll();
assert.equal(complete.cards.length, 1);
assert.equal(complete.feed.dataset.currentPage, '2');
assert.equal(complete.pagination.hidden, true, 'No redundant last-page navigation after automatic loading');
await complete.scroll();
assert.deepEqual(complete.requests, [2]);

const failed = listing(1, 3, 3);
await failed.scroll();
assert.equal(failed.pagination.hidden, true);
const originalError = console.error;
console.error = () => {};
try { await failed.scroll(); } finally { console.error = originalError; }
assert.equal(failed.pagination.hidden, false, 'Restore manual navigation after fetch failure');
assert.equal(failed.pagination.page, 2, 'Fallback belongs to the last successfully loaded page');
await failed.scroll();
assert.deepEqual(failed.requests, [2, 3], 'Failed automatic requests are not repeated');

const direct = listing(2, 2);
assert.equal(direct.pagination.hidden, false, 'Direct last-page visitors retain navigation');
await direct.scroll();
assert.deepEqual(direct.requests, []);
console.log('Infinite-scroll pagination: completed loading, failure fallback and direct-page navigation verified.');
