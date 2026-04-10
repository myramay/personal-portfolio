# STYLED — Personal Fashion Intelligence

An AI-powered personal fashion stylist that analyzes current trends from Vogue and Who What Wear to generate a curated, budget-aware shopping list tailored to your aesthetic.

![STYLED App](https://img.shields.io/badge/Powered%20by-Claude%20Opus%204.6-B5924A?style=flat-square)
![HTML/CSS/JS](https://img.shields.io/badge/Stack-HTML%20%2F%20CSS%20%2F%20JS-0A0A0A?style=flat-square)

## Features

- **Trend-aware recommendations** — Claude draws on editorial coverage from Vogue, Who What Wear, and Harper's Bazaar to anchor every pick to a real seasonal trend
- **Personalized to you** — input your budget, preferred stores, and aesthetic vibe (Clean Girl, Quiet Luxury, Dark Academia, Y2K, and 12 more presets — or write your own)
- **Direct store search links** — each piece generates clickable search links for your selected retailers across three tiers: Accessible, Mid-Range, and Premium
- **9-piece capsule wardrobe** — pieces are chosen to be cohesive and mix-and-match across multiple categories (tops, bottoms, outerwear, shoes, bags, accessories, and more)
- **Editorial magazine layout** — clean, black-and-gold editorial aesthetic with Playfair Display typography and animated card reveals

## Stores Supported

| Tier | Stores |
|------|--------|
| Accessible | Target, H&M, Zara, ASOS, Mango, Urban Outfitters |
| Mid-Range | Nordstrom, Anthropologie, Free People, Madewell, J.Crew, Banana Republic, Revolve, Everlane |
| Premium | Net-a-Porter, Shopbop, Saks Fifth Avenue, Bloomingdale's, Neiman Marcus |

## Getting Started

This is a single-file app — no build step, no dependencies, no server required.

**1. Clone the repo**
```bash
git clone https://github.com/YOUR-USERNAME/personal-stylist.git
cd personal-stylist
```

**2. Open in browser**
```bash
open index.html
```
Or just double-click `index.html`.

**3. Get an Anthropic API key**
Sign up at [console.anthropic.com](https://console.anthropic.com) and create an API key.

**4. Use the app**
- Paste your API key into the field at the top
- Select your budget, stores, and aesthetic
- Click **Generate My Edit**

## Tech Stack

- **Frontend** — Vanilla HTML, CSS, and JavaScript (no frameworks)
- **AI** — [Anthropic Claude Opus 4.6](https://anthropic.com) with adaptive thinking enabled
- **Fonts** — Playfair Display + Inter via Google Fonts
- **API** — Called directly from the browser using the Anthropic Messages API

## Notes

- Your API key is used only in your browser session and is never stored or transmitted to any server other than Anthropic's.
- Each generation costs a small amount of API credits (Claude Opus 4.6 pricing applies).
- Store search links open retailer search results — they are not affiliate links.
