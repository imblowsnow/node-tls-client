"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.request = void 0;
const ffi_napi_1 = __importDefault(require("ffi-napi"));
const file_ext = (() => {
    if (process.platform === 'darwin') {
        return process.arch === 'arm64' ? '-arm64.dylib' : '-x86.dylib';
    } else if (process.platform === 'win32') {
        return process.arch === 'x64' ? '-64.dll' : '-32.dll';
    } else {
        if (process.arch === 'arm64') {
            return '-arm64.so';
        } else if (process.arch === 'x64') {
            return '-x86.so';
        } else {
            return '-amd64.so';
        }
    }
})();
const root_dir = __dirname;
const library = ffi_napi_1.default.Library(`${root_dir}/dependencies/tls-client${file_ext}`, {
    request: ['string', ['string']]
});
exports.request = library.request;
