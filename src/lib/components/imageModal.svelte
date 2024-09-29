<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { FileInfo } from '$lib/types';

  export let selectedImage: FileInfo | null;

  const closeModal = () => {
    selectedImage = null;
  };
</script>

{#if selectedImage}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 " on:click={closeModal} transition:fade>
    <div class="max-w-4xl max-h-full p-4 ">
      {#if selectedImage?.type.includes('image')}
        <img src={`/media/${selectedImage.name}`} alt={selectedImage.name} class="max-w-full max-h-full object-contain rounded-sm">
      {:else if selectedImage?.type.includes('video')}
        <video src={`/media/${selectedImage.name}`} controls class="max-w-full max-h-full"><track kind="captions"></video>
      {/if}
    </div>
  </div>
{/if}
  