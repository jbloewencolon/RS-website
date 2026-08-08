# Relational Sovereignty — Technical SEO & AI Search (AEO/GEO) Implementation Specification

**Target Domain:** [relationalsovereignty.com](https://relationalsovereignty.com)  
**Role / Audience:** Lead Web Developer / Technical Implementer  
**Objective:** Overhaul site architecture to resolve zero-indexation issues, unblock AI answer engines (ChatGPT, Perplexity, Google AI Overviews, Claude), implement Static Site Generation (SSG), inject JSON-LD schema, and establish clean URL routing.

---

## 1. Diagnostic Summary & Root Cause Analysis

A technical audit of `relationalsovereignty.com` reveals critical structural barriers preventing both traditional search engine crawlers (Googlebot, Bingbot) and AI Retrieval-Augmented Generation (RAG) scrapers (`GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`) from indexing and citing the site content.

```
+-----------------------------------------------------------------------------------+
|                            PRIMARY DISCOVERABILITY BARRIER                        |
|                                                                                   |
|   1. Client-Side JS Rendering (CSR) + .dc.html URLs  --> Crawlers see empty pages |
|   2. Restrictive Crawler Policy                     --> AI bots actively blocked  |
|   3. Zero JSON-LD Schema / Missing Meta Tags        --> No machine entity context |
|   4. Anonymous Author / Missing E-E-A-T             --> Low authority confidence  |
+-----------------------------------------------------------------------------------+
```

### Critical Deficiencies Observed:
1. **Client-Side Rendering (CSR) Wrapper:** The site loads an empty mount point (`<div id="root"></div>`) that relies on `./vendor/react.production.min.js`. Crawlers receiving raw HTML see zero text content.
2. **Restrictive Scraper Signals:** Requests to inner routes like `Manifesto.dc.html` trigger `URL_FETCH_STATUS_GOOGLE_EXTENDED_OPT_OUT` and `PERMISSION_DENIED` errors.
3. **Non-Standard Routing:** Navigation routes use `.dc.html` extensions (`Learn.dc.html`, `Manifesto.dc.html`) rather than clean, canonical extensionless paths.
4. **Missing Machine-Readable Context:** Zero JSON-LD schema exists on any page. Entity definitions for "Relational Sovereignty" are completely unmapped in Google's Knowledge Graph or LLM knowledge bases.
5. **Stylistic Headings over Structural Scannability:** H1 and H2 tags are poetic rather than query-focused, hindering semantic chunking by LLMs during vector search retrieval.

---

## 2. 10 Technical Strategy Implementation Tasks

---

### Task #1 (Priority 1): Migrate Build Architecture to Static Pre-Rendering (SSG)

* **Goal:** Deliver 100% complete, semantic HTML directly in initial HTTP responses without requiring client-side JavaScript execution.
* **Why:** AI crawlers and search engine indexing bots frequently bypass or time out on client-side JS bundles. If raw HTML is empty, page indexation fails completely.
* **Current State:** `<div id="root"></div>` initialized via `react.production.min.js`.
* **Developer Implementation:**
  * Configure your build tool (e.g., Vite SSG, Astro, Next.js SSG, or Cloudflare Workers HTML pre-rendering) to output static HTML files for every route.
  * Hydrate client-side interactive tools (such as the Consent Domains Map on `/practise`) *after* static DOM render.

#### HTML Target Payload Example (`/manifesto`):
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>The Relational Sovereignty Manifesto | Sixteen Theses and a Refusal</title>
  <meta name="description" content="Read the Relational Sovereignty Manifesto: sixteen theses and a refusal proposing non-colonized, non-coercive relationships across human and digital systems." />
  <link rel="canonical" href="https://relationalsovereignty.com/manifesto" />
</head>
<body>
  <header>...</header>
  <main id="main-content">
    <article>
      <h1>NO OWNERS. NO OBJECTS. NO COLONIES IN OUR RELATIONSHIPS.</h1>
      <p>Relational sovereignty asks how we can build relationships that protect self-determination while recognizing interdependence, care, responsibility, and the living worlds to which we belong.</p>
      <!-- Complete manifesto text rendered statically -->
    </article>
  </main>
</body>
</html>
```

---

### Task #2 (Priority 2): Reconfigure `robots.txt` & Crawler Access Control

* **Goal:** Explicitly permit search engine and AI scrapers to crawl educational routes (`/manifesto`, `/learn`, `/archive`, `/resources`), while protecting local browser state in tools.
* **Why:** AI answer engines (Perplexity, ChatGPT, Claude, Google AI Overviews) require active crawling access to process, index, and cite website content.
* **Developer Implementation:**
  * Deploy a domain-root `robots.txt` allowing standard search and AI user-agents.
  * Remove restrictive opt-out headers (`Google-Extended`, `X-Robots-Tag: noindex`) from static educational pages.

#### Production `robots.txt` Configuration:
```text
User-agent: *
Allow: /
Allow: /manifesto
Allow: /learn
Allow: /archive
Allow: /resources
Allow: /behind-the-scenes
Allow: /invitation

# Ensure local browser storage sessions/states are not indexed if dynamic routes exist
Disallow: /practise/session/

Sitemap: https://relationalsovereignty.com/sitemap.xml
```

---

### Task #3 (Priority 3): Implement JSON-LD Schema Graphs (`DefinedTerm`, `Article`, `Organization`)

* **Goal:** Provide explicit machine-readable metadata defining "Relational Sovereignty" as a formal philosophical term and entity.
* **Why:** Structured data feeds directly into search engine Knowledge Graphs and AI model context windows during RAG retrieval.
* **Developer Implementation:** Inject the following `<script type="application/ld+json">` block into the `<head>` of `/learn` and `/manifesto`.

#### JSON-LD Script Template:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "DefinedTerm",
      "@id": "https://relationalsovereignty.com/#concept",
      "name": "Relational Sovereignty",
      "description": "An ethical and operational framework defining autonomy not as isolation, but as self-determination within interdependent, non-coercive relationships.",
      "inDefinedTermSet": "https://relationalsovereignty.com/learn"
    },
    {
      "@type": "WebSite",
      "@id": "https://relationalsovereignty.com/#website",
      "url": "https://relationalsovereignty.com/",
      "name": "Relational Sovereignty",
      "description": "A commons under construction exploring non-domination, consent, and interdependence."
    },
    {
      "@type": "Article",
      "@id": "https://relationalsovereignty.com/manifesto/#article",
      "headline": "The Relational Sovereignty Manifesto: Sixteen Theses and a Refusal",
      "inLanguage": "en",
      "mainEntityOfPage": "https://relationalsovereignty.com/manifesto",
      "isPartOf": { "@id": "https://relationalsovereignty.com/#website" },
      "publisher": {
        "@type": "Organization",
        "name": "Relational Sovereignty Commons",
        "url": "https://relationalsovereignty.com"
      }
    }
  ]
}
</script>
```

---

### Task #4 (Priority 4): Embed RAG-Optimized Question & Answer (Q&A) Blocks

* **Goal:** Pair expressive headers with clear, semantic H2 query tags followed immediately by 40–60 word declarative answer blocks.
* **Why:** AI answer engines look for concise target definitions immediately beneath semantic header tags.
* **Developer Implementation:** Embed structured Q&A components on `/learn` and the homepage.

#### Markup Pattern:
```html
<section class="qa-block" id="definition">
  <h2>What is Relational Sovereignty?</h2>
  <div class="direct-answer">
    <p>
      <strong>Relational sovereignty</strong> is an ethical and operational framework that defines autonomy not as isolation, but as self-determination within interdependent relationships. It establishes boundaries where care exists without control, ensuring that individuals retain agency, consent, and the capacity to say no without risking relationship collapse.
    </p>
  </div>
</section>
```

---

### Task #5 (Priority 5): Embed Author Credentials & E-E-A-T Identity Nodes

* **Goal:** Establish clear authorship and institutional/academic context on `/behind-the-scenes` or `/about`.
* **Why:** Google Search Quality Evaluator Guidelines (E-E-A-T) and AI citation systems heavily penalize completely anonymous sites in ethics, philosophy, and policy niches.
* **Developer Implementation:** Add a dedicated author/collective component with JSON-LD `Person` or `Organization` credentials and `sameAs` links pointing to Google Scholar, ORCID, or institutional pages.

#### Person Schema Snippet:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Author / Creator Name",
  "jobTitle": "Adjunct Professor / AI Ethics Researcher",
  "affiliation": {
    "@type": "EducationalOrganization",
    "name": "Smith School of Business, Queen's University"
  },
  "sameAs": [
    "https://scholar.google.com/citations?user=EXAMPLE",
    "https://orcid.org/0000-0000-0000-0000"
  ]
}
</script>
```

---

### Task #6 (Priority 6): Structure the 13 Principles into Modular Cards

* **Goal:** Refactor the continuous text on `Learn.dc.html` into 13 programmatic content components with distinct HTML IDs, headings, and micro-summaries.
* **Why:** Enables precise deep-linking (`/learn#principle-01`) and direct snippet extraction by search crawlers.

