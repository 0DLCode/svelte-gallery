<script lang="ts">
  import type { PageData } from './$types';
  import type { FileInfo } from '$lib/types';
  import FileItem from '$lib/components/fileItem.svelte';
  import ImageModal from '$lib/components/imageModal.svelte';
  import Loading from '$lib/components/loading.svelte';
  import SortControls from '$lib/components/sortControls.svelte';
  import { onMount } from 'svelte';
  import Cookies from 'js-cookie';
	import { base } from '$app/paths';

  export let directory: string;
 
  let selectedImage: FileInfo | null = null;
  let selectedImagePath: string;
  let showFilename = true;
  let sortOption: string = "random";
  let files = fetchFiles(sortOption);
  let fetchedFiles: FileInfo[] = [];
  let optionSelected: string = "random";
  let columnsCount: number;
  let modalInterval: number = 3000;
  const pathTo = `${base}/medias/${directory}`;
  $: minImagesToShow = columnsCount;

  let loadedImagesCount = 0;

  function handleImageLoad() {
    loadedImagesCount++;
  }

  function openImage(file: FileInfo, path: string) {
    selectedImage = file;
    selectedImagePath = path;
  }

  function closeImage() {
    selectedImage = null;
    console.log("gallery has closed image");
  }

  async function fetchFiles(mode: string) {
    console.log(`Fetching files in ${directory} mode: ${mode}...`);
    const response = await fetch(`/api/files?mode=${mode}&directory=${directory}`);
    return await response.json().catch((e) => console.error(e)) || [];
  }

  function handleFileDeleted(event: CustomEvent<string>) {
    const deletedFileName = event.detail;
    files = files.then(files => 
      files.filter(file => file.name !== deletedFileName)
    );
  }

  let getPreviousImage = (file: FileInfo) => {};
  let getNextImage = (file: FileInfo) => {}

  async function refresh() {
    if (optionSelected === sortOption) return;
    optionSelected = sortOption;
    console.log("fetchFiles", optionSelected);
    files = fetchFiles(optionSelected);
  }


  setInterval(refresh, 500)

  function updateColumnsCountCookie(value: number) {
    if (typeof window !== 'undefined') {
      const currentCookie = Cookies.get('columnsCount');
      if (currentCookie !== value.toString()) {
        Cookies.set('columnsCount', value.toString(), { expires: 999999 });
        console.log("Cookie ColumnCount set to", value);
      }
    }
  }

  function updateShowFilesCookies(value: boolean) {
    if (typeof window !== 'undefined') {
      const currentCookie = Cookies.get('showFiles');
      if (currentCookie !== value.toString()) {
        Cookies.set('showFiles', value.toString(), { expires: 999999 });
        console.log("Cookie showFiles set to", value);
      }
    }
  }

  $: {
    if (columnsCount !== undefined) {
      updateColumnsCountCookie(columnsCount);
    }
    if (showFilename !== undefined) {
      updateShowFilesCookies(showFilename)
    }
  }

  function getGridClass(columns: number) {
    const baseClass = "grid gap-4 w-full";
    switch(columns) {
      case 1: return `${baseClass} grid-cols-1`;
      case 2: return `${baseClass} grid-cols-2`;
      case 3: return `${baseClass} grid-cols-3`;
      case 4: return `${baseClass} grid-cols-4`;
      case 5: return `${baseClass} grid-cols-5`;
      case 6: return `${baseClass} grid-cols-6`;
      default: return `${baseClass} grid-cols-4`;
    }
  }

  onMount(() => {
    files.then((data: FileInfo[]) => {
      fetchedFiles = data;
      getPreviousImage = (file: FileInfo) => {
        const index = fetchedFiles.findIndex(file => file.name === file.name);
        return fetchedFiles[index - 1] || null;
      }

      getNextImage = (file: FileInfo) => {
        const index = fetchedFiles.findIndex(file => file.name === file.name);
        return fetchedFiles[index + 1] || null;
      }
    })

    if (typeof window !== 'undefined') {
      const savedColumnsCount = Cookies.get('columnsCount');
      if (savedColumnsCount) {
        console.log("load columnsCount from cookies", savedColumnsCount);
        columnsCount = parseInt(savedColumnsCount);
      } else {
        columnsCount = window.innerWidth < 640 ? 2 : window.innerWidth < 1024 ? 4 : 5;
      }
      const savedShowFiles = Cookies.get('showFiles');
      if (savedShowFiles) {
        showFilename = savedShowFiles === "true";
      }
    }
    
    // Démarrer le rafraîchissement périodique
    const intervalId = setInterval(refresh, 500);
    return () => clearInterval(intervalId);
    
  });
</script>

<SortControls bind:sortOption bind:columnsCount {showFilename} {modalInterval} on:toggleFilename={() => showFilename = !showFilename} />

{#if files}
{#await files}
  <Loading />
{:then files}
  {#if files && files.length > 0}
    <div class={getGridClass(columnsCount)}>
      {#each files as file (file.name)}
        <FileItem 
          path={`${pathTo}/${file.name}`}
          {file} 
          {showFilename} 
          on:openImage={() => openImage(file, `${pathTo}/${file.name}`, files.indexOf(file))}
          on:imageLoad={handleImageLoad}
          on:fileDeleted={handleFileDeleted}
        />
      {/each}
    </div>
  {:else}
    <p>Aucun fichier trouvé.</p>
  {/if}
{:catch error}
  <p>Erreur lors du chargement des fichiers : {error.message}</p>
{/await}
{:else}
<Loading />
{/if}

{#if selectedImage}
  <ImageModal {selectedImage} {modalInterval} files={fetchedFiles} pathTo={pathTo}  on:close={closeImage} />
{/if}