import { addKeyword } from '@builderbot/bot';
import { getMovie, getMovieDetails} from "../utils/imdbServices"
import { multipleNames } from "../flows/flow-imdbDetails"

const flowIMDB = addKeyword('damePeli')
    .addAnswer(`Título original: `, { capture: true }, async (ctx, { state }) => {
        await state.update({ termino: ctx.body })
    })


    .addAction(async (ctx, { state, flowDynamic }) => {
        const termino = state.get('termino')
        const results = await getMovie(termino)
        if (results != undefined) {
            for (const movie of results.results) { //Ver documentación de la response de la API
                await flowDynamic(await formatMovieText(movie))
            }

            
        } else
            await flowDynamic('No se ha podido encontrar la película. Por favor prueba con otros términos de búsqueda')
    })


async function formatMovieText(movie) {
    const movieDetails = await getMovieDetails(movie.id);
    return ` ----------------------------
    *Título:* ${movie.primaryTitle}
    *Título Original:* ${movie.originalTitle}
    *Año de Estreno:* ${movie.startYear || 'Desconocido'}
    *Director:* ${ movieDetails.directors ? multipleNames(movieDetails.directors)   : 'Desconocido'}
    *Géneros:* ${movie.genres ? movie.genres.join(', ') : 'Desconocido'}
    *Calificación Promedio:* ${movie.averageRating || 'N/A'}
    *ID de IMDb:* ${movie.id}
    ----------------------------`;
}


export default flowIMDB
