import { addKeyword } from '@builderbot/bot';
import { getEmails } from "../utils/gmailServices.js"

const flowEmails = addKeyword('LeermailR')
.addAction( async (_, { flowDynamic }) => {
    const emailObjects = await getEmails(1)
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
