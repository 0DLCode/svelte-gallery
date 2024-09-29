import type { PageLoad } from './$types';

export interface FileInfo {
    name: string;
    type: string;
    size: number;
    date: Date;
}

export interface PageData {
    data: FileInfo[];
}

export const load: PageLoad<PageData> = async ({ fetch }) => {
    const response = await fetch('/api/files');
    const files: FileInfo[] = await response.json();

    console.log('Fichiers récupérés:', files.length);

    return {
        data: files
    };
};