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
Object.defineProperty(exports, "__esModule", { value: true });
exports.identifyHandler = void 0;
const identify_helpers_1 = require("../helpers/identify-helpers");
const identifyhelper_functions_1 = require("../helpers/identifyhelper-functions");
const identifyHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phoneNumber } = req.body;
    try {
        const existingContacts = yield (0, identify_helpers_1.findExistingContacts)(email, phoneNumber);
        let result;
        if (existingContacts.length === 0) {
            result = yield (0, identifyhelper_functions_1.handleNewContact)(email, phoneNumber);
        }
        else {
            result = yield (0, identifyhelper_functions_1.handleExistingContacts)(existingContacts, email, phoneNumber);
        }
        return res.status(result.status).json(result.response);
    }
    catch (error) {
        return res.status(identifyhelper_functions_1.ResponseCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
});
exports.identifyHandler = identifyHandler;
