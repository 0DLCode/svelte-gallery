import { promises as fs } from 'fs';
import path from 'path';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  if (event.url.pathname.startsWith('/media/')) {
    const filePath = path.join(process.cwd(), 'static', event.url.pathname);
    try {
      const file = await fs.readFile(filePath);
      return new Response(file, {
        headers: {
          'Content-Type': 'application/octet-stream' // Ajustez selon le type de fichier
        }
      });
    } catch (error) {
      // Fichier non trouvé, continuez avec la résolution normale
    }
  }
  return resolve(event);
}