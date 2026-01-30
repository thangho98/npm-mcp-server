# Nginx Proxy Manager MCP Server

MCP (Model Context Protocol) server for managing Nginx Proxy Manager through AI assistants like Claude.

## Features

This server provides tools to manage:

### Proxy Hosts
- `list_proxy_hosts` - List all proxy hosts
- `get_proxy_host` - Get details of a specific proxy host
- `create_proxy_host` - Create a new proxy host
- `update_proxy_host` - Update an existing proxy host
- `delete_proxy_host` - Delete a proxy host
- `enable_proxy_host` / `disable_proxy_host` - Enable/disable a proxy host

### Streams (TCP/UDP)
- `list_streams` - List all streams
- `create_stream` - Create a new stream
- `delete_stream` - Delete a stream
- `enable_stream` / `disable_stream` - Enable/disable a stream

### Redirection Hosts
- `list_redirection_hosts` - List all redirections
- `create_redirection_host` - Create a new redirection
- `delete_redirection_host` - Delete a redirection

### SSL Certificates
- `list_certificates` - List all certificates
- `get_certificate` - Get certificate details
- `renew_certificate` - Renew a certificate
- `delete_certificate` - Delete a certificate

### Access Lists
- `list_access_lists` - List all access lists
- `create_access_list` - Create a new access list
- `delete_access_list` - Delete an access list

### 404 Hosts
- `list_dead_hosts` - List all 404 hosts
- `create_dead_host` - Create a new 404 host
- `delete_dead_host` - Delete a 404 host

### Users & Status
- `list_users` - List all users
- `get_status` - Get NPM status and MCP server mode

## Installation

```bash
cd npm-mcp-server
npm install
npm run build
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NPM_URL` | Nginx Proxy Manager URL | `http://localhost:81` |
| `NPM_EMAIL` | Login email (required) | - |
| `NPM_PASSWORD` | Login password (required) | - |
| `NPM_READONLY` | Readonly mode (blocks create/update/delete) | `false` |

### Readonly Mode

When `NPM_READONLY=true`, the server only allows read operations:
- ✅ `list_*` - List resources
- ✅ `get_*` - Get resource details
- ❌ `create_*` - Create (blocked)
- ❌ `update_*` - Update (blocked)
- ❌ `delete_*` - Delete (blocked)
- ❌ `enable_*` / `disable_*` - Enable/disable (blocked)
- ❌ `renew_certificate` - Renew certificate (blocked)

Use readonly mode when you only want AI to view information without modifying configuration.

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "nginx-proxy-manager": {
      "command": "node",
      "args": ["/path/to/npm-mcp-server/dist/index.js"],
      "env": {
        "NPM_URL": "http://your-npm-host:81",
        "NPM_EMAIL": "admin@example.com",
        "NPM_PASSWORD": "your-password",
        "NPM_READONLY": "false"
      }
    }
  }
}
```

### Claude Code (VSCode)

Add to `.claude/settings.json`:

```json
{
  "mcpServers": {
    "nginx-proxy-manager": {
      "command": "node",
      "args": ["/path/to/npm-mcp-server/dist/index.js"],
      "env": {
        "NPM_URL": "http://your-npm-host:81",
        "NPM_EMAIL": "admin@example.com",
        "NPM_PASSWORD": "your-password",
        "NPM_READONLY": "false"
      }
    }
  }
}
```

### Readonly Mode Configuration Example

```json
{
  "mcpServers": {
    "nginx-proxy-manager": {
      "command": "node",
      "args": ["/path/to/npm-mcp-server/dist/index.js"],
      "env": {
        "NPM_URL": "http://your-npm-host:81",
        "NPM_EMAIL": "admin@example.com",
        "NPM_PASSWORD": "your-password",
        "NPM_READONLY": "true"
      }
    }
  }
}
```

## Usage Examples

### Create a Proxy Host

```
Create a proxy host for domain app.example.com, forward to 192.168.1.100:8080
```

### List All Proxy Hosts

```
Show me all proxy hosts
```

### Create a TCP Stream

```
Create a TCP stream from port 3306 forwarding to mysql-server:3306
```

### Manage Certificates

```
List all SSL certificates and tell me which ones are expiring soon
```

## Development

```bash
# Build
npm run build

# Watch mode
npm run dev
```

## License

MIT
