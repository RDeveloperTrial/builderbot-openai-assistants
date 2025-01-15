import { addKeyword } from '@builderbot/bot';
import { getArticle } from "../utils/webCrawler"


const flowWeb = addKeyword('dameArticulo')
    .addAnswer(`URL: `, { capture: true }, async (ctx, { state }) => {
        await state.update({ url: ctx.body })
    })
    .addAction(async (ctx, { state, flowDynamic }) => {
        const url = state.get('url')
        const articleRaw = await getArticle(url)
        
        if (articleRaw !== undefined) {
            await flowDynamic(articleRaw)
        } else
            await flowDynamic('No se han podido encontrar el texto del artículo')
    })

export default flowWeb
