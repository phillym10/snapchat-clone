"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagesRoute = void 0;
const express_1 = __importDefault(require("express"));
exports.pagesRoute = express_1.default.Router();
exports.pagesRoute.get("/", (request, response) => {
    response.render("index");
});
