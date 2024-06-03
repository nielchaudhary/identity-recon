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
const contactModel_1 = require("../model/contactModel");
const logger_1 = require("../utils/logger");
const sequelize_1 = require("sequelize");
const existingContact_helpers_1 = require("../helpers/existingContact-helpers");
const helper_functions_1 = require("../helpers/helper-functions");
const createContact_helpers_1 = require("../helpers/createContact-helpers");
const logger = new logger_1.Logger('identifyHandlerLogger');
const identifyHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phoneNumber } = req.body;
    try {
        const existingContacts = yield contactModel_1.Contact.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { phoneNumber },
                    { email }
                ]
            }
        });
        if (existingContacts.length === 0) {
            const newContact = yield contactModel_1.Contact.create({
                phoneNumber,
                email,
                linkPrecedence: 'primary',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            logger.info(`New Primary Contact Created : ${newContact}`);
            return res.status(existingContact_helpers_1.ResponseCodes.CREATED).json({
                contact: {
                    primaryContactId: newContact.id,
                    emails: [newContact.email],
                    phoneNumbers: [newContact.phoneNumber],
                    secondaryContactIds: []
                }
            });
        }
        else {
            const primaryContact = yield (0, existingContact_helpers_1.findPrimaryContact)(existingContacts);
            const secondaryContacts = yield (0, helper_functions_1.handleMismatchedPrimaryContacts)(existingContacts, email, phoneNumber);
            if (!(existingContacts.some(contact => contact.email === email) && existingContacts.some(contact => contact.phoneNumber === phoneNumber))) {
                const newSecondaryContact = yield (0, createContact_helpers_1.createSecondaryContact)(primaryContact, phoneNumber, email);
                secondaryContacts.push(newSecondaryContact);
                logger.info(`New Secondary Contact Created : ${newSecondaryContact}`);
            }
            const { emails, phoneNumbers } = (0, helper_functions_1.getUniqueEmailsAndPhoneNumbers)(existingContacts, email, phoneNumber);
            const secondaryContactIds = secondaryContacts.map(contact => contact.id);
            return res.status(existingContact_helpers_1.ResponseCodes.CREATED).json({
                contact: {
                    primaryContactId: primaryContact.id,
                    emails: emails,
                    phoneNumbers: phoneNumbers,
                    secondaryContactIds: secondaryContactIds
                }
            });
        }
    }
    catch (error) {
        logger.error('Error identifying contact:', error);
        return res.status(existingContact_helpers_1.ResponseCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
});
exports.identifyHandler = identifyHandler;
