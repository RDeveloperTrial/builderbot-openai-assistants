import { addKeyword } from '@builderbot/bot';
import { getYahooEmails } from "../utils/yahooServices"

const flowYahoo = addKeyword('YahooMail')
    .addAction(async (_, { flowDynamic }) => {
        const emailObjects = await getYahooEmails();

        if (emailObjects && emailObjects.length > 0) {
            for (const email of emailObjects) {
                await flowDynamic(email);
            }
        } else {
            await flowDynamic('📭 No hay correos electrónicos.');
        }
    });

export default flowYahoo;
