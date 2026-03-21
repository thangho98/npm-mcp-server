/**
 * Nginx Proxy Manager API Client
 */
export class ReadonlyModeError extends Error {
    constructor(operation) {
        super(`Operation "${operation}" is not allowed in readonly mode`);
        this.name = "ReadonlyModeError";
    }
}
export class NpmApiClient {
    baseUrl;
    token = null;
    tokenExpires = null;
    email;
    password;
    _readonly;
    constructor(config) {
        this.baseUrl = config.baseUrl.replace(/\/$/, "");
        this.email = config.email;
        this.password = config.password;
        this._readonly = config.readonly ?? false;
    }
    get isReadonly() {
        return this._readonly;
    }
    assertWritable(operation) {
        if (this._readonly) {
            throw new ReadonlyModeError(operation);
        }
    }
    async ensureToken() {
        if (this.token && this.tokenExpires && this.tokenExpires > new Date()) {
            return this.token;
        }
        const response = await fetch(`${this.baseUrl}/api/tokens`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                identity: this.email,
                secret: this.password,
            }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Authentication failed: ${error}`);
        }
        const data = (await response.json());
        this.token = data.token;
        this.tokenExpires = new Date(data.expires);
        return this.token;
    }
    async request(method, path, body) {
        const token = await this.ensureToken();
        const response = await fetch(`${this.baseUrl}/api${path}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: body ? JSON.stringify(body) : undefined,
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`API request failed: ${response.status} - ${error}`);
        }
        if (response.status === 204) {
            return {};
        }
        return response.json();
    }
    // Proxy Hosts
    async listProxyHosts() {
        return this.request("GET", "/nginx/proxy-hosts");
    }
    async getProxyHost(id) {
        return this.request("GET", `/nginx/proxy-hosts/${id}`);
    }
    async createProxyHost(data) {
        this.assertWritable("createProxyHost");
        return this.request("POST", "/nginx/proxy-hosts", data);
    }
    async updateProxyHost(id, data) {
        this.assertWritable("updateProxyHost");
        return this.request("PUT", `/nginx/proxy-hosts/${id}`, data);
    }
    async deleteProxyHost(id) {
        this.assertWritable("deleteProxyHost");
        await this.request("DELETE", `/nginx/proxy-hosts/${id}`);
    }
    async enableProxyHost(id) {
        this.assertWritable("enableProxyHost");
        return this.request("POST", `/nginx/proxy-hosts/${id}/enable`);
    }
    async disableProxyHost(id) {
        this.assertWritable("disableProxyHost");
        return this.request("POST", `/nginx/proxy-hosts/${id}/disable`);
    }
    // Certificates
    async listCertificates() {
        return this.request("GET", "/nginx/certificates");
    }
    async getCertificate(id) {
        return this.request("GET", `/nginx/certificates/${id}`);
    }
    async deleteCertificate(id) {
        this.assertWritable("deleteCertificate");
        await this.request("DELETE", `/nginx/certificates/${id}`);
    }
    async renewCertificate(id) {
        this.assertWritable("renewCertificate");
        return this.request("POST", `/nginx/certificates/${id}/renew`);
    }
    // Streams
    async listStreams() {
        return this.request("GET", "/nginx/streams");
    }
    async getStream(id) {
        return this.request("GET", `/nginx/streams/${id}`);
    }
    async createStream(data) {
        this.assertWritable("createStream");
        return this.request("POST", "/nginx/streams", data);
    }
    async updateStream(id, data) {
        this.assertWritable("updateStream");
        return this.request("PUT", `/nginx/streams/${id}`, data);
    }
    async deleteStream(id) {
        this.assertWritable("deleteStream");
        await this.request("DELETE", `/nginx/streams/${id}`);
    }
    async enableStream(id) {
        this.assertWritable("enableStream");
        return this.request("POST", `/nginx/streams/${id}/enable`);
    }
    async disableStream(id) {
        this.assertWritable("disableStream");
        return this.request("POST", `/nginx/streams/${id}/disable`);
    }
    // Redirection Hosts
    async listRedirectionHosts() {
        return this.request("GET", "/nginx/redirection-hosts");
    }
    async getRedirectionHost(id) {
        return this.request("GET", `/nginx/redirection-hosts/${id}`);
    }
    async createRedirectionHost(data) {
        this.assertWritable("createRedirectionHost");
        return this.request("POST", "/nginx/redirection-hosts", data);
    }
    async updateRedirectionHost(id, data) {
        this.assertWritable("updateRedirectionHost");
        return this.request("PUT", `/nginx/redirection-hosts/${id}`, data);
    }
    async deleteRedirectionHost(id) {
        this.assertWritable("deleteRedirectionHost");
        await this.request("DELETE", `/nginx/redirection-hosts/${id}`);
    }
    async enableRedirectionHost(id) {
        this.assertWritable("enableRedirectionHost");
        return this.request("POST", `/nginx/redirection-hosts/${id}/enable`);
    }
    async disableRedirectionHost(id) {
        this.assertWritable("disableRedirectionHost");
        return this.request("POST", `/nginx/redirection-hosts/${id}/disable`);
    }
    // Dead Hosts (404 Hosts)
    async listDeadHosts() {
        return this.request("GET", "/nginx/dead-hosts");
    }
    async getDeadHost(id) {
        return this.request("GET", `/nginx/dead-hosts/${id}`);
    }
    async createDeadHost(data) {
        this.assertWritable("createDeadHost");
        return this.request("POST", "/nginx/dead-hosts", data);
    }
    async updateDeadHost(id, data) {
        this.assertWritable("updateDeadHost");
        return this.request("PUT", `/nginx/dead-hosts/${id}`, data);
    }
    async deleteDeadHost(id) {
        this.assertWritable("deleteDeadHost");
        await this.request("DELETE", `/nginx/dead-hosts/${id}`);
    }
    async enableDeadHost(id) {
        this.assertWritable("enableDeadHost");
        return this.request("POST", `/nginx/dead-hosts/${id}/enable`);
    }
    async disableDeadHost(id) {
        this.assertWritable("disableDeadHost");
        return this.request("POST", `/nginx/dead-hosts/${id}/disable`);
    }
    // Access Lists
    async listAccessLists() {
        return this.request("GET", "/nginx/access-lists");
    }
    async getAccessList(id) {
        return this.request("GET", `/nginx/access-lists/${id}`);
    }
    async createAccessList(data) {
        this.assertWritable("createAccessList");
        return this.request("POST", "/nginx/access-lists", data);
    }
    async updateAccessList(id, data) {
        this.assertWritable("updateAccessList");
        return this.request("PUT", `/nginx/access-lists/${id}`, data);
    }
    async deleteAccessList(id) {
        this.assertWritable("deleteAccessList");
        await this.request("DELETE", `/nginx/access-lists/${id}`);
    }
    // Users
    async listUsers() {
        return this.request("GET", "/users");
    }
    async getUser(id) {
        return this.request("GET", `/users/${id}`);
    }
    // Health / Status
    async getHealth() {
        const response = await fetch(`${this.baseUrl}/api/`);
        return response.json();
    }
}
