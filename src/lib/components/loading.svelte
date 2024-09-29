<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  
  let visible = false;

  onMount(() => {
    visible = true;
  });
</script>

{#if visible}
  <div 
    class="h-full w-full fixed inset-0 flex items-center justify-center text-3xl sm:text-5xl md:text-6xl lg:text-9xl text-white font-bold bg-slate-900 z-50"
    transition:fade={{ duration: 300 }}
  >
    <h1 class="animate-pulse">
      <span class="animate-bounce dots">Loading Gallery...</span>
    </h1>
  </div>
{/if}

<style>
  .animate-pulse {
    animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .dots {
    display: inline-block;
    text-align: left;
  }
</style>