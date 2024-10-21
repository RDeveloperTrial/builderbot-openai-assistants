import axios from 'axios';

const AMAZON_RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'real-time-amazon-data.p.rapidapi.com';

// Función para buscar productos en Amazon US
async function searchAmazonProducts(query, page) {
    try {
        const options = {
            method: 'GET',
            url: `https://${RAPIDAPI_HOST}/search`,
            params: {
                query: query,        // El término de búsqueda (producto, marca, etc.)
                country: 'US',       // Mercado de Amazon (US para Amazon en Estados Unidos)
                page: page           // Número de página de los resultados de búsqueda
            },
            headers: {
                'X-RapidAPI-Key': AMAZON_RAPIDAPI_KEY,
                'X-RapidAPI-Host': RAPIDAPI_HOST
            }
        };

        const response = await axios.request(options);
        const products = response.data.data.products;

        if (!products || products.length === 0) {
            console.log('No se encontraron productos.');
            return;
        }

        const productsArray = []
        products.forEach((product, index) => {
            const productObj = Object.create({})
            productObj.index = index
            productObj.titulo = product.product_title
            productObj.precio = product.product_price
            productObj.url = product.product_url
            productObj.calificación = product.product_star_rating
            productObj.numopiniones = product.product_num_ratings
            productObj.entrega = product.delivery

            productsArray.push(productObj)
        })

        return productsArray
    } catch (error) {
        console.error('Error al buscar productos en Amazon:', error);
    }
}

export { searchAmazonProducts }