import { addKeyword } from '@builderbot/bot';
import { getWeatherByCity } from "../utils/weatherServices"


const flowWeather = addKeyword('dameWeather')
    .addAnswer(`Localización: `, { capture: true }, async (ctx, { state }) => {
        await state.update({ city: ctx.body })
    })
    .addAction(async (ctx, { state, flowDynamic }) => {
        const city = state.get('city')
        const weather = await getWeatherByCity(city)
        await flowDynamic(weather)

    })

export default flowWeather
