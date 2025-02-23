import { addKeyword } from '@builderbot/bot';
import { retrieveProductDetails } from "../utils/amazonServices"

const flowAmazonDetail = addKeyword('dameProducto')
    .addAnswer(`ASIN: `, { capture: true }, async (ctx, { state }) => {
        await state.update({ asin: ctx.body })
    })

    .addAction(async (ctx, { state, flowDynamic }) => {
        const productASIN = state.get('asin')
        const result = await retrieveProductDetails(productASIN)
        if (result != undefined) {

                await flowDynamic(formatTextDetail(result))

        } else
            await flowDynamic('No se han podido encontrar productos. Por favor prueba con otros términos de búsqueda')
    })


function formatTextDetail(detail) {
    //📝📊✔️❓☑️➕❇️
    return `
    *📝${detail.product_description}*

    ❓${detail.about_product}

    📊${JSON.stringify(detail.product_information).replaceAll(',','\n').replaceAll('"','').replaceAll(":",": ")} 
  `;

}

export default flowAmazonDetail
