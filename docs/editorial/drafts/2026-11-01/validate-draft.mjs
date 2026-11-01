import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../../..');
const article = JSON.parse(readFileSync(join(here, 'article.json'), 'utf8'));
const inventory = JSON.parse(readFileSync(join(here, 'inventory.json'), 'utf8')).posts;
const folder = mkdtempSync(join(tmpdir(), 'bali-draft-check-'));
const require = createRequire(import.meta.url);
const checks = [];
// Only pure validators are loaded; suppress development log transports in the bundle.
process.env.NODE_ENV = 'production';
const check = (name, fn) => {
  try { const details = fn(); checks.push({name, status:'passed', details:details ?? null}); }
  catch (e) { checks.push({name, status:'failed', details:e.message}); }
};
try {
  for (const [entry, output] of [['blog-content','content'],['editorial-blueprint','blueprint'],['blog-policy','policy']]) {
    execFileSync('pnpm', ['--filter','@workspace/api-server','exec','esbuild',`src/lib/${entry}.ts`,'--bundle','--platform=node','--format=cjs','--loader:.txt=text',`--outfile=${join(folder, output+'.cjs')}`], {cwd:root, stdio:'pipe'});
  }
  const content = require(join(folder, 'content.cjs'));
  const blueprint = require(join(folder, 'blueprint.cjs'));
  const policy = require(join(folder, 'policy.cjs'));
  check('validateArticle_existing_repository_function', () => {
    const value = content.validateArticle(article, inventory);
    return {wordCount:value.wordCount, note:'This function sanitizes a copy before checking it; citation preservation is tested separately.'};
  });
  check('validateBlueprintStructure_original_html', () => blueprint.validateBlueprintStructure(article.contentHtml, article.primaryKeyword, article.primaryKeyword));
  check('source_citations_survive_existing_sanitizer', () => {
    const before = [...article.contentHtml.matchAll(/href="([^"]+)"/g)].map(m=>m[1]);
    const after = content.cleanHtml(article.contentHtml);
    const removed = [...new Set(before.filter(url=>!after.includes(`href="${url}"`)))];
    if (removed.length) throw new Error('Existing source allowlist removes: '+removed.join(', '));
  });
  check('metadata_and_house_word_limits', () => {
    const count = policy.countWords(article.contentHtml);
    if (count<1800 || count>2400 || article.metaTitle.length>43 || article.metaDescription.length>160) throw new Error('House word or metadata limit exceeded');
    return {words:count, metaTitleCharacters:article.metaTitle.length, metaDescriptionCharacters:article.metaDescription.length};
  });
  check('html_json_identity_and_faq_count', () => {
    if (article.contentHtml!==readFileSync(join(here,'article.html'),'utf8')) throw new Error('HTML and JSON differ');
    const count=blueprint.articleFaqs(article.contentHtml).length;
    if(count<4||count>6) throw new Error('Invalid FAQ count');
    return {faqs:count};
  });
  check('illustrative_arithmetic', () => {
    if (10500000-500000!==10000000 || 8000000+2000000!==10000000 || 10000000-8000000!==2000000) throw new Error('Arithmetic mismatch');
    return '10,500,000 - 500,000 = 10,000,000; 8,000,000 + 2,000,000 = 10,000,000; remaining 2,000,000 then zero.';
  });
  check('no_forbidden_punctuation',()=>{if(JSON.stringify(article).includes(String.fromCharCode(8212)))throw new Error('Forbidden punctuation');});
  const result={checkedAt:new Date().toISOString(), publicationStatus:'draft', publishable:false, checks,
    independentModelReview:'not_run_no_verified_model_connection', professionalReview:'not_run_no_named_review_claimed',
    mobileRendering:'not_run_no_browser_render_in_this_draft_run',
    runtimeMutation:'none', note:'A passing article validator does not establish source preservation, factual approval or permission to publish.'};
  writeFileSync(join(here,'validation.json'),JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result,null,2));
} finally { rmSync(folder,{recursive:true,force:true}); }
