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
            return res.status(201).json({
                contact: {
                    primaryContactId: newContact.id,
                    emails: [newContact.email],
                    phoneNumbers: [newContact.phoneNumber],
                    secondaryContactIds: []
                }
            });
        }
        else {
            let primaryContact = existingContacts.find(contact => contact.linkPrecedence === 'primary') || existingContacts[0];
            // Correctly identifying the hierarchy to determine the real primary contact
            if (primaryContact.linkPrecedence === 'secondary' && primaryContact.linkedId) {
                primaryContact = (yield contactModel_1.Contact.findByPk(primaryContact.linkedId));
            }
            const secondaryContacts = existingContacts.filter(contact => contact.linkPrecedence === 'secondary');
            // Check for a mismatch scenario where email belongs to one primary and phoneNumber to another
            const primaryByEmail = existingContacts.find(contact => contact.email === email && contact.linkPrecedence === 'primary');
            const primaryByPhone = existingContacts.find(contact => contact.phoneNumber === phoneNumber && contact.linkPrecedence === 'primary');
            if (primaryByEmail && primaryByPhone && primaryByEmail.id !== primaryByPhone.id) {
                // Update the phone number of primaryByEmail to become secondary of primaryByEmail
                yield primaryByPhone.update({
                    linkPrecedence: 'secondary',
                    linkedId: primaryByEmail.id,
                    updatedAt: new Date(),
                });
                secondaryContacts.push(primaryByPhone);
                primaryContact = primaryByEmail;
            }
            if (!(existingContacts.some(contact => contact.email === email) && existingContacts.some(contact => contact.phoneNumber === phoneNumber))) {
                const newContact = yield contactModel_1.Contact.create({
                    phoneNumber,
                    email,
                    linkPrecedence: 'secondary',
                    linkedId: primaryContact.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                secondaryContacts.push(newContact);
                logger.info(`New Secondary Contact Created : ${newContact}`);
            }
            const emails = Array.from(new Set(existingContacts.map(contact => contact.email).concat(email).filter(Boolean)));
            const phoneNumbers = Array.from(new Set(existingContacts.map(contact => contact.phoneNumber).concat(phoneNumber).filter(Boolean)));
            const secondaryContactIds = secondaryContacts.map(contact => contact.id);
            return res.status(200).json({
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
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.identifyHandler = identifyHandler;
