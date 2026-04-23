import { addKeyword } from '@builderbot/bot';
import { searchAmazonProducts } from "../utils/amazonServices"

const flowAmazon = addKeyword('deditofeliz')
    .addAnswer(`Tienda (US o ES): `, { capture: true }, async (ctx, { state }) => {
        await state.update({ tienda: ctx.body })
    })
    .addAnswer(`Términos de búsqueda: `, { capture: true }, async (ctx, { state }) => {
        await state.update({ termino: ctx.body })
    })
    .addAnswer(`Número de página: `, { capture: true }, async (ctx, { state }) => {
        await state.update({ pagina: ctx.body })
    })

    .addAction(async (ctx, { state, flowDynamic }) => {
        const tienda = state.get('tienda')
        const termino = state.get('termino')
        const pagina = state.get('pagina')
        const results = await searchAmazonProducts(termino, tienda, pagina)
        if (results != undefined) {
            for (const product of results) {
                await flowDynamic(formatTextProduct(product))
            }
        } else
            await flowDynamic('No se han podido encontrar productos. Por favor prueba con otros términos de búsqueda')
    })


function formatTextProduct(product) {
    //( ${product.asin} ) Ya viene al final de la url del producto
    return `----------------------------
    💵 *${product.precio}* 

    *${product.titulo}* 
    
    *${product.calificación}* ⭐️ ( ${product.numopiniones} opiniones )
    
    ${product.url}
    ----------------------------`;

}

export default flowAmazon
