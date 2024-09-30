import { addKeyword } from '@builderbot/bot';
import { getEmails } from "../utils/gmailServices.js"

const flowEmailsC = addKeyword('LeermailC')
  .addAction( async (_, { flowDynamic }) => {
    const emailObjects = await getEmails(2)
    const emailJSONs = emailObjects.map(item => 
      ({body:`
    📧 *${item.from}*
    -----------------------------
    *${item.subject}*
    -----------------------------
    ${item.snippet}

    `}))   
    await flowDynamic(emailJSONs)
  })

export default flowEmailsC
