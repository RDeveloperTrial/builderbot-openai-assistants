//*** Documentación: 
// https://rapidapi.com/principalapis/api/currency-conversion-and-exchange-rates */
import axios from 'axios';

const EXCHANGE_RATE_API_URL = 'https://currency-conversion-and-exchange-rates.p.rapidapi.com/latest';

// Reemplaza estos valores con tu información de RapidAPI
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'currency-conversion-and-exchange-rates.p.rapidapi.com';

// Función para obtener la tasa de cambio USD-EUR desde RapidAPI
async function getExchangeRate(div1, div2) {
  try {
    const response = await axios.get(EXCHANGE_RATE_API_URL, {
      params: {
        base: div1,
        symbols: div2
      },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST
      }
    });

    const exchangeData = response.data;

    // Comprobamos si la API devuelve el tipo de cambio correctamente
    if (exchangeData.rates && exchangeData.rates[div2]) {
      const rate = exchangeData.rates[div2];
      console.log(`El tipo de cambio actual de ${div1} a ${div2} es: ${rate}`);
      return rate;
    } else {
      throw new Error('No se pudo obtener la tasa de cambio.');
    }
  } catch (error) {
    // Manejo de errores en la solicitud
    return `Error al obtener la tasa de cambio:  ${error.message}`;
  }
}

// Función principal para invocar la obtención de tasa de cambio y otras funcionalidades
async function callExchange(div1, div2) {
  const exchangeRate = await getExchangeRate(div1.toUpperCase(), div2.toUpperCase());
  
  if (exchangeRate !== null) {
    return `Tasa de cambio ${div1.toUpperCase()}-${div2.toUpperCase()}: ${exchangeRate}`;
  } else {
    return 'No se pudo obtener la tasa de cambio.';
  }
}

export { callExchange };
