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
exports.handleExistingContacts = exports.handleNewContact = exports.ResponseCodes = void 0;
const logger_1 = require("../utils/logger");
const identify_helpers_1 = require("./identify-helpers");
const logger = new logger_1.Logger('identifyHandlerLogger');
var ResponseCodes;
(function (ResponseCodes) {
    ResponseCodes[ResponseCodes["OK"] = 200] = "OK";
    ResponseCodes[ResponseCodes["CREATED"] = 201] = "CREATED";
    ResponseCodes[ResponseCodes["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(ResponseCodes || (exports.ResponseCodes = ResponseCodes = {}));
const handleNewContact = (email, phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const newContact = yield (0, identify_helpers_1.createContact)(email, phoneNumber, 'primary');
    logger.info(`New Primary Contact Created : ${newContact}`);
    return {
        status: ResponseCodes.CREATED,
        response: {
            contact: {
                primaryContactId: newContact.id,
                emails: [newContact.email],
                phoneNumbers: [newContact.phoneNumber],
                secondaryContactIds: []
            }
        }
    };
});
exports.handleNewContact = handleNewContact;
const handleExistingContacts = (existingContacts, email, phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    let primaryContact = yield (0, identify_helpers_1.getPrimaryContact)(existingContacts);
    const secondaryContacts = existingContacts.filter(contact => contact.linkPrecedence === 'secondary');
    const { primaryByEmail, primaryByPhone } = (0, identify_helpers_1.checkForMismatchedPrimaries)(existingContacts, email, phoneNumber);
    if (primaryByEmail && primaryByPhone && primaryByEmail.id !== primaryByPhone.id) {
        yield (0, identify_helpers_1.updateContactToSecondary)(primaryByPhone, primaryByEmail.id);
        secondaryContacts.push(primaryByPhone);
        primaryContact = primaryByEmail;
    }
    if (!(existingContacts.some(contact => contact.email === email) && existingContacts.some(contact => contact.phoneNumber === phoneNumber))) {
        const newContact = yield (0, identify_helpers_1.createContact)(email, phoneNumber, 'secondary', primaryContact.id);
        secondaryContacts.push(newContact);
        logger.info(`New Secondary Contact Created : ${newContact}`);
    }
    const emails = Array.from(new Set(existingContacts.map(contact => contact.email).concat(email).filter(Boolean)));
    const phoneNumbers = Array.from(new Set(existingContacts.map(contact => contact.phoneNumber).concat(phoneNumber).filter(Boolean)));
    const secondaryContactIds = secondaryContacts.map(contact => contact.id);
    return {
        status: ResponseCodes.OK,
        response: {
            contact: {
                primaryContactId: primaryContact.id,
                emails: emails,
                phoneNumbers: phoneNumbers,
                secondaryContactIds: secondaryContactIds
            }
        }
    };
});
exports.handleExistingContacts = handleExistingContacts;
