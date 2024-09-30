import { addKeyword } from '@builderbot/bot';
import { getForecastByCity } from "../utils/weatherServices"


const flowForecast = addKeyword('dameForecast')
    .addAnswer(`Localización: `, { capture: true }, async (ctx, { state }) => {
        await state.update({ city: ctx.body })
    })
    .addAction(async (ctx, { state, flowDynamic }) => {
        const city = state.get('city')
        const forecastObjects = await getForecastByCity(city)
        forecastObjects.forEach(async obj => {
            await flowDynamic(obj)
        })
        
    })

export default flowForecast
