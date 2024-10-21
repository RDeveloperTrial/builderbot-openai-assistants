import { addKeyword } from '@builderbot/bot';
import { getOneWayFlights } from "../utils/flightServices"
import moment from 'moment-timezone'; 

const RESULTS_LIMIT = 30

const flowFlights = addKeyword('buscaVuelo')
    .addAnswer(`Origen: `, { capture: true }, async (ctx, { state }) => {
        await state.update({ origin: ctx.body })
    })
    .addAnswer(`Destino: `, { capture: true }, async (ctx, { state }) => {
        await state.update({ destination: ctx.body })
    })
    .addAnswer(`Fecha (YYYY-MM-DD): `, { capture: true }, async (ctx, { state }) => {
        await state.update({ date: ctx.body })
    })
    .addAction(async (ctx, { state, flowDynamic }) => {
        const origin = state.get('origin')
        const destination = state.get('destination')
        const date = state.get('date')
        const information = await getOneWayFlights(origin, destination, date)
        if (information != undefined) {
            let count = RESULTS_LIMIT
            for (const flight of information) {
                if (count > 0) {
                    await flowDynamic(formatText(flight))
                    count--
                }
            }
        } else
            await flowDynamic('No se han podido encontrar vuelos. Por favor prueba con otros términos de búsqueda')
    })


function formatText(information) {
    const dateDeparture = new Date(information.salida);
    const dateArrival = new Date(information.llegada)

    let stopsText = ""
    const baseText = `--------------------
    *Origen:* ${information.origen} ${moment(dateDeparture).format("HH:mm")}
    *Destino:* ${information.destino} ${moment(dateArrival).format("HH:mm")}
    *Duración:* ${information.duración} mins
    
    *${information.compañía}*
    Precio: *${information.precio}*
            `
    if (information.paradas) {
        stopsText += "Paradas:\n";
        for (const stop of information.stops) {
            stopsText += `
        *${stop.origin}* (${moment(stop.departure).format('MMM Do, *h:mm*')})
        *${stop.destination}* (${moment(stop.arrival).format('MMM Do, *h:mm*')})
        `
        }

    } else {
        stopsText += "Vuelo directo"
    }
   /* const detailsText = `
    Horario de salida: ${information.salida}
    
    Horario de llegada: ${information.llegada}
    
    
    `*/

    return `${baseText}
    ${stopsText}`;
}

export default flowFlights
