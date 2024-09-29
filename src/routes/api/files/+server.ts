import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

interface FileInfo {
    name: string;
    type: string;
    size: number;
    date: Date;
}

const directoryPath = path.resolve('static/media');  // Dossier contenant les fichiers
let fileList: FileInfo[];

function listFiles() {
  try {
    // Lire le contenu du dossier
    const files = fs.readdirSync(directoryPath);

    // Créer une liste des fichiers avec leurs informations
    fileList = files.map(file => {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) return null
        const type =  getFileType(path.extname(file));
        if (type == "other") return null

        return {
            name: file,
            type: type,
            size: stats.size,
            date: stats.mtime
        };
    }).filter(x => x !== null)
  } catch (error) {
    console.error(error)
  }
}

listFiles()
setInterval(() => {
  listFiles()
}, 1000)

function getFileType(extension: string): "image" | "video" | "other" {
  const imageExtensions = [
    "jpeg", "jpg", "png", "gif", "webp", "svg", "bmp", "ico", "apng", "avif"
  ];

  const videoExtensions = [
    "mp4", "webm", "ogg", "mov", "avi", "wmv", "flv", "mkv", "m4v"
  ];

  // Convertir l'extension en minuscules et supprimer le point initial s'il existe
  const cleanExtension = extension.toLowerCase().replace(/^\./, '');

  if (imageExtensions.includes(cleanExtension)) {
    return "image";
  } else if (videoExtensions.includes(cleanExtension)) {
    return "video";
  } else {
    return "other";
  }
}


export const GET = async ({ url, getClientAddress}) => {
    try {
        const mode = url.searchParams.get('mode');

        const sortedList = [...fileList]; // Créer une copie de la liste pour ne pas modifier l'original

        switch (mode) {
            case 'random':
                // Mélanger la liste de manière aléatoire
                sortedList.sort(() => Math.random() - 0.5);
                break;
            case 'name':
                // Trier par nom
                sortedList.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'date':
                // Trier par date, du plus récent au plus ancien
                sortedList.sort((a, b) => b.date.getTime() - a.date.getTime());
                break;
            default:
                // Pas de tri spécifique si aucun mode n'est spécifié
                break;
        }

        console.log(`${getClientAddress()} [  => ] Return of ${sortedList.length} files (mode: ${mode || 'default'})`);
        return json(sortedList);
    } catch (_error) {
        // Gérer les erreurs et renvoyer une réponse avec un statut 500
        return json({ error: 'Erreur lors de la lecture des fichiers.' }, { status: 500 });
    }
};