import { google } from 'googleapis';

import 'dotenv/config';

const REDIRECT_URI = process.env.REDIRECT_URI;
let CLIENT_ID = process.env.CLIENT_ID;
let CLIENT_SECRET = process.env.CLIENT_SECRET;
let REFRESH_TOKEN = process.env.REFRESH_TOKEN;

/**
 * Returns an array of email objects that meet a certain criteria 
 * @param appClient Integer number determining which user is requesting de email retrieval
 * @returns Array of objects
 */
async function getEmails(appClient) {
    /** User selection (via appClient argument) **/
    if (appClient == 2) {
        CLIENT_ID = process.env.CLIENT_ID_2;
        CLIENT_SECRET = process.env.CLIENT_SECRET_2;
        REFRESH_TOKEN = process.env.REFRESH_TOKEN_2;

    } else {
        CLIENT_ID = process.env.CLIENT_ID;
        CLIENT_SECRET = process.env.CLIENT_SECRET;
        REFRESH_TOKEN = process.env.REFRESH_TOKEN;
    }

    /** Authentication process */
    const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    /**
     * Email search criteria
     * for more search operators visit: https://support.google.com/mail/answer/7190?sjid=15384977441487891906-EU   
     */
    const query = 'in:inbox is:unread -category:social -category:promotions';
    
    /** Extract emails given a search criteria **/
    try {
        /** Retrieve email IDs */
        const res = await gmail.users.messages.list({
            userId: 'me',
            q: query
        });

        const messages = res.data.messages || [];
        const emailArray = [];

        /** Retrieve email content (given the ID extracted previously) */
        for (const message of messages) {
            const messageId = message.id;
            const msgRes = await gmail.users.messages.get({
                userId: 'me',
                id: messageId,
            });

            /** Extract the desired info from the email */
            const emailData = msgRes.data;
            const headers = emailData.payload.headers;
            const from = headers.find(header => header.name === 'From')?.value;
            const subject = headers.find(header => header.name === 'Subject')?.value;
            const snippet = emailData.snippet;
            
            /** Build an email object containing the desired info */
            const emailObj = {
                from: from || 'No sender',
                subject: subject || 'No subject',
                snippet: snippet || 'No snippet',
            };
            
            /** Add email object to an array of email objects */
            emailArray.push(emailObj);
        }
        
        return emailArray;

    } catch (err) {
        console.error('Error fetching emails:', err);
        return [];
    }
}

export {
    getEmails
};