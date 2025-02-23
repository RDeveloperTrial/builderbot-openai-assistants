//*** Documentación: 
//https://docs.diffbot.com/reference/introduction-to-diffbot-apis?utm_source=dashboard */

const apiKey = process.env.DIFFBOT;

async function getArticle(url: string): Promise<string | undefined> {
    try {
        const token = apiKey;
        const response = await fetch('https://api.diffbot.com/v3/article?url=' + encodeURIComponent(url) + '&token=' + token, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();
        
        if (result.objects && result.objects.length > 0) {
            return result.objects[0].text;  // Retornamos el texto del primer artículo
        } else {
            return undefined
        }
        
    } catch (error) {
        console.error('Error:', error);
        return undefined;  
    }
}
export { getArticle } 