#### Card Component Structure:
```html
<article id="principle-01" class="principle-card">
  <header>
    <span class="principle-number">Principle 01</span>
    <h2>Self-Determination Within Interdependence</h2>
  </header>
  <div class="summary-box">
    <p><strong>Core Concept:</strong> Leaning on someone is not failure; agency requires the unconditional capacity to say no.</p>
    <p><strong>Key Question:</strong> <em>"Can either of us say no and still be alright?"</em></p>
  </div>
  <div class="principle-body">
    <p>Detailed textual explanation follows here...</p>
  </div>
</article>
```

---

### Task #7 (Priority 7): Implement Clean Extensionless URL Routing & Canonical Alignment

* **Goal:** Replace `.dc.html` extensions with clean canonical paths (`/manifesto`, `/learn`, `/practise`, `/archive`, `/resources`, `/invitation`, `/behind-the-scenes`) and issue 301 redirects for legacy URLs.
* **Developer Implementation:**
  * Set up server routing rules (e.g., Cloudflare Workers, Nginx, or Netlify redirects).
  * Ensure `<link rel="canonical" href="..." />` matches the exact clean URL on every page.

#### Nginx / Server Redirect Rules Example:
```nginx
# Redirect legacy .dc.html routes to clean extensionless endpoints
location ~ ^/(.*)\.dc\.html$ {
    return 301 /$1;
}
```

