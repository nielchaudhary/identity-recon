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
exports.handleMismatchedPrimaryContacts = exports.getUniqueEmailsAndPhoneNumbers = void 0;
const existingContact_helpers_1 = require("./existingContact-helpers");
const getUniqueEmailsAndPhoneNumbers = (existingContacts, email, phoneNumber) => {
    const emails = Array.from(new Set(existingContacts.map(contact => contact.email).concat(email).filter(Boolean))).map(email => email);
    const phoneNumbers = Array.from(new Set(existingContacts.map(contact => contact.phoneNumber).concat(phoneNumber).filter(Boolean))).map(phoneNumber => phoneNumber);
    return { emails, phoneNumbers };
};
exports.getUniqueEmailsAndPhoneNumbers = getUniqueEmailsAndPhoneNumbers;
const handleMismatchedPrimaryContacts = (existingContacts, email, phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const primaryByEmail = existingContacts.find(contact => contact.email === email && contact.linkPrecedence === 'primary');
    const primaryByPhone = existingContacts.find(contact => contact.phoneNumber === phoneNumber && contact.linkPrecedence === 'primary');
    if (primaryByEmail && primaryByPhone && primaryByEmail.id !== primaryByPhone.id) {
        yield primaryByPhone.update({
            linkPrecedence: 'secondary',
            linkedId: primaryByEmail.id,
            updatedAt: new Date(),
        });
        const secondaryContacts = (0, existingContact_helpers_1.findSecondaryContacts)(existingContacts);
        secondaryContacts.push(primaryByPhone);
        return secondaryContacts;
    }
    return (0, existingContact_helpers_1.findSecondaryContacts)(existingContacts);
});
exports.handleMismatchedPrimaryContacts = handleMismatchedPrimaryContacts;
