import { addKeyword } from '@builderbot/bot';
import { getEmails } from "../utils/gmailServices.js"

const flowEmailsCFull = addKeyword('FullmailC')
  .addAction( async (_, { flowDynamic }) => {
    const emailObjects = await getEmails(2)
    const emailJSONs = emailObjects.map(item => 
      ({body:`
    📧 *${item.from}*
    -----------------------------
    *${item.subject}*
    -----------------------------
    ${item.body}

    `}))   
    await flowDynamic(emailJSONs)
  })

export default flowEmailsCFull
