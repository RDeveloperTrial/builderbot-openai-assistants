import axios from 'axios';


const RAPIDAPI_KEY = process.env.FLIGHTS_RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'sky-scanner3.p.rapidapi.com';

const flightsFormatted = []

async function getOneWayFlights(fromEntityId, toEntityId, departureDate) {
    try {
        const options = {
            method: 'GET',
            url: `https://${RAPIDAPI_HOST}/flights/search-one-way`,
            params: {
                fromEntityId: fromEntityId,      // Código IATA del origen (por ejemplo: 'PARI' para París)
                toEntityId: toEntityId,          // Código IATA del destino (por ejemplo: 'LON' para Londres)
                departDate: departureDate,    // Fecha de salida (ejemplo: '2024-11-15')
                cabinClass: 'economy',           // Clase de cabina ('economy', 'business', etc.)
                adults: '1',                     // Número de pasajeros adultos
                currency: 'USD',                  // Moneda de los precios
                stops: 'direct, 1stop'
            },
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': RAPIDAPI_HOST
            }
        };

        const response = await axios.request(options);
        let flights
        try {
            flights = response.data.data.itineraries;
        } catch (error) {
            console.error('Error al obtener vuelos:', error);
        }
        

        if (!flights || flights.length === 0) {
            console.log('No se encontraron vuelos.');
            return;
        }

        flights.forEach((flight) => {
            formatFlight(flight);
        });

        return flightsFormatted;

    } catch (error) {
        console.error('Error al obtener vuelos:', error);
    }
}

function formatFlight(rawFlight) {

    const flight = Object.create({})


    flight.origen = rawFlight.legs[0].origin.displayCode
    flight.destino = rawFlight.legs[0].destination.displayCode
    flight.duración = rawFlight.legs[0].durationInMinutes

    // Mostrar paradas si el vuelo no es directo
    if (rawFlight.legs[0].stopCount != 0) {
        flight.paradas = true

        const stops = []
        rawFlight.legs[0].segments.forEach((stop) => {
            const stopObj = Object.create({})
            stopObj.origin = stop.origin.displayCode
            stopObj.departure = stop.departure
            stopObj.destination = stop.destination.displayCode
            stopObj.arrival = stop.arrival
            stops.push(stopObj)

            flight.stops = stops
        });
    } else {
        flight.paradas = false
    }

    flight.salida = rawFlight.legs[0].departure
    flight.llegada = rawFlight.legs[0].arrival
    flight.compañía = rawFlight.legs[0].carriers.marketing[0].name
    flight.precio = rawFlight.price.formatted
    /*
    console.log(`Horario de salida: ${rawFlight.legs[0].departure}`);
    console.log(`Horario de llegada: ${rawFlight.legs[0].arrival}`);
    console.log(`Compañía operadora: ${rawFlight.legs[0].carriers.marketing[0].name}`);
    console.log(`Precio total: ${rawFlight.price.formatted} `);*/

    flightsFormatted.push(flight);

}

export { getOneWayFlights }
