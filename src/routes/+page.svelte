<script lang="ts">
  import type { PageData } from './$types';
  import Gallery from '$lib/components/gallery.svelte';
  
  import { onMount } from "svelte";

  export let data: PageData;
</script>

<main>
  <h1 class="text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold mb-5 text-white">Galerie</h1>
  <Gallery {data} />
</main>

<style>
  main {
    margin: 15px;
  }
</style>
