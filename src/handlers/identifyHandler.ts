import { Request, Response } from "express";
import { Contact } from "../model/contactModel";
import { Logger } from "../utils/logger";
import { Op } from "sequelize";
import { ResponseCodes } from "../helpers/identify-helpers";

const logger = new Logger('identifyHandlerLogger');

export const identifyHandler = async (req: Request, res: Response) => {
    const { email, phoneNumber } = req.body;

    try {
        const existingContacts = await Contact.findAll({
            where: {
                [Op.or]: [
                    { phoneNumber },
                    { email }
                ]
            }
        });

        if (existingContacts.length === 0) {
            const newContact = await Contact.create({
                phoneNumber,
                email,
                linkPrecedence: 'primary',
                createdAt: new Date(),
                updatedAt: new Date(),
            } as Contact);
            logger.info(`New Primary Contact Created : ${newContact}`);

            return res.status(ResponseCodes.CREATED).json({
                contact: {
                    primaryContactId: newContact.id,
                    emails: [newContact.email],
                    phoneNumbers: [newContact.phoneNumber],
                    secondaryContactIds: []
                }
            });
        } else {
            let primaryContact = existingContacts.find(contact => contact.linkPrecedence === 'primary') || existingContacts[0];

            // Correctly identifying the hierarchy to determine the real primary contact
            if (primaryContact.linkPrecedence === 'secondary' && primaryContact.linkedId) {
                primaryContact = await Contact.findByPk(primaryContact.linkedId) as Contact;
            }

            const secondaryContacts = existingContacts.filter(contact => contact.linkPrecedence === 'secondary');

            // Check for a mismatch scenario where email belongs to one primary and phoneNumber to another
            const primaryByEmail = existingContacts.find(contact => contact.email === email && contact.linkPrecedence === 'primary');
            const primaryByPhone = existingContacts.find(contact => contact.phoneNumber === phoneNumber && contact.linkPrecedence === 'primary');

            if (primaryByEmail && primaryByPhone && primaryByEmail.id !== primaryByPhone.id) {
                // Update the phone number of primaryByEmail to become secondary of primaryByEmail
                await primaryByPhone.update({
                    linkPrecedence: 'secondary',
                    linkedId: primaryByEmail.id,
                    updatedAt: new Date(),
                });

                secondaryContacts.push(primaryByPhone);
                primaryContact = primaryByEmail;
            }

            if (!(existingContacts.some(contact => contact.email === email) && existingContacts.some(contact => contact.phoneNumber === phoneNumber))) {
                const newContact = await Contact.create({
                    phoneNumber,
                    email,
                    linkPrecedence: 'secondary',
                    linkedId: primaryContact.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                } as Contact);
                secondaryContacts.push(newContact);
                logger.info(`New Secondary Contact Created : ${newContact}`);
            }

            const emails = Array.from(new Set(existingContacts.map(contact => contact.email).concat(email).filter(Boolean)));
            const phoneNumbers = Array.from(new Set(existingContacts.map(contact => contact.phoneNumber).concat(phoneNumber).filter(Boolean)));
            const secondaryContactIds = secondaryContacts.map(contact => contact.id);

            return res.status(ResponseCodes.CREATED).json({
                contact: {
                    primaryContactId: primaryContact.id,
                    emails: emails,
                    phoneNumbers: phoneNumbers,
                    secondaryContactIds: secondaryContactIds
                }
            });
        }
    } catch (error) {
        logger.error('Error identifying contact:', error as Error);
        return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
}