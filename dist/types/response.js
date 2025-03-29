"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Response {
    constructor(status, success, message, data) {
        this.status = status;
        this.success = success;
        this.message = message;
        this.data = data;
    }
}
exports.default = Response;
