import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { renderEmail } from '../email/render.mjs';
import { deliver, createSendState } from '../email.mjs';
test('renders post content and converts interactive elements safely',()=>{
 const m=renderEmail('<h1 class="article-title">A &amp; B</h1><section class="leota-content"><aside class="kg-callout-card kg-callout-card-blue">Clue</aside><blockquote>Quote</blockquote><img src="/image.webp"><iframe src="https://open.spotify.com/embed/track/123"></iframe><a href="javascript:alert(1)">bad link</a><script>secret()</script><details><summary>More</summary>Hidden text</details></section><aside>Recent posts</aside>','https://example.com/post/');
 assert.equal(m.subject,'A & B'); assert.match(m.html,/>A &amp; B<\/h1>/); assert.match(m.html,/https:\/\/example.com\/image.webp/); assert.match(m.html,/https:\/\/open.spotify.com\/track\/123/); assert.match(m.html,/background:#203b4c/); assert.match(m.text,/Hidden text/); assert.doesNotMatch(m.html,/iframe|javascript:|secret\(\)|Recent posts/);
});
test('accepted and ambiguous recipients cannot be resent; unsent recipients can resume',async()=>{
 const state=await fs.mkdtemp(path.join(os.tmpdir(),'leota-email-')); const message={html:'hello'}; let calls=[];
 try {
  await assert.rejects(deliver({message,recipients:['one@example.com','two@example.com'],state,transport:async r=>{calls.push(r);if(r.startsWith('two'))throw Error('network');return {id:'123'};}}),/network/);
  await deliver({message,recipients:['one@example.com'],state,transport:async()=>{throw Error('should not run');}});
  await assert.rejects(deliver({message,recipients:['two@example.com'],state,transport:async()=>{throw Error('should not run');}}),/pending/);
  await deliver({message,recipients:['three@example.com'],state,transport:async r=>{calls.push(r);return{id:'456'};}});
  assert.equal(calls.length,3);
 } finally { await fs.rm(state,{recursive:true,force:true}); }
});

test('expanded disclosures keep their boundary, heading and full content',()=>{
 const m=renderEmail('<h1 class="article-title">Recap</h1><section class="leota-content"><details class="leota-disclosure"><summary>How it really happened</summary><div><p>First paragraph.</p><p>Final paragraph.</p></div></details><p>Back to the recap.</p></section>','https://example.com/recap/');
 assert.match(m.html,/<div style="border:1px solid #424242;border-radius:4px;padding:20px;margin:0 0 24px;">/);
 assert.match(m.html,/<h4 style="[^"]*font-weight:600;[^"]*">How it really happened<\/h4>/);
 assert.doesNotMatch(m.html,/<details|<summary/);
 assert.match(m.text,/How it really happened\n\nFirst paragraph\./);
 assert.match(m.text,/Final paragraph\./);
 assert.match(m.text,/Back to the recap\./);
});

test('each test invocation sends afresh while table sends stay deduplicated',async()=>{
 const folder=await fs.mkdtemp(path.join(os.tmpdir(),'leota-repeat-'));let calls=0;
 const send=async mode=>deliver({message:{html:'recap'},recipients:['test@example.com'],state:await createSendState(folder,mode,'recap'),transport:async()=>{calls++;return{id:'ok'};}});
 try {
  assert.deepEqual(await send('test'),{accepted:1,skipped:0});
  assert.deepEqual(await send('test'),{accepted:1,skipped:0});
  assert.deepEqual(await send('send'),{accepted:1,skipped:0});
  assert.deepEqual(await send('send'),{accepted:0,skipped:1});
  assert.equal(calls,3);
 } finally {await fs.rm(folder,{recursive:true,force:true});}
});
