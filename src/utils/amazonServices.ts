//*** Documentación: 
// https://rapidapi.com/letscrape-6bRBa3QguO5/api/real-time-amazon-data */
import axios from 'axios';

const AMAZON_RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'real-time-amazon-data.p.rapidapi.com';

// Función para buscar productos en Amazon US o ES
async function searchAmazonProducts(query, country, page) {
    // 1. Validación de país: Solo permitimos US o ES
    const validCountries = ['US', 'ES'];
    const selectedCountry = country?.toUpperCase();

    if (!validCountries.includes(selectedCountry)) {
        throw new Error(`País no soportado. Por favor usa: ${validCountries.join(', ')}`);
    }

    // 2. Validación de búsqueda
    if (!query) {
        console.warn('El término de búsqueda está vacío.');
        return [];
    }

    try {
        const options = {
            method: 'GET',
            url: `https://${RAPIDAPI_HOST}/search`,
            params: {
                query: query,
                country: selectedCountry, // Dinámico según el parámetro
                page: page
            },
            headers: {
                'X-RapidAPI-Key': AMAZON_RAPIDAPI_KEY,
                'X-RapidAPI-Host': RAPIDAPI_HOST
            }
        };

        const response = await axios.request(options);
        const products = response.data.data.products;

        if (!products || products.length === 0) {
            console.log(`No se encontraron productos en Amazon ${selectedCountry}.`);
            return [];
        }

        // 3. Limitar a 5 resultados y formatear
        // Usamos .slice(0, 5) para tomar solo los primeros 5 elementos
        const productsArray = products.slice(0, 5).map((product, index) => {
            return {
                index: index,
                asin: product.asin,
                titulo: product.product_title,
                precio: product.product_price,
                url: product.product_url,
                calificación: product.product_star_rating,
                numopiniones: product.product_num_ratings,
                tienda: selectedCountry // De momento no se usa, pero lo guardamos por si queremos mostrarlo luego
            };
        });

        return productsArray;

    } catch (error) {
        console.error(`Error al buscar productos en Amazon ${selectedCountry}:`, error.message);
        throw error;
    }
}

//Función para buscar los detalles de un producto dado su identificador ASIN
async function retrieveProductDetails(productASIN) {
    try {
        const options = {
            method: 'GET',
            url: `https://${RAPIDAPI_HOST}/product-details`,
            params: {
                asin: productASIN,        // El ID del producto 
                country: 'US'
            },
            headers: {
                'X-RapidAPI-Key': AMAZON_RAPIDAPI_KEY,
                'X-RapidAPI-Host': RAPIDAPI_HOST
            }
        };

        const response = await axios.request(options);

        const details = response.data.data;
        console.log(response.data)
        if (!details || details.length === 0) {
            console.log('No se encontraron detalles del producto.');
            return;
        }

        return details
    } catch (error) {
        console.error('Error al buscar detalles del producto en Amazon:', error);
    }
}




export { searchAmazonProducts, retrieveProductDetails }