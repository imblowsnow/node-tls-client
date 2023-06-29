"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.Response = void 0;
const exceptions_1 = require("./exceptions");
const http_1 = require("http");

class Response {
    url;
    ok;
    status;
    reason;
    raiseForStatus;
    headers;
    cookies;
    content;
    text;
    data;

    constructor(response, cookies) {
        this.url = response.target;
        this.ok = response.status >= 200 && response.status < 300;
        this.status = response.status;
        this.reason = http_1.STATUS_CODES[response.status];
        this.raiseForStatus = () => {
            if (!this.ok) {
                throw new exceptions_1.TLSClientException(`Request failed with status code ${this.status}`);
            }
        };
        this.headers = Object.fromEntries(Object.entries(response.headers).map(([key, value]) => [key, value.join(', ')]));
        this.cookies = cookies;
        this.content = Buffer.from(response.body, 'utf-8');
        this.text = response.body;
        this.data = null;
        if (this.headers['Content-Type'] && this.headers['Content-Type'].includes('application/json')) {
            try {
                this.data = JSON.parse(response.body);
            } catch (e) {
                ;
            }
        }
    }
}

exports.Response = Response;
