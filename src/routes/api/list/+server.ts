import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import { directoryConfigPath, directoryPath } from '$lib/config.js';

let directories: Array<string> = [];
let defaultDirectory: string = '';
const config = JSON.parse(fs.readFileSync(directoryConfigPath, 'utf8'));

function getDefaultDirectory(): string {
  if (fs.existsSync(directoryConfigPath)) {
    try {
      return config.defaultDirectory || '';
    } catch {
      return '';
    }
  }
  return ''
}

function updateDirectories() {
  const files = fs.readdirSync(directoryPath);
  directories = files.filter(file => fs.statSync(path.join(directoryPath, file)).isDirectory() || (file.endsWith('.json') && file !== "config.json") );
  defaultDirectory = getDefaultDirectory() || directories[0] || ''; // Utiliser le premier dossier par défaut si aucun n'est disponible
}

updateDirectories()
setInterval(() => {
  updateDirectories()
}, 1000)

export const GET = async () => {
  try {
      console.log('[  => ] Return of directory list', directories, "Default Directory", defaultDirectory);  // Afficher le message de log dans la console
      return json({ directories, defaultDirectory });
  } catch (_error) {
      // Gérer les erreurs et renvoyer une réponse avec un statut 500
      return json({ error: 'Erreur lors de la lecture des dossiers' }, { status: 500 });
  }
};