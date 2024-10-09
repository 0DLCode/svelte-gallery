import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const fetchDir = async () => {
    const response = await fetch(`/api/list`);
    return await response.json();
  }
  const fetched = await fetchDir();
  // console.log(JSON.stringify(fetched) + "\n");
  const directories = fetched["directories"];
  const defaultDirectory = fetched["defaultDirectory"];

  // console.log("Dossier par défaut:", defaultDirectory);

  return {
    directories: directories,
    defaultDirectory: defaultDirectory
  };
};