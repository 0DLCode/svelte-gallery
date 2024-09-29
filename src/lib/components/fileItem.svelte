<script lang="ts">
    import type { FileInfo } from '$lib/types';
    import { lazyLoad } from '$lib/lazyLoad';
    import { slide } from 'svelte/transition';
    import { base } from '$app/paths';
    import { createEventDispatcher } from 'svelte';
  
    export let file: FileInfo;
    export let showFilename: boolean;
  
    const dispatch = createEventDispatcher();
  
    async function copyToClipboard(text: string) {
      try {
        await navigator.clipboard.writeText(text);
        console.log('Texte copié dans le presse-papiers :', text);
      } catch (err) {
        console.error('Erreur lors de la copie :', err);
      }
    }
  
    function openTabImage(filename: string) {
      const url = `${base}/media/${filename}`
      copyToClipboard(window.location.origin + url)
    }
  
    function handleImageError(event: Event) {
      const element = event.target as HTMLElement;
      const parent = element.parentElement;
      if (parent) {
        parent.remove();
      }
    }
  
    async function deleteFile() {
      try {
        const response = await fetch(`/api/remove?file=${encodeURIComponent(file.name)}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          dispatch('fileDeleted', file.name);
        } else {
          console.error('Erreur lors de la suppression du fichier');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression du fichier', error);
      }
    }
</script>
  
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div 
    class="relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-transform duration-100 hover:scale-105"
    style="max-height: 80vh;"
    on:click={() => dispatch('openImage')}
    on:dblclick={() => openTabImage(file.name)}
    on:auxclick|preventDefault={() => openTabImage(file.name)}
>
    {#if file.type.includes('image')}
    <img 
    in:slide={{ duration: 120 }}
    use:lazyLoad
    on:load={() => dispatch('imageLoad')}
    on:error|preventDefault|stopPropagation={handleImageError}
    data-src={`${base}/media/${encodeURIComponent(file.name)}`}
    alt={file.name}
    class="w-full h-full object-cover object-center"
    src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    >
    {:else if file.type.includes('video')}
        <!-- svelte-ignore a11y-media-has-caption -->
        <video 
        src={`/media/${file.name}`} 
        class="w-full h-full object-cover object-center" 
        on:loadeddata={() => dispatch('imageLoad')}
        ></video>
    {/if}
    {#if showFilename}
        <div class="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gray-800 opacity-75">
        <h3 class="text-sm text-white truncate">{file.name}</h3>
        </div>
    {/if}
    <button 
        on:click|stopPropagation={deleteFile}
        class="absolute bottom-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
    >
        🗑️
    </button>
</div>