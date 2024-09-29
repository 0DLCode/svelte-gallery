<script lang="ts">
  import type { PageData } from './$types';
  import Gallery from '$lib/components/gallery.svelte';
  
  import { onMount } from "svelte";

  export let data: PageData;

  let files = data.data;

  onMount(() => {
    console.log('Composant monté, files:', files.length);
  });
</script>

<main>
  <h1 class="text-4xl font-bold mb-5 text-white">Galerie</h1>
  <Gallery {files} />
</main>

<style>
  main {
    margin: 15px;
  }
</style>
