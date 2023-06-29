"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.Session = void 0;
const cffi_1 = require("./cffi");
const exceptions_1 = require("./exceptions");
const response_1 = require("./response");
const tough_cookie_1 = require("tough-cookie");
const crypto_1 = require("crypto");
const __version__1 = require("./__version__");
const fs = require("fs");
const path = require("path");
class Session {
    sessionId;
    headers;
    proxy;
    params;
    cookies;
    sessionOptions;
    clientIdentifier;
    ja3string;
    h2Settings;
    h2SettingsOrder;
    supportedSignatureAlgorithms;
    supportedVersions;
    keyShareCurves;
    certCompressionAlgo;
    pseudoHeaderOrder;
    connectionFlow;
    priorityFrames;
    headerOrder;
    headerPriority;
    randomTlsExtensionOrder;
    forceHttp1;

    constructor(options) {
        this.sessionId = (0, crypto_1.randomUUID)();
        this.headers = {
            'User-Agent': `tls-client/${__version__1.__version__}`,
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept': '*/*',
            'Connection': 'keep-alive',
        };
        this.proxy = '';
        this.params = {};
        this.cookies = new tough_cookie_1.CookieJar();
        this.sessionOptions = options;
        this.clientIdentifier = options?.clientIdentifier;
        this.ja3string = options?.ja3string;
        this.h2Settings = options?.h2Settings;
        this.h2SettingsOrder = options?.h2SettingsOrder;
        this.supportedSignatureAlgorithms = options?.supportedSignatureAlgorithms;
        this.supportedVersions = options?.supportedVersions;
        this.keyShareCurves = options?.keyShareCurves;
        this.certCompressionAlgo = options?.certCompressionAlgo;
        this.pseudoHeaderOrder = options?.pseudoHeaderOrder;
        this.connectionFlow = options?.connectionFlow;
        this.priorityFrames = options?.priorityFrames;
        this.headerOrder = options?.headerOrder || null;
        this.headerPriority = options?.headerPriority;
        this.randomTlsExtensionOrder = options?.randomTlsExtensionOrder || false;
        this.forceHttp1 = options?.forceHttp1 || false;
        this.streamPath = options?.streamPath || path.join("./stream/");
        if (!fs.existsSync(this.streamPath)){
            fs.mkdirSync(this.streamPath, {recursive: true});
        }
    }
    ;

    #setValue(obj, key, value) {
        let found = false;
        for (const [headerKey, headerValue] of Object.entries(obj)) {
            if (headerKey.toLowerCase() === key.toLowerCase()) {
                delete obj[headerKey];
                obj[key] = value;
                found = true;
            }
        }
        if (!found) {
            obj[key] = value;
        }
        return obj;
    }

    async executeRequest(method, url, options) {
        if (options?.params) {
            url += `?${new URLSearchParams(options.params).toString()}`;
        }
        let requestBody;
        let contentType;
        if (options?.json) {
            requestBody = JSON.stringify(options.json);
            contentType = 'application/json';
        } else if (options?.data) {
            requestBody = new URLSearchParams(Object.entries(options.data)).toString();
            contentType = 'application/x-www-form-urlencoded';
        }
        if (contentType) {
            this.#setValue(this.headers, 'Content-Type', contentType);
        }
        let headers = this.headers;
        if (options?.headers) {
            for (const [headerKey, headerValue] of Object.entries(options.headers)) {
                this.#setValue(this.headers, headerKey, headerValue);
            }
            headers = this.headers;
        }
        let cookies = this.cookies;
        let cookieStr = '';
        if (options?.cookies) {
            for (const [cookieKey, cookieValue] of Object.entries(options.cookies)) {
                cookieStr += `${cookieKey}=${cookieValue}; `;
            }
        }

        if (options && options.headers && options.headers['Cookie']) {
            cookieStr += options.headers['Cookie'] + await cookies.getCookieString(url);
        } else {
            cookieStr += await cookies.getCookieString(url);
        }
        this.#setValue(headers, 'Cookie', cookieStr);

        let proxy = this.proxy;
        if (options?.proxy) {
            proxy = options.proxy;
        }
        const isByteRequest = false;
        const requestPayload = {
            sessionId: this.sessionId,
            followRedirects: options?.allowRedirects || false,
            forceHttp1: this.forceHttp1,
            headers: headers,
            headerOrder: this.headerOrder,
            insecureSkipVerify: options?.insecureSkipVerify || false,
            isByteRequest: isByteRequest,
            proxyUrl: proxy,
            requestUrl: url,
            requestMethod: method.toLocaleUpperCase(),
            requestBody: requestBody || "",
            requestCookies: [],
            timeoutSeconds: options?.timeoutSeconds || 30,
        };
        if (options?.stream){
            let uuid = crypto_1.randomUUID();
            requestPayload.streamOutputPath = path.join(this.streamPath, uuid + ".txt");
        }
        if (Object.keys(this.sessionOptions || {}).length) {
            if (this.clientIdentifier) {
                requestPayload.tlsClientIdentifier = this.clientIdentifier;
                requestPayload.withRandomTLSExtensionOrder = this.randomTlsExtensionOrder;
            } else {
                requestPayload.customTlsClient = {
                    ja3String: this.ja3string,
                    h2Settings: this.h2Settings,
                    h2SettingsOrder: this.h2SettingsOrder,
                    supportedSignatureAlgorithms: this.supportedSignatureAlgorithms,
                    supportedVersions: this.supportedVersions,
                    keyShareCurves: this.keyShareCurves,
                    certCompressionAlgo: this.certCompressionAlgo,
                    pseudoHeaderOrder: this.pseudoHeaderOrder,
                    connectionFlow: this.connectionFlow,
                    priorityFrames: this.priorityFrames,
                    headerOrder: this.headerOrder,
                    headerPriority: this.headerPriority,
                };
            }
        } else {
            requestPayload.tlsClientIdentifier = 'chrome_108';
            requestPayload.withRandomTLSExtensionOrder = false;
        }
        // 是否流式请求
        if (options?.stream){
            return this._requestStream(requestPayload, options.callback);
        }else{
            return this._request(requestPayload);
        }
    }

    async _requestStream(requestPayload,callback=null) {
        fs.writeFileSync(requestPayload.streamOutputPath, '');
        return new Promise(async (resolve, reject) => {
            let flag = false;
            let lastContent = null;
            async function handle() {
                let content = fs.existsSync(requestPayload.streamOutputPath) ? fs.readFileSync(requestPayload.streamOutputPath, 'utf8'): "";
                if (lastContent !== content && content.length > 0) {
                    if (callback) callback(content.substring(lastContent ? lastContent.length : 0));
                    lastContent = content;
                }
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            try {
                let response = cffi_1.request.async(JSON.stringify(requestPayload), async (error, response) => {
                    flag = true;
                    if (error) {
                        console.error('request error',error);
                        reject(error);
                    } else {
                        await handle();
                        if (fs.existsSync(requestPayload.streamOutputPath)) fs.rmSync(requestPayload.streamOutputPath);
                        resolve(this._wrapResponse(response,requestPayload));
                    }
                });
            }catch (e) {
                console.error('request error',e);
                await handle();
                if (fs.existsSync(requestPayload.streamOutputPath)) fs.rmSync(requestPayload.streamOutputPath);
                reject(e);
            }
            while (flag === false) {
                await handle();
            }
        });
    }

    async _request(requestPayload) {
        // Async
        const response = await new Promise((resolve, reject) => cffi_1.request.async(JSON.stringify(requestPayload), (error, response) => error ? reject(error) : resolve(response)));

        return this._wrapResponse(response,requestPayload);
    }

    async _wrapResponse(response,requestPayload) {
        // Sync
        // const response = request(JSON.stringify(requestPayload));
        if (!response) {
            throw new exceptions_1.TLSClientException('No response received');
        }
        const responseObject = JSON.parse(response);
        if (responseObject.status === 0) {
            throw new exceptions_1.TLSClientException(responseObject.body);
        }
        const responseCookieJar = new tough_cookie_1.CookieJar();
        if (responseObject.headers['Set-Cookie'] && Array.isArray(responseObject.headers['Set-Cookie'])) {
            for (const cookie of responseObject.headers['Set-Cookie']) {
                await responseCookieJar.setCookie(cookie, requestPayload.requestUrl);
            }
        }
        return new response_1.Response(responseObject, responseCookieJar);
    }

    async get(url, options) {
        return this.executeRequest('GET', url, options);
    }

    async post(url, options) {
        return this.executeRequest('POST', url, options);
    }

    async put(url, options) {
        return this.executeRequest('PUT', url, options);
    }

    async delete(url, options) {
        return this.executeRequest('DELETE', url, options);
    }

    async head(url, options) {
        return this.executeRequest('HEAD', url, options);
    }

    async patch(url, options) {
        return this.executeRequest('PATCH', url, options);
    }

    async options(url, options) {
        return this.executeRequest('OPTIONS', url, options);
    }
}

exports.Session = Session;
