<script lang="ts">
  import type { PageData } from './$types';
  import Gallery from '$lib/components/gallery.svelte';
  import { onMount } from "svelte";
	import Tabs from '$lib/components/tabs.svelte';

  export let data: PageData;
  let selectedDir = "";

  function changeTab(dir: string) {
    console.log(`Changing tab to ${dir}`);
    selectedDir = dir;
  }
</script>


<Tabs tabs={data?.directories || ["Home"]} on:changeTab={(event) => changeTab(event.detail)} defaultTab={data.defaultDirectory}></Tabs>
<main>
  <h1 class="text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold mb-5 text-white">Galerie</h1>
  {#each data?.directories as directory}
    {#if selectedDir == directory}
      <Gallery directory={directory}/>
    {/if}
  {/each}
</main>

<style>
  main {
    margin: 15px;
  }
</style>
