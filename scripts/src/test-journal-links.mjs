import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { repointDocument, repointJson, repointJournalLinks, publicOrigin } from '../../api/gateway.mjs';
const redirects = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url))).redirects.filter(x => x.source.startsWith('/blog/'));
for (const {source, destination} of redirects) {
  for (const prefix of ['', publicOrigin]) {
    for (const quote of ['"', "'"]) {
      const input = `<p>Unchanged scope</p><a class="body" href=${quote}${prefix}${source}/?ref=journal&amp;x=1#section${quote}>Read guide</a>`;
      const expected = input.replace(`${prefix}${source}/`, `${prefix}${destination}`);
      assert.equal(repointJournalLinks(input), expected);
      assert.equal(repointJournalLinks(expected), expected);
    }
  }
  const controls = `<a href="https://example.org${source}">External</a><a href="//example.org${source}">External</a><a href="${source}-other">Other slug</a><p>${source}</p><link rel="canonical" href="${source}">`;
  assert.equal(repointJournalLinks(controls), controls);
  const post = {slug:'no-art-control', title:'Unchanged title', contentHtml:`<p>Unchanged scope</p><a href="${source}">Read guide</a>`, imageUrl:'/unchanged.webp'};
  const expected = {...post, contentHtml:post.contentHtml.replace(source,destination)};
  assert.deepEqual(JSON.parse(repointJson(JSON.stringify(post),'/api/blog/posts/no-art-control')),expected);
  assert.deepEqual(JSON.parse(repointJson(JSON.stringify([post]),'/api/blog/posts')),[expected]);
  assert.deepEqual(JSON.parse(repointJson(JSON.stringify({posts:[post],total:1}),'/api/blog/posts')),{posts:[expected],total:1});
  const seed = JSON.stringify({post}).replace(/</g,'\\u003c');
  const html = `${post.contentHtml}<script>window.__BLOG_INITIAL__=${seed};</script>`;
  const doc = repointDocument(html,'/blog/no-art-control');
  assert.ok(doc.includes(`href="${destination}"`));
  const parsedSeed = JSON.parse(doc.match(/window\.__BLOG_INITIAL__=(.*);<\/script>/s)[1]);
  assert.deepEqual(parsedSeed.post,expected);
  assert.equal(repointDocument(doc,'/blog/no-art-control'),doc);
  const related = {slug:'parent-without-art',relatedPosts:[post]};
  assert.deepEqual(JSON.parse(repointJson(JSON.stringify(related),'/api/blog/posts/parent-without-art')).relatedPosts,[expected]);
}
console.log('PASS: journal redirect hrefs canonicalised on document, seed, single/list API and related posts; controls and idempotence intact.');
