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

export const GET = async () => {
    try {
        // Lire le contenu du dossier
        const files = fs.readdirSync(directoryPath);

        // Créer une liste des fichiers avec leurs informations
        const fileList = files.map(file => {
            const filePath = path.join(directoryPath, file);
            const stats = fs.statSync(filePath);
            const type =  getFileType(path.extname(file));
            if (type == "other") return null

            return {
                name: file,
                type: type,
                size: stats.size,
                date: stats.mtime
            };
        }).filter(x => x !== null)

        // Renvoyer la liste des fichiers sous forme de JSON
        return json(fileList);
    } catch (error) {
        // Gérer les erreurs et renvoyer une réponse avec un statut 500
        return json({ error: 'Erreur lors de la lecture des fichiers.' }, { status: 500 });
    }
};
