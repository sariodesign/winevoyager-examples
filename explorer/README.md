# Explorer

One HTML file, no build step, no dependencies: browse the 411 Italian DOCG and DOC wine denominations, filter them by region, province, colour and class, search by name, and open a record to see its wine types, grapes and official source.

## Run it

Open `index.html` through any static server:

```bash
npx serve .
```

or

```bash
python3 -m http.server
```

Then open `/explorer/`. No key, no signup: it uses the **Basic** level of the API.

## How it works

| Step | Endpoint | Why |
|---|---|---|
| Fill the region and province filters | `GET /v1/regions` | Regions with their provinces and denomination counts |
| Load the list once | `GET /v1/denominations` | The whole list comes back in one call (no paging), so filtering and search happen in the browser: no request per keystroke |
| Open a record | `GET /v1/denominations/{id}` | Full record with `types`, `grapes` and the `source` block |

A few details worth copying:

- **Grapes come in two shapes**: `{ "name", "min"?, "max"? }` or `{ "any_of": [...], "min"?, "max"? }`, where the limit applies to the group as a whole (see `grapeText()`).
- **`access_level`** tells you what you got. At the Basic level, `types` is present only for the 8 showcase denominations (Barolo, Barbaresco, Brunello di Montalcino, Chianti Classico, Amarone della Valpolicella, Taurasi, Franciacorta, Conegliano Valdobbiadene Prosecco).
- **Province filter**: a denomination whose area is a whole region has no provinces of its own and matches every province of that region, the same rule as the API's `?province=`.
- **Rate limit**: 30 requests per minute per IP at the Basic level; the page shows a readable message on `429`.
- **No `innerHTML`**: data is always inserted as text.

## Rules

- **Never put a `full` API key in this page.** Anyone can read a key in a web page. If you need full records, call the API from your own server.
- Don't save the API responses into the repo: fetch at runtime (temporary caching is fine).
- Keep the "Data by WineVoyager" attribution visible (CC-BY 4.0).
