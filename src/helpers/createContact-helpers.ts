import { Contact } from "../model/contactModel";

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

export const createSecondaryContact = async (primaryContact: Contact, phoneNumber: string, email: string): Promise<Contact> => {
    const newContact = await Contact.create({
      phoneNumber,
      email,
      linkPrecedence: 'secondary',
      linkedId: primaryContact.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Contact);
    return newContact;
  };