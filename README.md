# MALAPOP - Szechuan Peppercorn Popcorn

NYC-based Szechuan peppercorn popcorn brand. This is the marketing site with Shopify merch integration.

## Local Development

Just open `index.html` in your browser, or serve it:

```bash
npx serve .
```

## Shopify Integration

The merch section uses placeholder products. To connect your Shopify store:

### Option 1: Buy Button (Easiest)

1. In Shopify Admin, go to **Sales Channels > Buy Button**
2. Select a product and click **Create Buy Button**
3. Customize the styling to match (red/gold palette)
4. Copy the embed code
5. Replace the placeholder `merch-card` elements in `index.html`

### Option 2: Storefront API (More Control)

1. In Shopify Admin, go to **Apps > Develop apps**
2. Create a new app with **Storefront API** access
3. Copy your Storefront access token
4. Uncomment the Shopify script block at the bottom of `index.html`
5. Replace `YOUR-STORE.myshopify.com` and `YOUR-TOKEN-HERE`
6. Add your product IDs

## Deploy (Railway)

This is a static site. Railway serves it via Nixpacks which auto-detects the static site and serves it.

The `nixpacks.toml` config handles the setup.

## Brand Colors

- Deep Red: `#8B1A1A`
- Red: `#C62828`
- Gold/Orange: `#E8960C`
- Gold Light: `#F5CB5C`
- Cream: `#FFF8E7`
- Dark BG: `#1A0A0A`
