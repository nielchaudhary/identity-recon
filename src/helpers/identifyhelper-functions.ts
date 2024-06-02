import { Contact } from "../model/contactModel";
import { Logger } from "../utils/logger";
import { checkForMismatchedPrimaries, createContact, getPrimaryContact, updateContactToSecondary } from "./identify-helpers";

const logger = new Logger('identifyHandlerLogger');

export enum ResponseCodes {
    OK = 200,
    CREATED = 201,
    INTERNAL_SERVER_ERROR = 500,
    CONFLICT = 409
}

export const handleNewContact = async (email: string, phoneNumber: string) => {
    const newContact = await createContact(email, phoneNumber, 'primary');
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
};

export const handleExistingContacts = async (existingContacts: Contact[], email: string, phoneNumber: string) => {
    let primaryContact = await getPrimaryContact(existingContacts);
    const secondaryContacts = existingContacts.filter(contact => contact.linkPrecedence === 'secondary');

    const { primaryByEmail, primaryByPhone } = checkForMismatchedPrimaries(existingContacts, email, phoneNumber);

    if (primaryByEmail && primaryByPhone && primaryByEmail.id !== primaryByPhone.id) {
        await updateContactToSecondary(primaryByPhone, primaryByEmail.id);
        secondaryContacts.push(primaryByPhone);
        primaryContact = primaryByEmail;
    }

    const contactExists = existingContacts.some(contact => contact.email === email && contact.phoneNumber === phoneNumber);

    if (contactExists) {
        logger.info(`Contact already exists with email: ${email} and phone number: ${phoneNumber}`);
        return {
            status: ResponseCodes.CONFLICT,
            response: {
                message: `Contact already exists with [email: ${email}] and [phone number: ${phoneNumber}]`
            }
        };
    }
    

    const newContact = await createContact(email, phoneNumber, 'secondary', primaryContact.id);
    secondaryContacts.push(newContact);
    logger.info(`New Secondary Contact Created : ${newContact}`);

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
};


