import { Contact } from "../model/contactModel";
import { findSecondaryContacts } from "./existingContact-helpers";

export const getUniqueEmailsAndPhoneNumbers = (existingContacts: Contact[], email: string, phoneNumber: string): { emails: string[]; phoneNumbers: string[] } => {
    const emails = Array.from(new Set(existingContacts.map(contact => contact.email).concat(email).filter(Boolean))).map(email => email as string);
    const phoneNumbers = Array.from(new Set(existingContacts.map(contact => contact.phoneNumber).concat(phoneNumber).filter(Boolean))).map(phoneNumber => phoneNumber as string);
    return { emails, phoneNumbers };
  };

  export const handleMismatchedPrimaryContacts = async (existingContacts: Contact[], email: string, phoneNumber: string): Promise<Contact[]> => {
    const primaryByEmail = existingContacts.find(contact => contact.email === email && contact.linkPrecedence === 'primary');
    const primaryByPhone = existingContacts.find(contact => contact.phoneNumber === phoneNumber && contact.linkPrecedence === 'primary');
  
    if (primaryByEmail && primaryByPhone && primaryByEmail.id !== primaryByPhone.id) {
      await primaryByPhone.update({
        linkPrecedence: 'secondary',
        linkedId: primaryByEmail.id,
        updatedAt: new Date(),
      });
  
      const secondaryContacts = findSecondaryContacts(existingContacts);
      secondaryContacts.push(primaryByPhone);
      return secondaryContacts;
    }
  
    return findSecondaryContacts(existingContacts);
  };

