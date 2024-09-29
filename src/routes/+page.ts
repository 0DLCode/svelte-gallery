import type { PageLoad } from './$types';
import type { FileInfo } from '$lib/types';

export const load: PageLoad = async ({ fetch }) => {
  const fetchFiles = async (mode: string): Promise<FileInfo[]> => {
    const response = await fetch(`/api/files?mode=${mode}`);
    const files = await response.json();
    return files || [];
  };

  return {
    streamed: {
      files: fetchFiles('random') // ou le mode par défaut que vous souhaitez
    }
  };
};