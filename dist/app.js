"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
require("reflect-metadata");
const logger_1 = require("./utils/logger");
const database_1 = require("./utils/database");
const identifyHandler_1 = require("./handlers/identifyHandler");
const logger = new logger_1.Logger('AppLogger');
app.use(express_1.default.json());
app.post('/identify', identifyHandler_1.identifyHandler);
const onServerRunning = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, database_1.dbConnect)();
    logger.info('Server Running on Port 3000');
});
app.listen(3000, onServerRunning);
