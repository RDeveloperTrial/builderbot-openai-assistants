import { addKeyword } from '@builderbot/bot';
import { getYahooEmails } from "../utils/yahooServices.js"

const flowYahoo = addKeyword('YahooMail')
    .addAction(async (_, { flowDynamic }) => {
        const emailObjects = await getYahooEmails()
        emailObjects.forEach(async email => {
            await flowDynamic(email)
        })

    })

export default flowYahoo
