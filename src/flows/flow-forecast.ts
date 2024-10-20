import { addKeyword } from '@builderbot/bot';
import { getForecastByCity } from "../utils/weatherServices"


const flowForecast = addKeyword('dameForecast')
    .addAnswer(`Localización: `, { capture: true }, async (ctx, { state }) => {
        await state.update({ city: ctx.body })
    })
    .addAction(async (ctx, { state, flowDynamic }) => {
        const city = state.get('city')
        const forecastObjects = await getForecastByCity(city)
        if (forecastObjects != undefined) {
            for (const obj of forecastObjects){ //For of instead of forEach allows for the text flow to be in order
                await flowDynamic(obj)
            }
        } else
            await flowDynamic('No se han podido encontrar las coordenadas de la ciudad especificada. Por favor prueba con otros términos de búsqueda')
        
        
    })

export default flowForecast
