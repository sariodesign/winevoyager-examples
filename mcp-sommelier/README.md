# MCP sommelier

Give your AI assistant verified answers about Italian wine law. The [WineVoyager MCP server](https://github.com/sariodesign/winevoyager-mcp) lets Claude, Cursor, VS Code and other MCP clients look up DOCG and DOC denominations, their grapes and percentages, and the official source of each record, instead of answering from memory.

## 1. Add the server to your assistant

No signup, no key: it works at the **Basic** level. Requires Node.js 20+.

**Claude Code**

```bash
claude mcp add winevoyager -- npx -y winevoyager-mcp
```

**Claude Desktop**: in `claude_desktop_config.json` (Settings → Developer → Edit Config). **Cursor**: in `~/.cursor/mcp.json`.

```json
{
  "mcpServers": {
    "winevoyager": {
      "command": "npx",
      "args": ["-y", "winevoyager-mcp"]
    }
  }
}
```

**VS Code**: in `.vscode/mcp.json`.

```json
{
  "servers": {
    "winevoyager": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "winevoyager-mcp"]
    }
  }
}
```

Restart the client after editing its config.

## 2. Questions to try

These work fully at the Basic level, because they involve the 8 showcase denominations (Barolo, Barbaresco, Brunello di Montalcino, Chianti Classico, Amarone della Valpolicella, Taurasi, Franciacorta, Conegliano Valdobbiadene Prosecco):

- *Which grapes go into Franciacorta Satèn, and with what limits? Cite the source.*
- *Where must Sangiovese be at least 80%?*
- *Which DOCG are made in the province of Cuneo?*
- *Compare the grape rules for Barolo and Barbaresco.*

For any other denomination, the server returns the basic data and tells the assistant that grapes and wine types need a key, **and not to guess them**. A good assistant will say so and point you to the official register.

## 3. See what the assistant receives

`client.mjs` is a minimal MCP client (no SDK, about 80 lines). It starts the server, lists its tools and calls two of them, printing what an assistant would get:

```bash
node client.mjs
```

```
Tools: search_denominations, list_regions, get_denomination, find_denominations_by_grape

Franciacorta: Chardonnay or Pinot nero, Pinot bianco ≤ 50%, Erbamat ≤ 10%
Franciacorta Satèn: Chardonnay ≥ 50%, Pinot bianco ≤ 50%
Franciacorta Rosé: Pinot nero ≥ 35%, Chardonnay ≤ 65%, Pinot bianco ≤ 50%, Erbamat ≤ 10%
Source: https://ec.europa.eu/agriculture/eambrosia/geographical-indications-register/details/EUGI00000003568 (DM 07.05.2024)

Sangiovese ≥ 80%: Brunello di Montalcino, Chianti Classico
Note: Only 8 of 411 denominations in scope have grape data at the basic level (the showcase ones), so this list is INCOMPLETE. Say so to the user. ...
```

## Full key

A Full key unlocks grapes and wine types for all 411 denominations (free for 60 days during Early Access: support@winevoyager.tours). Put it in your environment or in the client's `env` block, never in a shared config or in git:

```bash
claude mcp add winevoyager -e WINEVOYAGER_API_KEY=your-own-key -- npx -y winevoyager-mcp
```

## Licence

Code: MIT. Data: basic data is CC-BY 4.0 ("Data by WineVoyager"); full records are under a commercial licence. Runtime use in assistants is allowed; bulk copies, permanent indexes and training AI/ML models are not. See the [terms](https://www.winevoyager.tours/developers#terms).
