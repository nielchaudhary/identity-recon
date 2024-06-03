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
exports.checkForMismatchedPrimaries = exports.updateContactToSecondary = exports.findSecondaryContacts = exports.findPrimaryContact = exports.findExistingContacts = exports.ResponseCodes = void 0;
const sequelize_1 = require("sequelize");
const contactModel_1 = require("../model/contactModel");
var ResponseCodes;
(function (ResponseCodes) {
    ResponseCodes[ResponseCodes["OK"] = 200] = "OK";
    ResponseCodes[ResponseCodes["CREATED"] = 201] = "CREATED";
    ResponseCodes[ResponseCodes["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    ResponseCodes[ResponseCodes["CONFLICT"] = 409] = "CONFLICT";
})(ResponseCodes || (exports.ResponseCodes = ResponseCodes = {}));
const findExistingContacts = (email, phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    return yield contactModel_1.Contact.findAll({
        where: {
            [sequelize_1.Op.or]: [
                { phoneNumber },
                { email }
            ]
        }
    });
});
exports.findExistingContacts = findExistingContacts;
const findPrimaryContact = (existingContacts) => __awaiter(void 0, void 0, void 0, function* () {
    let primaryContact = existingContacts.find(contact => contact.linkPrecedence === 'primary') || existingContacts[0];
    if (primaryContact.linkPrecedence === 'secondary' && primaryContact.linkedId) {
        primaryContact = (yield contactModel_1.Contact.findByPk(primaryContact.linkedId));
    }
    return primaryContact;
});
exports.findPrimaryContact = findPrimaryContact;
const findSecondaryContacts = (existingContacts) => {
    return existingContacts.filter(contact => contact.linkPrecedence === 'secondary');
};
exports.findSecondaryContacts = findSecondaryContacts;
const updateContactToSecondary = (contact, linkedId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield contact.update({
        linkPrecedence: 'secondary',
        linkedId,
        updatedAt: new Date(),
    });
});
exports.updateContactToSecondary = updateContactToSecondary;
const checkForMismatchedPrimaries = (contacts, email, phoneNumber) => {
    const primaryByEmail = contacts.find(contact => contact.email === email && contact.linkPrecedence === 'primary');
    const primaryByPhone = contacts.find(contact => contact.phoneNumber === phoneNumber && contact.linkPrecedence === 'primary');
    return { primaryByEmail, primaryByPhone };
};
exports.checkForMismatchedPrimaries = checkForMismatchedPrimaries;
