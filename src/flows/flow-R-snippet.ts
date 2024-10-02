import { addKeyword } from '@builderbot/bot';
import { getEmails } from "../utils/gmailServices.js"

const flowEmailsR = addKeyword('LeermailR')
.addAction( async (_, { flowDynamic }) => {
    const emailObjects = await getEmails(1)
    if (emailObjects != undefined) {
      const emailJSONs = emailObjects.map(item => 
        ({body:`
      📧 *${item.from}*
      -----------------------------
      *${item.subject}*
      -----------------------------
      ${item.snippet}
  
      `}))
      await flowDynamic(emailJSONs)
    } else {
      await flowDynamic('No hay correos electrónicos.')
    }
    
  })

export default flowEmailsR
