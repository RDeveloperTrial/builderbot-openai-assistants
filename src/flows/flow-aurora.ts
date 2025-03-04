import { addKeyword } from '@builderbot/bot';
import { obtenerDatosAurora } from "../utils/aurora"


const flowAurora = addKeyword('dameAurora')
    /*** .addAnswer(`Localización: `, { capture: true }, async (ctx, { state }) => {
        await state.update({ city: ctx.body })
    }) TODO: buscar otra API que ofrezca datos específicos según ubicación ***/
    .addAction(async (ctx, { state, flowDynamic }) => {
        //const city = state.get('city')
        const aurora = await obtenerDatosAurora()
        if (aurora != undefined) {
            await flowDynamic(aurora)
        } else
            await flowDynamic('No se han podido encontrar los datos para la ciudad especificada. Por favor prueba con otros términos de búsqueda')

    })

export default flowAurora