#### Canonical Tag Verification Table:

| Page | Old Route | Clean Canonical Target |
| :--- | :--- | :--- |
| Home | `Home.dc.html` | `https://relationalsovereignty.com/` |
| Manifesto | `Manifesto.dc.html` | `https://relationalsovereignty.com/manifesto` |
| Learn | `Learn.dc.html` | `https://relationalsovereignty.com/learn` |
| Practise | `Practise.dc.html` | `https://relationalsovereignty.com/practise` |
| Archive | `Archive.dc.html` | `https://relationalsovereignty.com/archive` |
| Contribute | `Contribute.dc.html` | `https://relationalsovereignty.com/contribute` |
| Resources | `Resources.dc.html` | `https://relationalsovereignty.com/resources` |
| Behind the Scenes | `BehindTheScenes.dc.html` | `https://relationalsovereignty.com/behind-the-scenes` |

---

### Task #8 (Priority 8): Embed Standardized Academic Citation Markup

* **Goal:** Provide a copyable BibTeX, APA, and MLA citation widget on `/manifesto` and `/learn`.
* **Why:** Encourages academic, policy, and research backlinking while teaching AI citation bots how to format references to this site.

#### HTML Component:
```html
<section class="citation-widget">
  <h3>Cite This Work</h3>
  <p>To reference the Relational Sovereignty framework in academic or policy research:</p>
  <div class="citation-box">
    <pre><code>@misc{relational_sovereignty_2026,
  title        = {The Relational Sovereignty Manifesto: Sixteen Theses and a Refusal},
  author       = {{Relational Sovereignty Commons}},
  year         = {2026},
  url          = {https://relationalsovereignty.com/manifesto},
  note         = {Accessed: 2026-08-08}
}</code></pre>
  </div>
</section>
```

