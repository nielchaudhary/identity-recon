import { Request, Response } from "express";
import { Contact } from "../model/contactModel";
import { Logger } from "../utils/logger";
import { Op } from "sequelize";
import { ResponseCodes, findPrimaryContact } from "../helpers/existingContact-helpers";
import { handleMismatchedPrimaryContacts, getUniqueEmailsAndPhoneNumbers } from "../helpers/helper-functions";
import { createSecondaryContact } from "../helpers/createContact-helpers";

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
        const primaryContact = await findPrimaryContact(existingContacts);
        const secondaryContacts = await handleMismatchedPrimaryContacts(existingContacts, email, phoneNumber);
  
        if (!(existingContacts.some(contact => contact.email === email) && existingContacts.some(contact => contact.phoneNumber === phoneNumber))) {
          const newSecondaryContact = await createSecondaryContact(primaryContact, phoneNumber, email);
          secondaryContacts.push(newSecondaryContact);
          logger.info(`New Secondary Contact Created : ${newSecondaryContact}`);
        }
  
        const { emails, phoneNumbers } = getUniqueEmailsAndPhoneNumbers(existingContacts, email, phoneNumber);
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
  };


  