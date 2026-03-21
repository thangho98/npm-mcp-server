/**
 * Nginx Proxy Manager API Client
 */
export interface NpmConfig {
    baseUrl: string;
    email: string;
    password: string;
    readonly?: boolean;
}
export declare class ReadonlyModeError extends Error {
    constructor(operation: string);
}
export interface TokenResponse {
    token: string;
    expires: string;
}
export interface ProxyHost {
    id: number;
    created_on: string;
    modified_on: string;
    owner_user_id: number;
    domain_names: string[];
    forward_host: string;
    forward_port: number;
    forward_scheme: "http" | "https";
    access_list_id: number;
    certificate_id: number;
    ssl_forced: boolean;
    caching_enabled: boolean;
    block_exploits: boolean;
    advanced_config: string;
    meta: Record<string, unknown>;
    allow_websocket_upgrade: boolean;
    http2_support: boolean;
    enabled: boolean;
    locations: ProxyLocation[];
    hsts_enabled: boolean;
    hsts_subdomains: boolean;
}
export interface ProxyLocation {
    id?: number;
    path: string;
    forward_scheme: "http" | "https";
    forward_host: string;
    forward_port: number;
    forward_path?: string;
    advanced_config?: string;
}
export interface CreateProxyHostInput {
    domain_names: string[];
    forward_scheme: "http" | "https";
    forward_host: string;
    forward_port: number;
    certificate_id?: number;
    ssl_forced?: boolean;
    hsts_enabled?: boolean;
    hsts_subdomains?: boolean;
    http2_support?: boolean;
    block_exploits?: boolean;
    caching_enabled?: boolean;
    allow_websocket_upgrade?: boolean;
    access_list_id?: number;
    advanced_config?: string;
    enabled?: boolean;
    locations?: ProxyLocation[];
}
export interface Certificate {
    id: number;
    created_on: string;
    modified_on: string;
    owner_user_id: number;
    provider: string;
    nice_name: string;
    domain_names: string[];
    expires_on: string;
    meta: Record<string, unknown>;
}
export interface Stream {
    id: number;
    created_on: string;
    modified_on: string;
    owner_user_id: number;
    incoming_port: number;
    forwarding_host: string;
    forwarding_port: number;
    tcp_forwarding: boolean;
    udp_forwarding: boolean;
    enabled: boolean;
    meta: Record<string, unknown>;
}
export interface CreateStreamInput {
    incoming_port: number;
    forwarding_host: string;
    forwarding_port: number;
    tcp_forwarding?: boolean;
    udp_forwarding?: boolean;
    enabled?: boolean;
}
export interface RedirectionHost {
    id: number;
    created_on: string;
    modified_on: string;
    owner_user_id: number;
    domain_names: string[];
    forward_scheme: "http" | "https" | "$scheme";
    forward_domain_name: string;
    forward_http_code: number;
    preserve_path: boolean;
    certificate_id: number;
    ssl_forced: boolean;
    hsts_enabled: boolean;
    hsts_subdomains: boolean;
    http2_support: boolean;
    block_exploits: boolean;
    enabled: boolean;
}
export interface CreateRedirectionHostInput {
    domain_names: string[];
    forward_scheme: "http" | "https" | "$scheme";
    forward_domain_name: string;
    forward_http_code: number;
    preserve_path?: boolean;
    certificate_id?: number;
    ssl_forced?: boolean;
    hsts_enabled?: boolean;
    hsts_subdomains?: boolean;
    http2_support?: boolean;
    block_exploits?: boolean;
    enabled?: boolean;
}
export interface AccessList {
    id: number;
    created_on: string;
    modified_on: string;
    owner_user_id: number;
    name: string;
    meta: Record<string, unknown>;
    items: AccessListItem[];
    clients: AccessListClient[];
}
export interface AccessListItem {
    username: string;
    password: string;
}
export interface AccessListClient {
    address: string;
    directive: "allow" | "deny";
}
export interface CreateAccessListInput {
    name: string;
    satisfy_any?: boolean;
    pass_auth?: boolean;
    items?: AccessListItem[];
    clients?: AccessListClient[];
}
export interface User {
    id: number;
    created_on: string;
    modified_on: string;
    is_disabled: boolean;
    email: string;
    name: string;
    nickname: string;
    avatar: string;
    roles: string[];
}
export interface DeadHost {
    id: number;
    created_on: string;
    modified_on: string;
    owner_user_id: number;
    domain_names: string[];
    certificate_id: number;
    ssl_forced: boolean;
    hsts_enabled: boolean;
    hsts_subdomains: boolean;
    http2_support: boolean;
    enabled: boolean;
}
export interface CreateDeadHostInput {
    domain_names: string[];
    certificate_id?: number;
    ssl_forced?: boolean;
    hsts_enabled?: boolean;
    hsts_subdomains?: boolean;
    http2_support?: boolean;
    enabled?: boolean;
    advanced_config?: string;
}
export declare class NpmApiClient {
    private baseUrl;
    private token;
    private tokenExpires;
    private email;
    private password;
    private _readonly;
    constructor(config: NpmConfig);
    get isReadonly(): boolean;
    private assertWritable;
    private ensureToken;
    private request;
    listProxyHosts(): Promise<ProxyHost[]>;
    getProxyHost(id: number): Promise<ProxyHost>;
    createProxyHost(data: CreateProxyHostInput): Promise<ProxyHost>;
    updateProxyHost(id: number, data: Partial<CreateProxyHostInput>): Promise<ProxyHost>;
    deleteProxyHost(id: number): Promise<void>;
    enableProxyHost(id: number): Promise<ProxyHost>;
    disableProxyHost(id: number): Promise<ProxyHost>;
    listCertificates(): Promise<Certificate[]>;
    getCertificate(id: number): Promise<Certificate>;
    deleteCertificate(id: number): Promise<void>;
    renewCertificate(id: number): Promise<Certificate>;
    listStreams(): Promise<Stream[]>;
    getStream(id: number): Promise<Stream>;
    createStream(data: CreateStreamInput): Promise<Stream>;
    updateStream(id: number, data: Partial<CreateStreamInput>): Promise<Stream>;
    deleteStream(id: number): Promise<void>;
    enableStream(id: number): Promise<Stream>;
    disableStream(id: number): Promise<Stream>;
    listRedirectionHosts(): Promise<RedirectionHost[]>;
    getRedirectionHost(id: number): Promise<RedirectionHost>;
    createRedirectionHost(data: CreateRedirectionHostInput): Promise<RedirectionHost>;
    updateRedirectionHost(id: number, data: Partial<CreateRedirectionHostInput>): Promise<RedirectionHost>;
    deleteRedirectionHost(id: number): Promise<void>;
    enableRedirectionHost(id: number): Promise<RedirectionHost>;
    disableRedirectionHost(id: number): Promise<RedirectionHost>;
    listDeadHosts(): Promise<DeadHost[]>;
    getDeadHost(id: number): Promise<DeadHost>;
    createDeadHost(data: CreateDeadHostInput): Promise<DeadHost>;
    updateDeadHost(id: number, data: Partial<CreateDeadHostInput>): Promise<DeadHost>;
    deleteDeadHost(id: number): Promise<void>;
    enableDeadHost(id: number): Promise<DeadHost>;
    disableDeadHost(id: number): Promise<DeadHost>;
    listAccessLists(): Promise<AccessList[]>;
    getAccessList(id: number): Promise<AccessList>;
    createAccessList(data: CreateAccessListInput): Promise<AccessList>;
    updateAccessList(id: number, data: Partial<CreateAccessListInput>): Promise<AccessList>;
    deleteAccessList(id: number): Promise<void>;
    listUsers(): Promise<User[]>;
    getUser(id: number): Promise<User>;
    getHealth(): Promise<{
        status: string;
        version: {
            current: string;
        };
    }>;
}
