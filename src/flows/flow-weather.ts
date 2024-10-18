import { addKeyword } from '@builderbot/bot';
import { getWeatherByCity } from "../utils/weatherServices"


const flowWeather = addKeyword('dameWeather')
    .addAnswer(`Localización: `, { capture: true }, async (ctx, { state }) => {
        await state.update({ city: ctx.body })
    })
    .addAction(async (ctx, { state, flowDynamic }) => {
        const city = state.get('city')
        const weather = await getWeatherByCity(city)
        if (weather != undefined) {
            await flowDynamic(weather)
        } else
            await flowDynamic('No se han podido encontrar las coordenadas de la ciudad especificada. Por favor prueba con otros términos de búsqueda')

    })

export default flowWeather
