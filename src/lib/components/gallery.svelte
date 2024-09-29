<script lang="ts">
  import type { FileInfo } from '$lib/types';
  import ImageModal from './imageModal.svelte';
  import Loading from './loading.svelte';
  import { sortFiles } from '$lib/utils';
  import { lazyLoad } from '$lib/lazyLoad';
  import { slide } from 'svelte/transition';

  export let files: FileInfo[];

  let selectedImage: FileInfo | null = null;
  let sortOption: string = "name";
  let isLoading = true;
  let loadedImagesCount = 0;
  const minImagesToShow = 4;
  let showFilename = true;

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

  $: sortedFiles = sortFiles(files, sortOption);
</script>

{#if isLoading}
  <Loading />
{/if}

<div class="mb-4">
  <label for="sort" class="mr-2 font-semibold">Trier par:</label>
  <select id="sort" bind:value={sortOption} class="p-2 bg-white border border-gray-300 rounded">
    <option value="name">Nom</option>
    <option value="date">Date</option>
    <option value="type">Type</option>
  </select>
  <button 
    on:click={() => {showFilename =!showFilename}}
    class="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-200">
    {showFilename? "Hide filenames" : "Show filenames"}
  </button>
</div>

{#if sortedFiles && sortedFiles.length > 0}
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    {#each sortedFiles as file}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-transform duration-100 hover:scale-105" on:click={() => openImage(file)}>
        {#if file.type.includes('image')}
          <!-- svelte-ignore missing-declaration -->
          <img 
            in:slide={{ duration: 120 }}
            use:lazyLoad
            on:load={handleImageLoad}
            data-src={`/media/${file.name}`}
            alt={file.name}
            class="w-full h-full object-cover object-center"
            src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          >
        {:else if file.type.includes('video')}
          <!-- svelte-ignore a11y-media-has-caption -->
          <video src={`/media/${file.name}`} class="w-full h-full object-cover object-center" on:loadeddata={handleImageLoad}></video>
        {/if}
        {#if showFilename}
          <div class="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gray-800 opacity-75">
            <h3 class="text-sm text-white truncate">{file.name}</h3>
          </div>
        {/if}
      </div>
    {/each}
  </div>
{:else}
  <p>Aucun fichier trouvé.</p>
{/if}

{#if selectedImage}
  <ImageModal {selectedImage} />
{/if}
