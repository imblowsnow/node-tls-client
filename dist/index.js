"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const sessions_1 = require("./sessions");
const response_1 = require("./response");
const exceptions_1 = require("./exceptions");
const TlsClient = {
    Session: sessions_1.Session,
    Response: response_1.Response,
    TLSClientException: exceptions_1.TLSClientException,
    async get(url, options) {
        const session = new sessions_1.Session();
        return await session.get(url, options);
    },
    async post(url, options) {
        const session = new sessions_1.Session();
        return await session.post(url, options);
    },
    async put(url, options) {
        const session = new sessions_1.Session();
        return await session.put(url, options);
    },
    async patch(url, options) {
        const session = new sessions_1.Session();
        return await session.patch(url, options);
    },
    async delete(url, options) {
        const session = new sessions_1.Session();
        return await session.delete(url, options);
    },
    async head(url, options) {
        const session = new sessions_1.Session();
        return await session.head(url, options);
    },
    async options(url, options) {
        const session = new sessions_1.Session();
        return await session.options(url, options);
    }
};
exports.default = TlsClient;
module.exports = TlsClient;