---

### Task #9 (Priority 9): Add Internal Annotation & Deep Anchor Links in Archive

* **Goal:** Transform `/archive` from an external outbound link list into an annotated bibliography that links internally to specific principles on `/learn#principle-X`.
* **Why:** Retains crawler link equity, improves internal page authority distribution, and establishes contextual relevance between third-party texts and your core framework.

#### Archive Item Component Pattern:
```html
<article class="archive-item">
  <h3>Text Title by Author</h3>
  <p class="source-attribution">Attributed to [Author/Nation]</p>
  <p class="archive-commentary">
    <em>Framework Rationale:</em> This text grounds our understanding of non-coercive care, directly informing <a href="/learn#principle-03">Principle 3: Boundaries Without Exclusion</a>.
  </p>
  <a href="https://external-source-link.com" target="_blank" rel="noopener">Read External Text &rarr;</a>
</article>
```

---

### Task #10 (Priority 10): Build a Semantic Framework Comparison Table

* **Goal:** Create a comparative HTML matrix contrasting Relational Sovereignty against *Relational Autonomy*, *Individual Sovereignty*, and *Data Sovereignty*.
* **Why:** High-intent comparison queries (*"Relational sovereignty vs relational autonomy"*) trigger structured comparison tables in ChatGPT and Perplexity search answers.

#### Semantic HTML Table Markup:
```html
<section class="comparison-section">
  <h2>Framework Comparisons</h2>
  <table class="comparison-table">
    <thead>
      <tr>
        <th scope="col">Framework</th>
        <th scope="col">Primary Focus</th>
        <th scope="col">Key Distinction from Relational Sovereignty</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Individual Sovereignty</th>
        <td>Individual self-ownership & independence</td>
        <td>Overlooks inherent systemic interdependence and collective care obligations.</td>
      </tr>
      <tr>
        <th scope="row">Relational Autonomy</th>
        <td>Feminist agency in social context</td>
        <td>Focuses on individual decision-making rather than non-colonial system architecture.</td>
      </tr>
      <tr>
        <th scope="row">Relational Sovereignty</th>
        <td>Interdependent self-determination without domination</td>
        <td>Integrates explicit consent domains, care dynamics, and non-coercion across human & tech systems.</td>
      </tr>
    </tbody>
  </table>
</section>
```

---

## 3. 30-Day Developer Implementation Roadmap

```
  WEEK 1: CRITICAL FIXES           WEEK 2: CONTENT & STRUCTURE
  +-----------------------+        +-----------------------+
  | * SSG Pre-rendering   |  --->  | * Re-architect /learn |
  | * Unblock robots.txt  |        | * Add Q&A Blocks      |
  | * Clean URL routes    |        | * Build E-E-A-T Bio   |
  +-----------------------+        +-----------------------+
                                               |
                                               v
  WEEK 4: EXPANSION & MEASURE      WEEK 3: SCHEMA & AUTHORITY
  +-----------------------+        +-----------------------+
  | * Submit Sitemaps     |  <---  | * Add JSON-LD Schema  |
  | * Comparison Guide    |        | * "How to Cite" Block |
  | * Academic Outreach   |        | * Annotate Archive    |
  +-----------------------+        +-----------------------+
```

