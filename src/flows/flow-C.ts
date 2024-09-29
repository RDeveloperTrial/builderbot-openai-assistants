import { addKeyword } from '@builderbot/bot';
import { getEmails } from "../utils/gmailServices.js"

const flowEmails = addKeyword('LeermailC')
  .addAction( async (_, { flowDynamic }) => {
    const emailObjects = await getEmails(2)
    const emailJSONs = emailObjects.map(item => 
      ({body:`
    📧 *${item.from}*
    -----------------------------
    *Asunto*: ${item.subject}
    -----------------------------
    *Resumen*: ${item.snippet}

    `}))   
    await flowDynamic(emailJSONs)
  })

export default flowEmails
