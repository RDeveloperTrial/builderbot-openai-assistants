import { addKeyword } from '@builderbot/bot';
import { getEmails } from "../utils/gmailServices.js"

const flowEmails = addKeyword('LeermailR')
.addAction( async (_, { flowDynamic }) => {
    const emailObjects = await getEmails(1)
    const emailJSONs = emailObjects.map(item => ({body:`From: ${item.from} \nSubject: ${item.subject} \nSnippet: ${item.snippet}`}))
    await flowDynamic(emailJSONs)
  })

export default flowEmails
