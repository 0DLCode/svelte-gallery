import { directoryPath } from '$lib/config';
import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

interface FileInfo {
    name: string;
    type: string;
    size: number;
    date: Date;
}


let directorys: Array<string> = [];
const fileList = new Map<string, FileInfo[]>();

function listFiles() {
  directorys.forEach(async (directory) => {
    try {
      const dPath = path.join(directoryPath, directory);
      let files;
      if (fs.statSync(dPath).isFile() && directory.endsWith('.json')) {
        const linksFile = JSON.parse(fs.readFileSync(dPath, 'utf8'));
        files = linksFile.links.map(link => {
          return {
              name: path.basename(link),
              type: "image",
              size: 0,
              date: new Date()
          };
        });
      } else {
        // Lire le contenu du dossier
        files = fs.readdirSync(dPath);
      }
      
  
      // Créer une liste des fichiers avec leurs informations
      fileList.set(directory, files.map(file => {
          const filePath = path.join(dPath, file);
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
      }).filter(x => x !== null))
    } catch (error) {
      console.error(error)
    }
  })
}

function updateDirectorys() {
  const files = fs.readdirSync(directoryPath);
  directorys = files.filter(file => fs.statSync(path.join(directoryPath, file)).isDirectory());
}

updateDirectorys()
listFiles()
setInterval(() => {
  updateDirectorys()
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
        const directory = url.searchParams.get('directory');
        const mode = url.searchParams.get('mode');

        const files = fileList.get(directory || '') || [];

        const sortedList = [...files]; // Créer une copie de la liste pour ne pas modifier l'original
        console.log()

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

        console.log(`${getClientAddress()} [  => ] Return of ${sortedList.length} files (mode: ${mode || 'default'}  &  directory: ${directory}  )`);
        return json(sortedList);
    } catch (_error) {
        // Gérer les erreurs et renvoyer une réponse avec un statut 500
        return json({ error: 'Erreur lors de la lecture des fichiers.' }, { status: 500 });
    }
};