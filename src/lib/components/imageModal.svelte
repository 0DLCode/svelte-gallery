<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { FileInfo } from '$lib/types';
  import { onMount } from 'svelte';

  export let selectedImage: FileInfo | null;

  let scale = 1;
  let minScale = 1;
  let maxScale = 5;
  let imageElement: HTMLImageElement;
  let containerElement: HTMLDivElement;
  let isMobile = false;

  const closeModal = () => {
    selectedImage = null;
  };

  const handleWheel = (event: WheelEvent) => {
    if (selectedImage?.type.includes('image')) {
      event.preventDefault();
      const delta = event.deltaY > 0 ? -0.1 : 0.1;
      scale = Math.min(Math.max(minScale, scale + delta), maxScale);
    }
  };

  const handleClick = (event: MouseEvent) => {
    closeModal()
  };

  const calculateInitialScale = () => {
    if (imageElement && containerElement && selectedImage?.type.includes('image')) {
      const containerWidth = containerElement.clientWidth;
      const containerHeight = containerElement.clientHeight;
      const imageWidth = imageElement.naturalWidth;
      const imageHeight = imageElement.naturalHeight;

      const widthRatio = containerWidth / imageWidth;
      const heightRatio = containerHeight / imageHeight;

      minScale = Math.min(widthRatio, heightRatio);
      
      // Ajuster l'échelle pour les appareils mobiles
      if (isMobile) {
        minScale = Math.max(minScale, 1); // Assure que l'échelle minimale est au moins 1 sur mobile
      }
      
      scale = minScale;
    }
  };

  const checkMobile = () => {
    isMobile = window.innerWidth <= 768; // Considère comme mobile si la largeur est <= 768px
  };

  onMount(() => {
    checkMobile();
    calculateInitialScale();
    window.addEventListener('resize', () => {
      checkMobile();
      calculateInitialScale();
    });
    return () => {
      window.removeEventListener('resize', calculateInitialScale);
    };
  });
</script>

{#if selectedImage}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div 
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 overflow-hidden" 
    on:click={handleClick} 
    on:wheel={handleWheel}
    transition:fade
    bind:this={containerElement}
  >
    <div class="flex items-center justify-center w-full h-full">
      {#if selectedImage.type.includes('image')}
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <img 
          bind:this={imageElement}
          src={`/media/${selectedImage.name}`} 
          alt={selectedImage.name} 
          class="object-cover rounded-sm transition-transform duration-200 ease-out"
          style="transform: scale({scale}); transform-origin: center;"
          on:load={calculateInitialScale}
        >
      {:else if selectedImage.type.includes('video')}
        <video 
          src={`/media/${selectedImage.name}`} 
          controls 
          class="max-w-full max-h-full"
        >
          <track kind="captions">
        </video>
      {/if}
    </div>
  </div>
{/if}