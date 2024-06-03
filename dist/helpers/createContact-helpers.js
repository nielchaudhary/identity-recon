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
exports.createSecondaryContact = exports.createContact = void 0;
const contactModel_1 = require("../model/contactModel");
const createContact = (email_1, phoneNumber_1, linkPrecedence_1, ...args_1) => __awaiter(void 0, [email_1, phoneNumber_1, linkPrecedence_1, ...args_1], void 0, function* (email, phoneNumber, linkPrecedence, linkedId = null) {
    return yield contactModel_1.Contact.create({
        phoneNumber,
        email,
        linkPrecedence,
        linkedId,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
});
exports.createContact = createContact;
const createSecondaryContact = (primaryContact, phoneNumber, email) => __awaiter(void 0, void 0, void 0, function* () {
    const newContact = yield contactModel_1.Contact.create({
        phoneNumber,
        email,
        linkPrecedence: 'secondary',
        linkedId: primaryContact.id,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    return newContact;
});
exports.createSecondaryContact = createSecondaryContact;
