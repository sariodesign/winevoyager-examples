# WineVoyager examples

Small, runnable examples for the [WineVoyager API](https://api.winevoyager.tours/docs) and its [MCP server](https://github.com/sariodesign/winevoyager-mcp): structured data on all 411 Italian DOP wine denominations (79 DOCG, 332 DOC), read from the official MASAF *disciplinari*.

| Example | What it shows |
|---|---|
| [`explorer/`](explorer/) | A zero-dependency HTML + JS page: filter denominations by region, province and colour, search by name, open a record with its grapes and official source. |
| `mcp-sommelier/` *(coming next)* | Plug the MCP server into Claude or Cursor and ask wine-law questions answered from the records. |

All examples use the **Basic** level: no signup, no key. Basic gives every denomination's core data, and the full record (wine types, grapes with percentages, methods) for 8 showcase denominations.

## Rules for this repo (and for your fork)

- **Never commit an API key.** A `full` key belongs on a server or in your MCP client's `env`, never in a web page or in git. `.gitignore` already excludes `.env*`.
- **Don't commit copies of the data.** Fetch at runtime; temporary caching is fine, a saved dump or a permanent index is not.
- **Keep the attribution** "Data by WineVoyager" visible where the data is shown (CC-BY 4.0).

## Licence

Code: [MIT](LICENSE). Data: not in this repo; basic data is CC-BY 4.0, full records are under a commercial licence. See the [terms](https://www.winevoyager.tours/developers#terms).
