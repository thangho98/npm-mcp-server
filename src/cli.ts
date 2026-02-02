#!/usr/bin/env node

import { NpmApiClient } from "./api-client.js";

const NPM_URL = process.env.NPM_URL || "http://localhost:81";
const NPM_EMAIL = process.env.NPM_EMAIL || "";
const NPM_PASSWORD = process.env.NPM_PASSWORD || "";
const NPM_READONLY = process.env.NPM_READONLY === "true";

if (!NPM_EMAIL || !NPM_PASSWORD) {
  console.error("Error: NPM_EMAIL and NPM_PASSWORD environment variables are required");
  process.exit(1);
}

const client = new NpmApiClient({
  baseUrl: NPM_URL,
  email: NPM_EMAIL,
  password: NPM_PASSWORD,
  readonly: NPM_READONLY,
});

const args = process.argv.slice(2);
const command = args[0];
const subcommand = args[1];

function parseArgs(args: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].slice(2);
      const value = args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : "true";
      result[key] = value;
      if (value !== "true") i++;
    }
  }
  return result;
}

function print(data: unknown): void {
  console.log(JSON.stringify(data, null, 2));
}

async function main(): Promise<void> {
  try {
    switch (command) {
      case "status": {
        const health = await client.getHealth();
        print({
          ...health,
          mcp_server: {
            readonly: client.isReadonly,
            mode: client.isReadonly ? "readonly" : "read-write",
          },
        });
        break;
      }

      case "proxy-hosts": {
        switch (subcommand) {
          case "list": {
            const hosts = await client.listProxyHosts();
            print(hosts);
            break;
          }
          case "get": {
            const id = parseInt(args[2]);
            if (isNaN(id)) throw new Error("Invalid ID");
            const host = await client.getProxyHost(id);
            print(host);
            break;
          }
          case "create": {
            const opts = parseArgs(args.slice(2));
            const host = await client.createProxyHost({
              domain_names: opts.domains?.split(",") || [],
              forward_host: opts["forward-host"] || "",
              forward_port: parseInt(opts["forward-port"]) || 80,
              forward_scheme: (opts["forward-scheme"] as "http" | "https") || "http",
              ssl_forced: opts["ssl-forced"] === "true",
              allow_websocket_upgrade: opts["websocket"] === "true",
              block_exploits: opts["block-exploits"] === "true",
              caching_enabled: opts["caching"] === "true",
              http2_support: opts["http2"] === "true",
              certificate_id: opts["certificate-id"] ? parseInt(opts["certificate-id"]) : undefined,
            });
            print(host);
            break;
          }
          case "delete": {
            const id = parseInt(args[2]);
            if (isNaN(id)) throw new Error("Invalid ID");
            await client.deleteProxyHost(id);
            console.log(`Proxy host ${id} deleted`);
            break;
          }
          case "enable": {
            const id = parseInt(args[2]);
            if (isNaN(id)) throw new Error("Invalid ID");
            await client.enableProxyHost(id);
            console.log(`Proxy host ${id} enabled`);
            break;
          }
          case "disable": {
            const id = parseInt(args[2]);
            if (isNaN(id)) throw new Error("Invalid ID");
            await client.disableProxyHost(id);
            console.log(`Proxy host ${id} disabled`);
            break;
          }
          default:
            console.error("Usage: proxy-hosts [list|get|create|delete|enable|disable]");
        }
        break;
      }

      case "streams": {
        switch (subcommand) {
          case "list": {
            const streams = await client.listStreams();
            print(streams);
            break;
          }
          case "get": {
            const id = parseInt(args[2]);
            if (isNaN(id)) throw new Error("Invalid ID");
            const stream = await client.getStream(id);
            print(stream);
            break;
          }
          case "create": {
            const opts = parseArgs(args.slice(2));
            const stream = await client.createStream({
              incoming_port: parseInt(opts["incoming-port"]) || 0,
              forwarding_host: opts["forward-host"] || "",
              forwarding_port: parseInt(opts["forward-port"]) || 0,
              tcp_forwarding: opts["tcp"] !== "false",
              udp_forwarding: opts["udp"] === "true",
            });
            print(stream);
            break;
          }
          case "delete": {
            const id = parseInt(args[2]);
            if (isNaN(id)) throw new Error("Invalid ID");
            await client.deleteStream(id);
            console.log(`Stream ${id} deleted`);
            break;
          }
          case "enable": {
            const id = parseInt(args[2]);
            if (isNaN(id)) throw new Error("Invalid ID");
            await client.enableStream(id);
            console.log(`Stream ${id} enabled`);
            break;
          }
          case "disable": {
            const id = parseInt(args[2]);
            if (isNaN(id)) throw new Error("Invalid ID");
            await client.disableStream(id);
            console.log(`Stream ${id} disabled`);
            break;
          }
          default:
            console.error("Usage: streams [list|get|create|delete|enable|disable]");
        }
        break;
      }

      case "certificates": {
        switch (subcommand) {
          case "list": {
            const certs = await client.listCertificates();
            print(certs);
            break;
          }
          case "get": {
            const id = parseInt(args[2]);
            if (isNaN(id)) throw new Error("Invalid ID");
            const cert = await client.getCertificate(id);
            print(cert);
            break;
          }
          case "renew": {
            const id = parseInt(args[2]);
            if (isNaN(id)) throw new Error("Invalid ID");
            const cert = await client.renewCertificate(id);
            print(cert);
            break;
          }
          case "delete": {
            const id = parseInt(args[2]);
            if (isNaN(id)) throw new Error("Invalid ID");
            await client.deleteCertificate(id);
            console.log(`Certificate ${id} deleted`);
            break;
          }
          default:
            console.error("Usage: certificates [list|get|renew|delete]");
        }
        break;
      }

      case "redirections": {
        switch (subcommand) {
          case "list": {
            const hosts = await client.listRedirectionHosts();
            print(hosts);
            break;
          }
          case "get": {
            const id = parseInt(args[2]);
            if (isNaN(id)) throw new Error("Invalid ID");
            const host = await client.getRedirectionHost(id);
            print(host);
            break;
          }
          case "create": {
            const opts = parseArgs(args.slice(2));
            const host = await client.createRedirectionHost({
              domain_names: opts.domains?.split(",") || [],
              forward_scheme: (opts["forward-scheme"] as "http" | "https" | "$scheme") || "$scheme",
              forward_domain_name: opts["forward-domain"] || "",
              forward_http_code: parseInt(opts["http-code"]) || 301,
              preserve_path: opts["preserve-path"] !== "false",
            });
            print(host);
            break;
          }
          case "delete": {
            const id = parseInt(args[2]);
            if (isNaN(id)) throw new Error("Invalid ID");
            await client.deleteRedirectionHost(id);
            console.log(`Redirection host ${id} deleted`);
            break;
          }
          default:
            console.error("Usage: redirections [list|get|create|delete]");
        }
        break;
      }

      case "access-lists": {
        switch (subcommand) {
          case "list": {
            const lists = await client.listAccessLists();
            print(lists);
            break;
          }
          case "get": {
            const id = parseInt(args[2]);
            if (isNaN(id)) throw new Error("Invalid ID");
            const list = await client.getAccessList(id);
            print(list);
            break;
          }
          case "create": {
            const opts = parseArgs(args.slice(2));
            const list = await client.createAccessList({
              name: opts.name || "New Access List",
            });
            print(list);
            break;
          }
          case "delete": {
            const id = parseInt(args[2]);
            if (isNaN(id)) throw new Error("Invalid ID");
            await client.deleteAccessList(id);
            console.log(`Access list ${id} deleted`);
            break;
          }
          default:
            console.error("Usage: access-lists [list|get|create|delete]");
        }
        break;
      }

      case "dead-hosts": {
        switch (subcommand) {
          case "list": {
            const hosts = await client.listDeadHosts();
            print(hosts);
            break;
          }
          case "get": {
            const id = parseInt(args[2]);
            if (isNaN(id)) throw new Error("Invalid ID");
            const host = await client.getDeadHost(id);
            print(host);
            break;
          }
          case "create": {
            const opts = parseArgs(args.slice(2));
            const host = await client.createDeadHost({
              domain_names: opts.domains?.split(",") || [],
            });
            print(host);
            break;
          }
          case "delete": {
            const id = parseInt(args[2]);
            if (isNaN(id)) throw new Error("Invalid ID");
            await client.deleteDeadHost(id);
            console.log(`Dead host ${id} deleted`);
            break;
          }
          default:
            console.error("Usage: dead-hosts [list|get|create|delete]");
        }
        break;
      }

      case "users": {
        switch (subcommand) {
          case "list": {
            const users = await client.listUsers();
            print(users);
            break;
          }
          case "get": {
            const id = parseInt(args[2]);
            if (isNaN(id)) throw new Error("Invalid ID");
            const user = await client.getUser(id);
            print(user);
            break;
          }
          default:
            console.error("Usage: users [list|get]");
        }
        break;
      }

      default:
        console.log(`
Nginx Proxy Manager CLI

Usage: npm-cli <command> <subcommand> [options]

Commands:
  status                          Get NPM status
  proxy-hosts list                List all proxy hosts
  proxy-hosts get <id>            Get proxy host details
  proxy-hosts create [options]    Create a proxy host
  proxy-hosts delete <id>         Delete a proxy host
  proxy-hosts enable <id>         Enable a proxy host
  proxy-hosts disable <id>        Disable a proxy host
  streams list                    List all streams
  streams create [options]        Create a stream
  streams delete <id>             Delete a stream
  certificates list               List all certificates
  certificates renew <id>         Renew a certificate
  redirections list               List all redirections
  redirections create [options]   Create a redirection
  access-lists list               List all access lists
  access-lists create [options]   Create an access list
  dead-hosts list                 List all 404 hosts
  dead-hosts create [options]     Create a 404 host
  users list                      List all users

Options for proxy-hosts create:
  --domains <domains>             Comma-separated domain names
  --forward-host <host>           Forward host
  --forward-port <port>           Forward port
  --forward-scheme <http|https>   Forward scheme (default: http)
  --ssl-forced                    Force SSL
  --websocket                     Enable WebSocket
  --http2                         Enable HTTP/2
  --certificate-id <id>           SSL certificate ID

Options for streams create:
  --incoming-port <port>          Incoming port
  --forward-host <host>           Forward host
  --forward-port <port>           Forward port
  --tcp                           Enable TCP (default: true)
  --udp                           Enable UDP

Environment Variables:
  NPM_URL                         NPM URL (default: http://localhost:81)
  NPM_EMAIL                       Admin email (required)
  NPM_PASSWORD                    Admin password (required)
  NPM_READONLY                    Readonly mode (default: false)
`);
    }
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
