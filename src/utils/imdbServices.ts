//*** Documentación: 
// https://rapidapi.com/octopusteam-octopusteam-default/api/imdb236/ */

import axios from 'axios';

// Tu clave de API de RapidAPI
const apiKey = process.env.RAPIDAPI_KEY;

// Función para obtener detalles de la película
async function getMovie(movieTitle) {
    const options = {
        method: 'GET',
        url: 'https://imdb236.p.rapidapi.com/imdb/search',
        params: {
            originalTitle: movieTitle,
        },
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': 'imdb236.p.rapidapi.com'
        }
      };
      
      try {
          const response = await axios.request(options);
          return response.data;
      } catch (error) {
          console.error(error);
      }
    
}

async function getMovieDetails(movieID) {
    const options = {
        method: 'GET',
        url: 'https://imdb236.p.rapidapi.com/imdb/' + movieID,
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': 'imdb236.p.rapidapi.com'
        }
      };
      
      try {
          const response = await axios.request(options);
          return response.data;
      } catch (error) {
          console.error(error);
      }
}


export { getMovie, getMovieDetails }

