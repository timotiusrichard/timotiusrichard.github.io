## Portfolio Tracker

A self-contained mobile-first portfolio tracker built as a single HTML file. No server, no account, no API key required. All data stays on your device.

## Features

### Portfolio tracking

- **Multi-currency** — IDR, USD, TWD, USDT assets in one view
- **Live FX rates** — auto-fetched from ExchangeRate-API (fiat) and CoinGecko (USDT), every hour
- **FX displayed as you think**: USD→NTD, NTD→IDR (559), USD→IDR (17.700)
- **Net worth** = bank balances converted to NTD (authoritative)
- **Investments** = mark-to-market positions (informational)
- **Net worth trend sparkline** — tracks history over up to 180 days
- **Allocation donut** with total value in center

### Holdings

- Filter by asset class (IDX, US, TW, Crypto, Mutual, Banks)
- Sort by value, P&L %, or name
- Search by ticker, name, or platform
- Section headers show category total + % of portfolio
- Each row shows % of total portfolio and native currency detail
- Tap any row → detail sheet with full P&L breakdown

### Screenshot Scanner (on-device OCR — no AI API)

Uses **Tesseract.js v5** running as WASM in the browser. Zero network calls for OCR.

**Supports these screenshot layouts:**

|App                   |Layout                                      |
|----------------------|--------------------------------------------|
|Stockbit / Ajaib (IDX)|Multi-asset Rp value rows                   |
|Binance TW (NT$ view) |Spot Balance + Average Price NT$            |
|Binance TW (USDT view)|Total assets + Breakeven price USDT         |
|Gate.io TW            |Est. Total Value + Diluted Cost + Last Price|

**Scanner flow:**

1. Upload screenshot (or drag & drop)
1. Crop to just the holdings area for best accuracy
1. OCR runs on-device (4 steps: Load → Enhance → Recognise → Analyse)
1. Review: New / Update / Missing — each with NTD value, confidence badge, inline editing
1. **Preview & Import** → see exact portfolio impact before committing
1. Confirm → assets saved

**Scan history** — last scan is saved. Reopen the scanner and tap the banner to reload without re-scanning.

### Data management

- **JSON backup** — full snapshot of assets + FX rates + history
- **JSON restore** — replace everything from a backup file (migrates old format automatically)
- **CSV export** — spreadsheet of current holdings
- **Manual snapshot** — force a net worth history point

## Supported assets

### Stocks

- **Indonesia (IDX)** — BBCA, BMRI, BBNI, BBRI, PGEO, SMRA, CTRA, WBSA, WSKT, TLKM, ASII, GOTO, BREN, ADRO, UNVR, ANTM, ICBP, PTRO, BUMI, BRPT, PTBA, MDKA, INCO, and more
- **US Stocks** — GOOGL, AVGO, AMZN, NVDA, MSFT, META, QQQ, AAPL, TSLA, SPY
- **Taiwan (TWSE)** — 0050, 0056, 2330, 2317, 2412, 2454

### Crypto

BTC, ETH, BNB, SOL, XRP, ADA, DOGE, USDT, SUI, GT, AVAX, DOT, MATIC, LINK, TRX, LTC, UNI

### Other

- **Reksa Dana** (Indonesian mutual funds)
- **Banks (TWD)** — 郵局, CTBC, Sinopac, Megabank, Bitget, Binance TWD, Gate TWD
- **Banks (IDR)** — BCA, Ajaib/Stockbit

## FX conversion

|Pair      |Direction           |Source                    |
|----------|--------------------|--------------------------|
|USD → NTD |multiply by USD_TWD |ExchangeRate-API          |
|IDR → NTD |divide by NTD_IDR   |derived: USD_IDR / USD_TWD|
|USDT → NTD|multiply by USDT_TWD|CoinGecko                 |
|TWD       |passthrough         |—                         |

Fallback chain: ExchangeRate-API → currency-api (jsDelivr) → currency-api (Cloudflare Pages)

## Usage

1. Download `index.html`
1. Open in any modern browser (Safari, Chrome, Firefox)
1. Works offline after first load (FX rates update when online)
1. On iOS: **Share → Add to Home Screen** for a native app-like experience

## Data model

All data is stored in `localStorage` under these keys:

|Key       |Content                                                |
|----------|-------------------------------------------------------|
|`p:a`     |Array of assets                                        |
|`p:fx`    |FX rates object `{NTD_IDR, USD_TWD, USD_IDR, USDT_TWD}`|
|`p:hist`  |Net worth history array `{d, t, nw, inv}[]`            |
|`p:ts`    |Last save timestamp                                    |
|`p:scan`  |Last scanner result (for reload)                       |
|`p:schema`|Schema version (current: 4)                            |

**Net worth** is always computed from bank balance assets only (not investment positions), consistent with the Sheets tracker design.

## Tech stack

- **Zero dependencies** at runtime (Tesseract.js loaded on demand from CDN for scanner only)
- Vanilla JS ES2020+ (no framework, no build step)
- CSS custom properties for light/dark mode
- PWA-ready: generated icon + Web App Manifest (installable)
- `id-ID` locale throughout for Indonesian dot-thousands number formatting