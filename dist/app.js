"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const logger_1 = require("./utils/logger");
const logger = new logger_1.Logger('rootAppLogger');
const onServerRunning = () => {
    logger.info('Server Running on Port 3000');
};
app.listen(3000, onServerRunning);