### Week 1 — Core Build & Crawl Infrastructure
- [ ] Configure SSG pre-rendering pipeline for all routes.
- [ ] Deploy production `robots.txt` at domain root.
- [ ] Configure server redirects from `.dc.html` to clean URLs.
- [ ] Deploy `sitemap.xml` listing all canonical routes.
- [ ] Ensure `<title>`, `<meta name="description">`, and canonical links exist on every route.

### Week 2 — Semantic Content & E-E-A-T Markup
- [ ] Refactor `/learn` to include explicit H2 Q&A blocks (`"What is Relational Sovereignty?"`).
- [ ] Implement 13 Principle Cards with individual `id="principle-XX"` attributes.
- [ ] Create an Author/Collective credential section on `/behind-the-scenes` or `/about`.

### Week 3 — Schema Graphs & Interlinking
- [ ] Inject JSON-LD `DefinedTerm`, `Article`, and `WebSite` graph scripts into template `<head>`.
- [ ] Add the BibTeX/APA citation block on `/manifesto`.
- [ ] Update `/archive` entries with internal links pointing to `/learn#principle-XX`.

### Week 4 — Verification, Indexation & Monitoring
- [ ] Register domain and submit `sitemap.xml` in **Google Search Console** and **Bing Webmaster Tools**.
- [ ] Perform URL Inspection on `/`, `/manifesto`, and `/learn` to request indexing.
- [ ] Verify raw HTML render using `curl -A "Googlebot" https://relationalsovereignty.com/learn`.
- [ ] Test prompt retrieval in Perplexity and ChatGPT (`"What is Relational Sovereignty?"`).

---

## 4. Keyword & Topic Target Mapping Matrix

| Target Query / Search Phrase | Search Intent | Target Path | Dev Implementation Element | Priority |
| :--- | :--- | :--- | :--- | :--- |
| `What is relational sovereignty` | Informational / High-Intent | `/learn` | H2 Q&A block + 50-word answer div | **P1** |
| `Relational sovereignty definition` | Informational / Definition | `/learn` | `DefinedTerm` JSON-LD Schema | **P1** |
| `Relational sovereignty framework` | Informational / Structural | `/` & `/learn` | Page Hero + `WebSite` Schema | **P1** |
| `Consent Domains Map` | Branded / Tool | `/practise` | Interactive tool page + Schema | **P1** |
| `Relational Sovereignty Manifesto` | Branded / Document | `/manifesto` | `Article` Schema + BibTeX block | **P1** |
| `Relational autonomy vs relational sovereignty` | Comparative / Academic | `/learn` | Semantic `<table>` comparison | **P2** |
| `13 principles of relational sovereignty` | Framework / Educational | `/learn` | 13 Card components with IDs | **P2** |
| `Where does care end and control begin` | Conceptual / Query | `/` | Hero section H2 Q&A block | **P2** |
| `How to evaluate power dynamics in relationships` | Practical / Tool | `/practise` | Interactive tool introduction | **P2** |
| `Relational sovereignty in digital governance` | Specialized / Policy | `/behind-the-scenes` | Contextual narrative section | **P3** |

---

## 5. Priority 0: Top 3 High-Leverage Tasks

If development time is severely limited, completing these three items resolves **80% of current discoverability blockages**:

1. **Ship Static Site Pre-Rendering (SSG) & Production `robots.txt` (Tasks #1 & #2)**  
   * *Outcome:* Replaces empty `<div id="root"></div>` initial payloads with real text. Unblocks AI crawlers (`GPTBot`, `PerplexityBot`, `ClaudeBot`).
2. **Inject JSON-LD `DefinedTerm` & `Article` Schema (Task #3)**  
   * *Outcome:* Establishes machine-readable authority over the term "Relational Sovereignty" in search engine Knowledge Graphs and AI RAG pipelines.
3. **Embed RAG Q&A Block & Modularize 13 Principles on `/learn` (Tasks #4 & #6)**  
   * *Outcome:* Formats core definitions into concise, easily extractable 40–60 word text blocks that AI answer engines can directly clip and cite.
