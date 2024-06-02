import { Op } from "sequelize";
import { Contact } from "../model/contactModel";

export enum ResponseCodes {
    OK = 200,
    CREATED = 201,
    INTERNAL_SERVER_ERROR = 500,
    CONFLICT = 409
}


export const findExistingContacts = async (email: string, phoneNumber: string) => {
    return await Contact.findAll({
        where: {
            [Op.or]: [
                { phoneNumber },
                { email }
            ]
        }
    });
};

export const createContact = async (email: string, phoneNumber: string, linkPrecedence: 'primary' | 'secondary', linkedId: number | null = null) => {
    return await Contact.create({
        phoneNumber,
        email,
        linkPrecedence,
        linkedId,
        createdAt: new Date(),
        updatedAt: new Date(),
    } as Contact);
};

export const updateContactToSecondary = async (contact: Contact, linkedId: number) => {
    return await contact.update({
        linkPrecedence: 'secondary',
        linkedId,
        updatedAt: new Date(),
    });
};

export const getPrimaryContact = async (contacts: Contact[]) => {
    let primaryContact = contacts.find(contact => contact.linkPrecedence === 'primary') || contacts[0];

    if (primaryContact.linkPrecedence === 'secondary' && primaryContact.linkedId) {
        primaryContact = await Contact.findByPk(primaryContact.linkedId) as Contact;
    }

    return primaryContact;
};

export const checkForMismatchedPrimaries = (contacts: Contact[], email: string, phoneNumber: string) => {
    const primaryByEmail = contacts.find(contact => contact.email === email && contact.linkPrecedence === 'primary');
    const primaryByPhone = contacts.find(contact => contact.phoneNumber === phoneNumber && contact.linkPrecedence === 'primary');

    return { primaryByEmail, primaryByPhone };
};

