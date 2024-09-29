// src/routes/api/remove/+server.ts
import { json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';
import { directoryPath } from '$lib/config';

export async function DELETE({ url }) {
    try {
        const filename = url.searchParams.get('file');
        if (!filename) {
            return json({ error: 'Nom de fichier non spécifié' }, { status: 400 });
        }

        const filePath = path.join(directoryPath, filename);

        // Vérifier si le fichier existe
        await fs.access(filePath);

        // Supprimer le fichier
        await fs.unlink(filePath);
        console.log(`Fichier ${filename} supprimé avec succès`)
        return json({ message: `Fichier ${filename} supprimé avec succès` });
    } catch (error) {
        if (error.code === 'ENOENT') {
            return json({ error: 'Fichier non trouvé' }, { status: 404 });
        }
        console.error('Erreur lors de la suppression du fichier:', error);
        return json({ error: 'Erreur lors de la suppression du fichier' }, { status: 500 });
    }
}