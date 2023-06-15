"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unknownEndPointHanlder = (_req, res) => {
    res.status(404).send({ message: "unknown endpoint" });
};
exports.default = unknownEndPointHanlder;
//# sourceMappingURL=unKnownEndpoint.js.map