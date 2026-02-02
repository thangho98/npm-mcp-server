---
name: nginx-proxy-manager
description: Manage Nginx Proxy Manager - list, create, update, delete proxy hosts, streams, certificates, and more
homepage: https://github.com/thangho98/npm-mcp-server
user-invocable: true
metadata: {"openclaw": {"requires": {"bins": ["node"], "env": ["NPM_URL", "NPM_EMAIL", "NPM_PASSWORD"]}}}
---

# Nginx Proxy Manager Skill

You can manage Nginx Proxy Manager (NPM) through CLI commands. This skill provides tools to interact with NPM's REST API.

## Setup

Set these environment variables:
- `NPM_URL` - NPM URL (e.g., `http://localhost:81`)
- `NPM_EMAIL` - Admin email
- `NPM_PASSWORD` - Admin password
- `NPM_READONLY` - Optional, set to `true` for read-only mode

## CLI Tool Location

The CLI tool is located at: `{baseDir}/../../dist/cli.js`

## Available Commands

### Proxy Hosts

```bash
# List all proxy hosts
node {baseDir}/../../dist/cli.js proxy-hosts list

# Get a specific proxy host
node {baseDir}/../../dist/cli.js proxy-hosts get <id>

# Create a proxy host
node {baseDir}/../../dist/cli.js proxy-hosts create --domains "app.example.com" --forward-host "192.168.1.100" --forward-port 8080

# Delete a proxy host
node {baseDir}/../../dist/cli.js proxy-hosts delete <id>

# Enable/Disable a proxy host
node {baseDir}/../../dist/cli.js proxy-hosts enable <id>
node {baseDir}/../../dist/cli.js proxy-hosts disable <id>
```

### Streams (TCP/UDP)

```bash
# List all streams
node {baseDir}/../../dist/cli.js streams list

# Create a stream
node {baseDir}/../../dist/cli.js streams create --incoming-port 3306 --forward-host "mysql-server" --forward-port 3306

# Delete a stream
node {baseDir}/../../dist/cli.js streams delete <id>
```

### Certificates

```bash
# List all certificates
node {baseDir}/../../dist/cli.js certificates list

# Renew a certificate
node {baseDir}/../../dist/cli.js certificates renew <id>

# Delete a certificate
node {baseDir}/../../dist/cli.js certificates delete <id>
```

### Redirection Hosts

```bash
# List all redirection hosts
node {baseDir}/../../dist/cli.js redirections list

# Create a redirection
node {baseDir}/../../dist/cli.js redirections create --domains "old.example.com" --forward-domain "new.example.com" --http-code 301
```

### Access Lists

```bash
# List all access lists
node {baseDir}/../../dist/cli.js access-lists list

# Create an access list
node {baseDir}/../../dist/cli.js access-lists create --name "My Access List"
```

### 404 Hosts

```bash
# List all 404 hosts
node {baseDir}/../../dist/cli.js dead-hosts list

# Create a 404 host
node {baseDir}/../../dist/cli.js dead-hosts create --domains "blocked.example.com"
```

### Status

```bash
# Get NPM status
node {baseDir}/../../dist/cli.js status
```

## Usage Examples

When user asks to manage proxy hosts, use the appropriate CLI command:

1. "List all my proxy hosts" → Run `proxy-hosts list`
2. "Create proxy for api.mysite.com pointing to 10.0.0.5:3000" → Run `proxy-hosts create`
3. "Delete proxy host 15" → Run `proxy-hosts delete 15`
4. "Show me all SSL certificates" → Run `certificates list`

## Readonly Mode

If `NPM_READONLY=true`, write operations (create, update, delete, enable, disable) will be blocked.
