import imaps from 'imap-simple';
import { Config } from 'imap-simple';
import dotenv from 'dotenv';

dotenv.config();

// Configuración del servidor IMAP de Yahoo
const config: Config = {
  imap: {
    user: process.env.YAHOO_EMAIL,
    password: process.env.YAHOO_PASSWORD,
    host: 'imap.mail.yahoo.com',
    port: 993,
    tls: true,
    authTimeout: 3000,
  }
};

// Función para conectarse a Yahoo Mail y extraer los correos
async function fetchYahooEmails() {
  try {
    const connection = await imaps.connect({ imap: config.imap });
    await connection.openBox('INBOX');

    const searchCriteria = ['UNSEEN']; // Buscar correos no leídos
    const fetchOptions = {
      bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'], // Pedir encabezados específicos y el cuerpo
      struct: true,
    };

    const messages = await connection.search(searchCriteria, fetchOptions);

    const emails = messages.map((message: any, seqno: number) => {
      const headerPart = message.parts.find((part: any) => part.which === 'HEADER.FIELDS (FROM TO SUBJECT DATE)');
      const bodyPart = message.parts.find((part: any) => part.which === 'TEXT');

      const headers = headerPart.body;

      let body = '';
      if (bodyPart) {
        body = bodyPart.body ? bodyPart.body : 'Cuerpo no disponible';
      }

      return {
        from: headers.from ? headers.from[0] : 'Remitente desconocido',
        to: headers.to ? headers.to[0] : 'Destinatario desconocido',
        subject: headers.subject ? headers.subject[0] : 'Sin asunto',
        date: headers.date ? headers.date[0] : 'Fecha desconocida',
        body: body
      };
    });

    connection.end(); // Cerrar la conexión

    return emails;

  } catch (error) {
    console.error('Error al extraer correos:', error);
    throw error;
  }
}

// Función principal
async function getYahooEmails() {
  const emails = await fetchYahooEmails();

  const emailsArray = []
  if (emails.length > 0) {
    emails.forEach((email, index) => {
      emailsArray.push(
          `🔔🔔🔔 *Email ${index + 1}* 🔔🔔🔔:
          De: *${email.from}*
          
          Para: *${email.to}*
          
          Asunto: *${email.subject}*
          
          Fecha: ${email.date}
          
          Cuerpo: ${email.body.substr(1, 4000)}`);
    });
    return emailsArray;
  } else {
    console.log('No hay correos nuevos.');
  }
}
  

export { getYahooEmails }