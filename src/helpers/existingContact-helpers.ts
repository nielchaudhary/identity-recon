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

export const findPrimaryContact = async (existingContacts: Contact[]): Promise<Contact> => {
    let primaryContact = existingContacts.find(contact => contact.linkPrecedence === 'primary') || existingContacts[0];
  
    if (primaryContact.linkPrecedence === 'secondary' && primaryContact.linkedId) {
      primaryContact = await Contact.findByPk(primaryContact.linkedId) as Contact;
    }
  
    return primaryContact;
  };


export const findSecondaryContacts = (existingContacts: Contact[]): Contact[] => {
    return existingContacts.filter(contact => contact.linkPrecedence === 'secondary');
  };



export const updateContactToSecondary = async (contact: Contact, linkedId: number) => {
    return await contact.update({
        linkPrecedence: 'secondary',
        linkedId,
        updatedAt: new Date(),
    });
};


export const checkForMismatchedPrimaries = (contacts: Contact[], email: string, phoneNumber: string) => {
    const primaryByEmail = contacts.find(contact => contact.email === email && contact.linkPrecedence === 'primary');
    const primaryByPhone = contacts.find(contact => contact.phoneNumber === phoneNumber && contact.linkPrecedence === 'primary');

    return { primaryByEmail, primaryByPhone };
};


