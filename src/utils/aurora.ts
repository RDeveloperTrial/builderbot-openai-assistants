import axios from 'axios';

// URL de la API de NOAA para obtener el índice Kp (actividad geomagnética)
const url = 'https://services.swpc.noaa.gov/json/planetary_k_index_1m.json';

// Función para obtener la predicción en tiempo real para auroras
async function obtenerDatosAurora() {
    try {

        const response = await axios.get(url);

        // Con el primer elemento obtenemos el índice en el momento actual
        const datos = response.data[0];
        const kpIndex = datos.kp_index;

        // Construir el texto con la información deseada
        const intro = `Índice Kp actual: *${kpIndex}*`;

        const auroraArray = [];
        auroraArray.push(intro)

        // Dependiendo del valor del índice Kp, extendemos el texto con la probabilidad de auroras
        if (kpIndex >= 5) {
            auroraArray.push('¡Alta probabilidad de auroras boreales!');
        } else if (kpIndex >= 3) {
            auroraArray.push('Probabilidad moderada de auroras boreales.');
        } else {
            auroraArray.push('Baja probabilidad de auroras boreales.');
        }


    return auroraArray;

} catch (error) {
    console.error('Error al obtener los datos de la API:', error);
    return null;
}


};

export { obtenerDatosAurora }


