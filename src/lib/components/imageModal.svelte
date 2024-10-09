<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { FileInfo } from '$lib/types';
  import { onMount } from 'svelte';

  export let selectedImage: FileInfo | null;
  export let files: FileInfo[];
  export let pathTo: string;
  export let modalInterval: number;

  let scale = 1;
  let minScale = 1;
  let maxScale = 5;
  let imageElement: HTMLImageElement;
  let containerElement: HTMLDivElement;
  let isMobile = false;

  const interval = setInterval(() => nextFile(true), modalInterval);

  const closeModal = () => {
    clearInterval(interval);
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
    if ((event.target as HTMLElement).tagName.toLocaleLowerCase() === "button") return
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

  function nextFile (auto: boolean) {
    if (!auto) clearInterval(interval);
    const currentIndex = files.indexOf(selectedImage);
    const nextIndex = (currentIndex + 1) % files.length;
    selectedImage = files[nextIndex];
  }

  function previousFile (auto: boolean) {
    if (!auto) clearInterval(interval);
    const currentIndex = files.indexOf(selectedImage);
    const previousIndex = (currentIndex - 1 + files.length) % files.length;
    selectedImage = files[previousIndex];
  }

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
      <button on:click={previousFile} class="absolute top-0 left-0 p-4 text-white">PREVIOUS</button>
      {#if selectedImage.type.includes('image')}
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <img 
          bind:this={imageElement}
          src={`${pathTo}/${selectedImage.name}`}
          alt={selectedImage.name} 
          class="object-cover rounded-sm transition-transform duration-100 ease-out"
          style="transform: scale({scale}); transform-origin: center;"
          on:load={calculateInitialScale}
        >
      {:else if selectedImage.type.includes('video')}
        <video 
          src={`${pathTo}/${selectedImage.name}`} 
          controls 
          class="max-w-full max-h-full"
        >
          <track kind="captions">
        </video>
      {/if}
      <button on:click={nextFile} class="absolute top-0 right-0 p-4 text-white">NEXT</button>
    </div>
  </div>
{/if}