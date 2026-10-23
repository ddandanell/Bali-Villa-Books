"""Audit real rendered pages, links, canonical imagery and the running sitemap."""
import concurrent.futures
import hashlib
import json
import os
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin, urlsplit, unquote
from urllib.request import urlopen, Request
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
PUBLIC = ROOT / "artifacts/villabooks-bali/dist/public"
ORIGIN = "https://bali-villa-accounting-service.com"
PREVIEW = "https://" + os.environ["REPLIT_DEV_DOMAIN"]
pages = json.loads((ROOT / "lib/site-content/src/page-imagery.json").read_text())
journals = json.loads((ROOT / "lib/site-content/src/journal-imagery.json").read_text())


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.links, self.images, self.ids, self.meta = [], [], set(), {}
        self.canonical, self.h1 = "", 0
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get("id"):
            self.ids.add(a["id"])
        if tag == "h1":
            self.h1 += 1
        if tag == "a" and a.get("href"):
            self.links.append(a["href"])
        if tag == "img":
            self.images.append(a)
        if tag == "link" and a.get("rel") == "canonical":
            self.canonical = a.get("href", "")
        if tag == "meta":
            self.meta[a.get("property", a.get("name", ""))] = a.get("content", "")


def get(url):
    with urlopen(Request(url, headers={"User-Agent": "BaliAccounting-SiteAudit/1.0"}), timeout=25) as response:
        return response.read(), response.headers.get("Content-Type", "")


dev_posts = json.loads(get(PREVIEW + "/api/blog/posts?limit=50")[0])
live_posts = json.loads(get(ORIGIN + "/api/blog/posts?limit=50")[0])
aliases = {"clean-books-villa-sale-price": "clean-books-villa-sale-bali"}
all_slugs = {p["slug"] for p in dev_posts + live_posts if p["slug"] not in aliases}
# New automatic articles can use independently licensed external photos.
assert all(p["slug"] in journals for p in dev_posts if p["imageUrl"].startswith("/images/journal/"))
documents = {}
for route in pages:
    if route == "/blog":
        html = get(PREVIEW + route)[0].decode()
    else:
        html = (PUBLIC / ("index.html" if route == "/" else route[1:] + "/index.html")).read_text()
    documents[route] = Page(html)
for post in dev_posts:
    assert post["imageUrl"] == journals[post["slug"]]["imageUrl"], post["slug"]
    route = "/blog/" + post["slug"]
    documents[route] = Page(get(PREVIEW + route)[0].decode())
for post in live_posts:
    if post["slug"] in aliases:
        continue
    route = "/blog/" + post["slug"]
    if route not in documents:
        documents[route] = Page(get(ORIGIN + route)[0].decode())

errors, local_targets, seen_images, seen_shares, hashes = [], set(), set(), set(), set()
for route, document in documents.items():
    expected = pages.get(route) or journals.get(route.removeprefix("/blog/"))
    assert document.h1 == 1, (route, "H1 count", document.h1)
    assert document.canonical == ORIGIN + route, (route, document.canonical)
    assert document.meta.get("description") and document.meta.get("og:title"), route
    if route in pages or route.removeprefix("/blog/") in {p["slug"] for p in dev_posts}:
        assert any(i.get("src") == expected["imageUrl"] and i.get("alt") for i in document.images), (route, "missing primary image")
        assert urlsplit(document.meta["og:image"]).path == expected["shareImage"], (route, "sharing image")
        assert document.meta["og:image"] == document.meta["twitter:image"], route
    for href in document.links:
        resolved = urlsplit(urljoin(ORIGIN + route, href))
        if resolved.hostname != urlsplit(ORIGIN).hostname:
            continue
        target = resolved.path.rstrip("/") or "/"
        if target == "/contact":
            target = "/get-started"
        if target.startswith("/blog/") and target[6:] in aliases:
            target = "/blog/" + aliases[target[6:]]
        if target not in documents and not target.startswith("/api/"):
            errors.append((route, href, "unknown internal target"))
        elif resolved.fragment and target in documents and unquote(resolved.fragment) not in documents[target].ids:
            errors.append((route, href, "missing anchor"))
        local_targets.add(target)
assert not errors, errors

for visual in list(pages.values()) + list(journals.values()):
    assert visual["imageUrl"] not in seen_images, visual["imageUrl"]
    assert visual["shareImage"] not in seen_shares, visual["shareImage"]
    seen_images.add(visual["imageUrl"])
    seen_shares.add(visual["shareImage"])
    for url in [visual["imageUrl"], visual["shareImage"]]:
        file = PUBLIC / url.lstrip("/")
        assert file.exists(), file
        if url == visual["imageUrl"]:
            digest = hashlib.sha256(file.read_bytes()).hexdigest()
            assert digest not in hashes, (url, "duplicate photo bytes")
            hashes.add(digest)
        assert file.stat().st_size < 600_000, (url, "oversized image")

def check_asset(url):
    body, mime = get(PREVIEW + url)
    assert body and mime.startswith("image/"), (url, mime)

with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    list(pool.map(check_asset, seen_images | seen_shares))

xml, mime = get(PREVIEW + "/sitemap.xml")
tree = ET.fromstring(xml)
ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9", "i": "http://www.google.com/schemas/sitemap-image/1.1"}
rows = tree.findall("s:url", ns)
expected_routes = set(pages) | {"/blog/" + post["slug"] for post in dev_posts}
actual_routes = {urlsplit(row.findtext("s:loc", namespaces=ns)).path for row in rows}
assert actual_routes == expected_routes, (expected_routes - actual_routes, actual_routes - expected_routes)
for row in rows:
    assert row.findtext("s:lastmod", namespaces=ns)
    assert row.findtext("i:image/i:loc", namespaces=ns)
live_xml = get(ORIGIN + "/sitemap.xml")[0]
ET.fromstring(live_xml)
report = {
    "marketing_and_journal_index": len(pages),
    "development_articles": len(dev_posts),
    "published_articles_checked": len(live_posts),
    "canonical_pages_checked": len(documents),
    "unique_primary_photos": len(seen_images),
    "unique_share_cards": len(seen_shares),
    "working_image_requests": len(seen_images | seen_shares),
    "internal_link_targets_checked": len(local_targets),
    "workspace_sitemap_entries": len(rows),
    "published_sitemap_reachable": True,
    "published_image_namespace": b"sitemap-image" in live_xml,
    "publication_note": "Workspace imagery and sitemap improvements require republishing.",
}
print(json.dumps(report, indent=2))
