import { addKeyword } from '@builderbot/bot';
import { getYahooEmails } from "../utils/yahooServices.js"

const flowYahoo = addKeyword('YahooMail')
    .addAction(async (_, { flowDynamic }) => {
        const emailObjects = await getYahooEmails()
        if (emailObjects != undefined) {
            emailObjects.forEach(async email => {
                await flowDynamic(email)
            })
        } else {
            await flowDynamic('No hay correos electrónicos.')
        }

    })

export default flowYahoo
