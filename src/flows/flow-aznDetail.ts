import { addKeyword } from '@builderbot/bot';
import { retrieveProductDetails } from "../utils/amazonServices"

const flowAmazonDetail = addKeyword('dameProducto')
    .addAnswer(`ASIN: `, { capture: true }, async (ctx, { state }) => {
        await state.update({ asin: ctx.body })
    })
    .addAnswer(`Tienda (US o ES): `, { capture: true }, async (ctx, { state }) => {
        await state.update({ tienda: ctx.body })
    })

    .addAction(async (ctx, { state, flowDynamic }) => {
        const productASIN = state.get('asin')
        const tienda = state.get('tienda')
        const result = await retrieveProductDetails(productASIN, tienda)
        if (result != undefined) {
            const { text, photos } = formatDetails(result);

            // 1. Enviamos primero el texto informativo
            await flowDynamic(text);

            // 2. Enviamos todas las fotos disponibles
            if (photos.length > 0) {
                for (const photoUrl of photos) {
                    await flowDynamic([{ media: photoUrl }]);
                }
            }

        } else
            await flowDynamic('No se han podido obtener los detalles de este producto. Por favor prueba con otros términos de búsqueda')
    })




function formatDetails(detail) {
    //📝📊✔️❓☑️➕❇️

    const infoTecnica = detail.product_information 
        ? Object.entries(detail.product_information)
            .map(([key, value]) => {
                // Convertimos a String y limpiamos espacios si es texto
                const cleanKey = String(key).trim();
                const cleanValue = String(value).trim();
                return `🔹 *${cleanKey}:* ${cleanValue}`;
            })
            .join('\n')
        : 'No disponible';



        const text = `*🛍️ ${detail.product_title}*\n\n` +
            `💰 *PRECIO:* ${detail.product_price}\n` +
            `────────────\n\n` +
            `🔍 *Descripción:* ${detail.product_description || 'No disponible'}\n\n` +
            `💡 *Sobre este producto:*\n${detail.about_product || 'No disponible'}\n\n` +
            `📊 *Información técnica:*\n${infoTecnica}`;

        const photos = detail.product_photos || [];



    return { text, photos };

}

export default flowAmazonDetail
