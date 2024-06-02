import { Request, Response } from "express";
import { findExistingContacts } from "../helpers/identify-helpers";
import { ResponseCodes, handleExistingContacts, handleNewContact } from "../helpers/identifyhelper-functions";


export  const identifyHandler = async (req: Request, res: Response) => {
    const { email, phoneNumber } = req.body;

    try {
        const existingContacts = await findExistingContacts(email, phoneNumber);

        let result;
        if (existingContacts.length === 0) {
            result = await handleNewContact(email, phoneNumber);
        } else {
            result = await handleExistingContacts(existingContacts, email, phoneNumber);
        }

        return res.status(result.status).json(result.response);

    } catch (error) {
        return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};
