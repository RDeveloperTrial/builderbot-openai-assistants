import { addKeyword } from '@builderbot/bot';
import { searchAmazonProducts } from "../utils/amazonServices"

const flowAmazon = addKeyword('deditofeliz')
    .addAnswer(`Términos de búsqueda: `, { capture: true }, async (ctx, { state }) => {
        await state.update({ termino: ctx.body })
    })
    .addAnswer(`Número de página: `, { capture: true }, async (ctx, { state }) => {
        await state.update({ pagina: ctx.body })
    })

    .addAction(async (ctx, { state, flowDynamic }) => {
        const termino = state.get('termino')
        const pagina = state.get('pagina')
        const results = await searchAmazonProducts(termino, pagina)
        if (results != undefined) {
            for (const product of results) {
                await flowDynamic(formatText(product))
            }
        } else
            await flowDynamic('No se han podido encontrar productos. Por favor prueba con otros términos de búsqueda')
    })


function formatText(product) {

    return `----------------------------
    💵 *${product.precio}* 

    *${product.titulo}*
    
    *${product.calificación}* ⭐️
    ${product.numopiniones} opiniones
    
    ${product.entrega}
    ${product.url}
    ----------------------------`;

}

export default flowAmazon
