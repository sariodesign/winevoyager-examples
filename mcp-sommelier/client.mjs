// A minimal MCP client, no SDK: start winevoyager-mcp over stdio and call its tools.
// It shows exactly what an AI assistant receives when it uses the server.
//
//   node client.mjs
//
// Requires Node.js 20+. Uses the Basic level (no key). To try the Full level,
// export WINEVOYAGER_API_KEY in your shell first; never write the key in this file.

import { spawn } from 'node:child_process';

const server = spawn('npx', ['-y', 'winevoyager-mcp'], { stdio: ['pipe', 'pipe', 'inherit'] });

// MCP over stdio is JSON-RPC 2.0, one message per line.
let buffer = '';
let nextId = 0;
const pending = new Map();

server.stdout.on('data', (chunk) => {
    buffer += chunk;
    let newline;
    while ((newline = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, newline);
        buffer = buffer.slice(newline + 1);
        if (!line.trim()) continue;
        const message = JSON.parse(line);
        pending.get(message.id)?.(message);
        pending.delete(message.id);
    }
});

function request(method, params) {
    const id = ++nextId;
    server.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
    return new Promise((resolve) => pending.set(id, resolve));
}

async function callTool(name, args) {
    const { result, error } = await request('tools/call', { name, arguments: args });
    if (error) throw new Error(error.message);
    // Each tool returns its data as JSON text.
    return JSON.parse(result.content[0].text);
}

// 1. Handshake
await request('initialize', {
    protocolVersion: '2025-06-18',
    capabilities: {},
    clientInfo: { name: 'winevoyager-example-client', version: '1.0.0' },
});
server.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');

// 2. What can the server do?
const { result: { tools } } = await request('tools/list', {});
console.log('Tools:', tools.map((t) => t.name).join(', '), '\n');

// 3. "Which grapes go into Franciacorta?"
const franciacorta = await callTool('get_denomination', { id: 'franciacorta' });
for (const type of franciacorta.types) {
    const grapes = type.grapes.map((g) => {
        const label = g.any_of ? g.any_of.join(' or ') : g.name;
        const range = [g.min != null && `≥ ${g.min}%`, g.max != null && `≤ ${g.max}%`].filter(Boolean).join(' ');
        return range ? `${label} ${range}` : label;
    });
    console.log(`${type.name}: ${grapes.join(', ')}`);
}
console.log('Source:', franciacorta.source.eambrosia_url, `(${franciacorta.source.text_updated_to})\n`);

// 4. "Where must Sangiovese be at least 80%?"
const sangiovese = await callTool('find_denominations_by_grape', { grape: 'Sangiovese', min_percentage: 80 });
console.log(`Sangiovese ≥ 80%: ${sangiovese.results.map((r) => r.name).join(', ')}`);
// At the Basic level the server says the list is incomplete and tells the assistant not to hide it.
for (const note of sangiovese.notes ?? []) console.log('Note:', note);

console.log('\n' + franciacorta.attribution);
server.kill();
