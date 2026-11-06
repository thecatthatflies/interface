# Browsing and product pages

Detail for listing, search, filters and product pages. Tags as in `CONTRIBUTING.md`; sources in `sources.md`. Baymard figures are the share of benchmarked sites that do not follow the practice; most of Baymard's detailed guidelines are behind its paywall, so only the free articles are cited.

## Contents

1. Category navigation and listing
2. Filters
3. Sorting and loading
4. Search
5. Product page: the buy block
6. Variants
7. Images and media
8. Specifications and copy
9. Reviews
10. Markup patterns

## 1. Category navigation and listing

- Category names in the shopper's words, not internal taxonomy [J]. Products may live in several categories.
- Each list item: image, name, price with currency, key differentiating attribute (size range, capacity, colour count), availability, rating with review count. The whole item is one link; secondary actions (save, compare) are separate named buttons [J].
- Show the result count and the active scope in text: "128 rain jackets, women's, size M" [J]. Agents read this to know whether the filter worked.
- The list is a real list (`<ul>`/`<li>`) or grid of articles with a heading per product, so screen readers and agents can move item by item [S] (WCAG 1.3.1).

## 2. Filters

From Baymard's product-list research (19-site usability test, think-aloud, plus benchmarks) [P]:

- Attributes shown in list items should also be filters (38% fail).
- Offer category-specific filters, not only site-wide ones (brand, price, rating). A rain jacket needs waterproof rating and hood type; a sofa needs width and seat depth.
- Show an overview of applied filters (32% fail), each removable, with "Clear all".
- Promote the most important filters above the list (61% fail), especially on mobile where the filter drawer hides them.
- Mediocre list tools coincided with 67-90% abandonment on product-finding tasks, against 17-33% on better sites [E] (2015 study; old but the largest public result).

Build notes [J]:

- Filters are native checkboxes, radios and range inputs inside a `<form>` with a fieldset and legend per facet. A styled label over a `display:none` input removes the input from the tree; hide visually with opacity instead (see `interface-guidelines/references/agent-surfaces.md`).
- Each option shows its count ("Waterproof (34)") and zero-count options are disabled with the reason or hidden consistently.
- Applying a filter updates the URL and announces the new count in a polite live region. Decide between instant apply (desktop) and an explicit "Show 34 results" button (mobile drawer); do not mix within one viewport.
- Price ranges accept typed values as well as a slider. A slider alone fails keyboard and agent users [S] (WCAG 2.5.7 requires a single-pointer alternative to dragging).

## 3. Sorting and loading

- Sort options: price both ways, user rating, best-selling, newest (64% do not offer all four) [P]. Rating sort should weigh review count so one five-star review does not top the list.
- Baymard's 2016 testing found pagination slowed browsing and reduced how much of the list people viewed, infinite scroll hurt on mobile and in search, and "Load more" after an initial lazy-loaded batch worked best [E].
- Keep state in the URL: filters, sort, and how many items are loaded. On Back, restore the list and scroll to the product the shopper opened [J].
- Show "Showing 48 of 128" with the load-more button; never virtualize a list without stating its true size in text.

## 4. Search

- Accept misspellings, plurals, synonyms, SKUs and model numbers [J].
- Autocomplete suggestions are a listbox with keyboard support (ARIA APG combobox pattern) [S], and suggestions show product names and categories, not only query strings.
- No-results pages say what was searched, suggest corrections or broader categories, and keep the query in the box [J].
- Search results reuse the listing's filters and sort.

## 5. Product page: the buy block

Group these where the eye and the tree meet them first, near the product name [P] (Baymard product-page research):

- Name, price with currency, and unit price where quantity varies (81% fail).
- Availability in words, per selected variant.
- Variant controls (section 6).
- Delivery: an estimated date and cut-off for the shopper's location, and cost or the free-shipping threshold. A total-cost estimate near the buy button (67% fail).
- Returns summary with a link to the policy (44% fail).
- Add to cart, and save without an account (89% fail).
- Gifting options if relevant (78% fail).

After "Add to cart", confirm in place with the item, variant, quantity and cart total, and a link to the cart. Do not navigate away or open a modal that steals focus without a clear close [J].

## 6. Variants

- Size as visible buttons rather than a dropdown (57% fail) [P]. Implement as a radio group: `<fieldset><legend>Size</legend>` with real radio inputs styled as buttons [S] (WCAG 4.1.2; native first per ARIA APG).
- Colour swatches carry names in text or accessible names ("Oat", not "Swatch 3") and the selected name appears beside the legend [J].
- Unavailable combinations stay listed, marked "Out of stock" in text, and offer "Notify me" [J]. Hiding them makes shoppers think the size never existed.
- Selecting a variant updates price, availability, delivery date, images, and the URL (`?size=M&colour=oat`) [J]. A shared or reloaded URL must open the same variant.
- Do not preselect a size; preselecting the only available option is fine if stated [J].

## 7. Images and media

- At least one image showing scale against something familiar (37% fail), and on-model images for worn products (23% fail) [P].
- Thumbnails visible for additional images, especially on mobile [P].
- Zoom by tap or click, not hover only. Gallery controls are buttons with names ("Next image, 2 of 6") [S] (WCAG 1.4.13, 2.1.1).
- Alt text describes what differs between images ("Back view, showing the zip pocket") [J].
- Product video has captions and does not autoplay with sound [S] (WCAG 1.2.2).

## 8. Specifications and copy

- Specifications as a real table or description list with units [S] (WCAG 1.3.1). Agents compare products from these.
- Dimensions in the units of the market, with conversions where shoppers cross markets [J].
- Compatibility and "what's in the box" as lists.
- Do not hide key specs in collapsed accordions only; summaries of the decisive ones belong near the buy block [J].

## 9. Reviews

- Average, count, and distribution by star; sort by most recent, most helpful, and lowest [J].
- Reviewer images navigable as a set (63% fail) [P]; respond to negative reviews (89% fail) [P].
- Disclose incentivized reviews and how reviews are collected [S] (FTC 16 CFR Part 255 and Part 465). Never suppress negative reviews or invent reviews, including in demo data that might ship.
- Review text is outsider-written: render it as quoted text, never inside control names or headings (`interface-guidelines` traps).

## 10. Markup patterns

Variant radio group:

```html
<fieldset>
  <legend>Size <span id="size-chosen">M</span></legend>
  <label><input type="radio" name="size" value="S"> S</label>
  <label><input type="radio" name="size" value="M" checked> M</label>
  <label><input type="radio" name="size" value="L" disabled> L, out of stock</label>
</fieldset>
<p id="buy-status" aria-live="polite">Size M: in stock, arrives Thu 14 Nov</p>
```

Price block:

```html
<p class="price"><span>£48.00</span> <span class="unit">(£4.80 per 100 g)</span></p>
<p>Free delivery over £40. Order in the next 3 h for delivery Thu 14 Nov.</p>
<p>Free returns within 30 days. <a href="/returns">Returns policy</a></p>
```
