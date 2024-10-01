import { addKeyword } from '@builderbot/bot';
import { callExchange } from "../utils/currencyServices"


const flowCurrency = addKeyword('dameCurrency')
    .addAnswer(`Divisa a cambiar: `, { capture: true }, async (ctx, { state }) => {
        await state.update({ div1: ctx.body })
    })
    .addAnswer(`Divisa de destino: `, { capture: true }, async (ctx, { state }) => {
        await state.update({ div2: ctx.body })
    })
    .addAction(async (ctx, { state, flowDynamic }) => {
        const div1 = state.get('div1')
        const div2 = state.get('div2')
        const weather = await callExchange(div1,div2)
        await flowDynamic(weather)

    })

export default flowCurrency
