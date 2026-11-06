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
// Opposite quotes are legal inside a quoted HTML attribute. Exercise both
// delimiters on every response surface, preserving the suffix byte-for-byte.
for (const {source, destination} of redirects) {
  for (const prefix of ['', publicOrigin]) {
    for (const [quote, suffix] of [
      ['"', "?ref=owner's-report&amp;x=1#owner's-section"],
      ["'", '?ref=owner"s-report&amp;x=1#owner"s-section'],
    ]) {
      const anchor = `<a class="body" href=${quote}${prefix}${source}/${suffix}${quote} title="Unchanged title">Read guide</a>`;
      const fixedAnchor = anchor.replace(`${prefix}${source}/`, `${prefix}${destination}`);
      const post = {slug:'no-art-control', title:'Unchanged title', imageUrl:'/unchanged.webp', contentHtml:`<p>Unchanged scope</p>${anchor}`};
      const expected = {...post, contentHtml:`<p>Unchanged scope</p>${fixedAnchor}`};
      assert.equal(repointJournalLinks(anchor), fixedAnchor);
      assert.equal(repointJournalLinks(fixedAnchor), fixedAnchor);
      const seed = JSON.stringify({post}).replace(/</g,'\\u003c');
      const html = `${post.contentHtml}<script>window.__BLOG_INITIAL__=${seed};</script>`;
      const doc = repointDocument(html,'/blog/no-art-control');
      assert.equal(doc.slice(0,doc.indexOf('<script>')), expected.contentHtml);
      assert.deepEqual(JSON.parse(doc.match(/window\.__BLOG_INITIAL__=(.*);<\/script>/s)[1]),{post:expected});
      assert.equal(repointDocument(doc,'/blog/no-art-control'),doc);
      for (const [payload, fixed, path] of [
        [post,expected,'/api/blog/posts/no-art-control'],
        [[post],[expected],'/api/blog/posts'],
        [{posts:[post],total:1},{posts:[expected],total:1},'/api/blog/posts'],
        [{slug:'parent-without-art',relatedPosts:[post]},{slug:'parent-without-art',relatedPosts:[expected]},'/api/blog/posts/parent-without-art'],
      ]) {
        const actual = repointJson(JSON.stringify(payload),path);
        assert.deepEqual(JSON.parse(actual),fixed);
        assert.equal(repointJson(actual,path),actual);
      }
      const controls = `<a href=${quote}https://example.org${source}${suffix}${quote}>External</a><a href=${quote}//example.org${source}${suffix}${quote}>External</a><a href=${quote}${source}-other${suffix}${quote}>Other slug</a><p>${source}</p><link rel="canonical" href=${quote}${source}${suffix}${quote}>`;
      assert.equal(repointJournalLinks(controls),controls);
    }
  }
}
console.log('PASS: opposite-quote hrefs canonicalised on document, seed, single/list API and related posts; suffixes, controls and idempotence intact.');
console.log('PASS: journal redirect hrefs canonicalised on document, seed, single/list API and related posts; controls and idempotence intact.');

// QA attribute-boundary regressions across all mappings, URL forms and quotes.
let boundaryCases = 0;
for (const {source, destination} of redirects) {
  for (const prefix of ['', publicOrigin]) {
    for (const [quote, other] of [['"', "'"], ["'", '"']]) {
      const old = `${prefix}${source}`;
      const fixed = `${prefix}${destination}`;
      const cases = [
        [`<a title=${quote}Balance > 0${quote} href=${quote}${old}${quote}>Read</a>`, `<a title=${quote}Balance > 0${quote} href=${quote}${fixed}${quote}>Read</a>`],
        [`<a title=${quote}Example href=${other}${old}${other}${quote} href=${quote}/services${quote}>Read</a>`, null],
        [`<a title=${quote}Example href=${other}${old}${other}${quote} href=${quote}${old}${quote}>Read</a>`, `<a title=${quote}Example href=${other}${old}${other}${quote} href=${quote}${fixed}${quote}>Read</a>`],
      ];
      for (const [input, changed] of cases) {
        const expected = changed ?? input;
        const post = {slug:'no-art-control',title:'Unchanged title',contentHtml:input};
        const expectedPost = {...post,contentHtml:expected};
        assert.equal(repointJournalLinks(input),expected);
        assert.equal(repointDocument(input,'/blog/no-art-control'),expected);
        const seed = JSON.stringify({post}).replace(/</g,'\\u003c');
        const document = repointDocument(`<script>window.__BLOG_INITIAL__=${seed};</script>`,'/blog/no-art-control');
        assert.deepEqual(JSON.parse(document.match(/window\.__BLOG_INITIAL__=(.*);<\/script>/s)[1]),{post:expectedPost});
        for (const [payload, output, path] of [
          [post,expectedPost,'/api/blog/posts/no-art-control'],
          [[post],[expectedPost],'/api/blog/posts'],
          [{posts:[post],total:1},{posts:[expectedPost],total:1},'/api/blog/posts'],
          [{slug:'parent-without-art',relatedPosts:[post]},{slug:'parent-without-art',relatedPosts:[expectedPost]},'/api/blog/posts/parent-without-art'],
        ]) assert.deepEqual(JSON.parse(repointJson(JSON.stringify(payload),path)),output);
        assert.equal(repointJournalLinks(expected),expected);
        boundaryCases++;
      }
      const anchor = `<a href=${quote}${old}${quote}>Read</a>`;
      for (const control of [`<!-- ${anchor} -->`, `<script>const example = ${JSON.stringify(anchor)};</script>`, `<style>/* ${anchor} */</style>`, `<textarea>${anchor}</textarea>`, `<title>${anchor}</title>`]) {
        assert.equal(repointJournalLinks(control),control);
      }
    }
  }
}
console.log(`PASS: ${boundaryCases} attribute-boundary cases on document, seed, API and related posts; comments/raw-text controls unchanged.`);
