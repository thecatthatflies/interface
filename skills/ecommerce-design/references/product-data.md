# Product data for search engines and shopping agents

Read this when writing structured data or exposing the store to AI shopping tools. The rule above all others: **structured data and the visible page come from the same source and say the same thing.** An agent that quotes a price the checkout will not honour is worse than one that quotes nothing.

## Contents

1. What to mark up
2. A complete example
3. Variants
4. Shipping and returns
5. Common errors
6. Agent commerce protocols
7. Checks

## 1. What to mark up

Per Google's merchant listing documentation [S]:

| Node | Required | Recommended |
|---|---|---|
| `Product` | `name`, `image`, `offers` (a single `Offer`, not `AggregateOffer`, when you are the seller) | `description`, `brand`, `sku`, `mpn`, a GTIN (`gtin8`/`gtin12`/`gtin13`/`gtin14`, most specific), `color`, `size`, `material`, `aggregateRating`, `review` |
| `Offer` | `price` above zero (number, dot decimal, no symbol) and `priceCurrency` (ISO 4217, three letters) | `availability`, `itemCondition`, `url`, `priceValidUntil`, `shippingDetails`, `hasMerchantReturnPolicy` |

`availability` takes one schema.org value: `InStock`, `OutOfStock`, `SoldOut`, `BackOrder`, `PreOrder`, `PreSale`, `LimitedAvailability`, `InStoreOnly`, `OnlineOnly`, `Discontinued`.

Put the markup in the server-rendered HTML [S]. Google notes that JavaScript-generated markup makes shopping crawls less frequent and less reliable, which matters most for prices and stock that change.

## 2. A complete example

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://example.com/#org",
      "name": "Northwind Tea",
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "GB",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 30,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn"
      }
    },
    {
      "@type": "Product",
      "name": "Sencha green tea, 100 g",
      "image": ["https://example.com/img/sencha-100.jpg"],
      "sku": "SEN-100",
      "gtin13": "5012345678900",
      "brand": { "@type": "Brand", "name": "Northwind Tea" },
      "offers": {
        "@type": "Offer",
        "url": "https://example.com/tea/sencha?size=100g",
        "price": 8.50,
        "priceCurrency": "GBP",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition",
        "seller": { "@id": "https://example.com/#org" },
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": { "@type": "MonetaryAmount", "value": 2.95, "currency": "GBP" },
          "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "GB" },
          "deliveryTime": {
            "@type": "ShippingDeliveryTime",
            "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 1, "unitCode": "DAY" },
            "transitTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 3, "unitCode": "DAY" }
          }
        }
      }
    }
  ]
}
</script>
```

The page must show "£8.50", "In stock", the shipping cost and the 30-day returns rule in text.

## 3. Variants

Use `ProductGroup` with `productGroupID`, `variesBy` (for example `https://schema.org/size`) and `hasVariant`, each variant a `Product` with its own `sku`, attributes and `Offer` [S] (schema.org; Google product variant documentation). Each variant URL should open that variant selected. Out-of-stock variants keep their node with `OutOfStock` rather than disappearing.

## 4. Shipping and returns

- `shippingDetails` requires `shippingRate` (currency matching the offer; `0` for free), `shippingDestination` (country, optionally region or postcode) and `deliveryTime` (handling and transit in whole days) [S].
- Define the store-wide return policy once on the `Organization`; override on an offer only where it differs [S]. Required: `applicableCountry`, `returnPolicyCategory`; `merchantReturnDays` for a finite window.
- These are the facts shoppers most often abandon over (cost, delivery, returns), so agents asking "what will this cost delivered to Leeds by Friday?" need them.

## 5. Common errors

| Error | Effect |
|---|---|
| Price in markup differs from page (sale not propagated, VAT included in one and not the other) | Agents and listings quote a wrong price; may count as misleading |
| `"price": "£8.50"` or `"1,240.00"` | Invalid; consumers ignore or misread it |
| `availability` always `InStock` | Agents send shoppers to sold-out pages |
| `aggregateRating` with zero reviews or ratings not shown on the page | Against Google's guidelines; misleading |
| `AggregateOffer` on a single-seller store | Not eligible for merchant listings |
| Markup injected client-side after a delay | Often not seen at all |
| Placeholder or demo values shipped (`"price": 0`, `"Lorem"`) | Indexed as real |

## 6. Agent commerce protocols

Status as of November 2026 [S, emerging]:

- **Agentic Commerce Protocol (ACP)**, introduced by OpenAI and Stripe in September 2025; the basis of checkout inside ChatGPT. Merchants supply a product feed and checkout endpoints.
- **Universal Commerce Protocol (UCP)**, announced by Google with retail and payment partners in January 2026 (ucp.dev); REST and JSON-RPC transports with MCP and A2A support; used for checkout in Google's AI surfaces.

Both are young and moving. Add them only when asked, generate their feeds from the same source as the page and the JSON-LD, and keep payment authorization with the person. They do not replace a store whose HTML is readable: many agents still use the page.

## 7. Checks

```bash
node <this-skill>/scripts/check-product-data.mjs https://shop.example/products/sencha
node <this-skill>/scripts/check-product-data.mjs saved-rendered-page.html --json
```

The script reads JSON-LD from the HTML as served (no JavaScript), checks the required and recommended fields above, and checks that the structured price, name, availability and rating appear in the visible text. It is a floor: also run Google's Rich Results Test and the Schema Markup Validator (validator.schema.org), and spot-check a sale price and a sold-out variant.
