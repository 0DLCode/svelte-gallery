<script lang="ts">
  import type { FileInfo } from '$lib/types';
  import FileItem from '$lib/components/fileItem.svelte';
  import ImageModal from '$lib/components/imageModal.svelte';
  import Loading from '$lib/components/loading.svelte';
  import SortControls from '$lib/components/sortControls.svelte';
  
  export let files: FileInfo[];

  let selectedImage: FileInfo | null = null;
  let isLoading = true;
  let loadedImagesCount = 0;
  let showFilename = true;
  let sortOption: string = "random";
  let optionSelected: string = "random";
  let columnsCount = 5; // Valeur par défaut
  $: minImagesToShow = columnsCount;

  function handleImageLoad() {
    loadedImagesCount++;
    if (loadedImagesCount >= minImagesToShow) {
      isLoading = false;
    }
  }

  function openImage(file: FileInfo) {
    selectedImage = file;
  }

  function closeImage() {
    selectedImage = null;
    console.log("gallery has closed image");
  }

  async function fetchFiles(mode: string) {
    const response = await fetch('/api/files?mode=' + mode);
    const files: FileInfo[] = await response.json().catch((e) => console.error(e));

    if (!files) return []
    console.log('Fichiers récupérés:', files.length);

    return files
  }

  function handleFileDeleted(event: CustomEvent<string>) {
    const deletedFileName = event.detail;
    files = files.filter(file => file.name !== deletedFileName);
  }

  async function refresh() {
    if (optionSelected === sortOption) return
    optionSelected = sortOption
    console.log("fetchFiles", optionSelected)
    files = await fetchFiles(optionSelected)
  }

  setInterval(refresh, 500)

  $: gridClass = `grid gap-4 w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${columnsCount}`;
</script>

{#if isLoading}
  <Loading />
{/if}

<SortControls bind:sortOption bind:columnsCount {showFilename} on:toggleFilename={() => showFilename = !showFilename} />

{#if files && files.length > 0}
  <div class={gridClass}>
    {#each files as file (file.name)}
      <FileItem 
        {file} 
        {showFilename} 
        on:openImage={() => openImage(file)}
        on:imageLoad={handleImageLoad}
        on:fileDeleted={handleFileDeleted}
      />
    {/each}
  </div>
{:else}
  <p>Aucun fichier trouvé.</p>
{/if}

{#if selectedImage}
  <ImageModal {selectedImage} on:close={closeImage} />
{/if}