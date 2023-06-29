"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.TLSClientException = void 0;

class TLSClientException extends Error {
    constructor(message) {
        super(message);
    }
}

exports.TLSClientException = TLSClientException;
