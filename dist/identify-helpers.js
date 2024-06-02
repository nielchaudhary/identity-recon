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
exports.checkForMismatchedPrimaries = exports.getPrimaryContact = exports.updateContactToSecondary = exports.createContact = exports.findExistingContacts = void 0;
const sequelize_1 = require("sequelize");
const contactModel_1 = require("./model/contactModel");
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
const updateContactToSecondary = (contact, linkedId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield contact.update({
        linkPrecedence: 'secondary',
        linkedId,
        updatedAt: new Date(),
    });
});
exports.updateContactToSecondary = updateContactToSecondary;
const getPrimaryContact = (contacts) => __awaiter(void 0, void 0, void 0, function* () {
    let primaryContact = contacts.find(contact => contact.linkPrecedence === 'primary') || contacts[0];
    if (primaryContact.linkPrecedence === 'secondary' && primaryContact.linkedId) {
        primaryContact = (yield contactModel_1.Contact.findByPk(primaryContact.linkedId));
    }
    return primaryContact;
});
exports.getPrimaryContact = getPrimaryContact;
const checkForMismatchedPrimaries = (contacts, email, phoneNumber) => {
    const primaryByEmail = contacts.find(contact => contact.email === email && contact.linkPrecedence === 'primary');
    const primaryByPhone = contacts.find(contact => contact.phoneNumber === phoneNumber && contact.linkPrecedence === 'primary');
    return { primaryByEmail, primaryByPhone };
};
exports.checkForMismatchedPrimaries = checkForMismatchedPrimaries;
