import { addKeyword } from '@builderbot/bot';
import { getMovieDetails } from "../utils/imdbServices"

const flowIMDBdetails = addKeyword('dameDetalles')
    .addAnswer(`IMDB ID: `, { capture: true }, async (ctx, { state }) => {
        await state.update({ movieID: ctx.body })
    })


    .addAction(async (ctx, { state, flowDynamic }) => {
        const movieID = state.get('movieID')
        const details = await getMovieDetails(movieID)
        if (details != undefined) {
            await flowDynamic(formatMovieText(details))
        } else
            await flowDynamic('No se ha podido encontrar la película. Por favor prueba con otros términos de búsqueda')
    })

    
function multipleNames(directors){
    let names = ""
    if (Symbol.iterator in Object(directors)) {
        for (const director of directors) {
            names +=  director.fullName
            names += ', '
        }
    } else {
        names = directors.fullName
    }
    
    return names
}

function formatMovieText(movie) {
    return ` ----------------------------
    *Título:* ${movie.primaryTitle}
    *Título Original:* ${movie.originalTitle}
    *Año de Estreno:* ${movie.startYear || 'Desconocido'}

    *Director:* ${movie.directors ? multipleNames(movie.directors)   : 'Desconocido'}
    *Géneros:* ${movie.genres ? movie.genres.join(', ') : 'Desconocido'}
    *Calificación:* ${movie.averageRating || 'N/A'}
    *Cast:*  ${movie.cast ? multipleNames(movie.cast) : 'Desconocido'}
    *Descripción:* ${movie.description || 'N/A'}
    *ID de IMDb:* ${movie.id}
    ----------------------------`;
}


export default flowIMDBdetails
export {multipleNames}