<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    export let sortOption: string;
    export let showFilename: boolean;
    export let columnsCount: number;
  
    const dispatch = createEventDispatcher();
  
    const columnOptions = [1, 2, 3, 4, 5, 6, 8, 10];
  </script>
  
  <div class="mb-4 flex flex-wrap items-center gap-4">
    <div>
      <label for="sort" class="mr-2 font-semibold">Trier par:</label>
      <select id="sort" bind:value={sortOption} class="p-2 bg-white border border-gray-300 rounded">
        <option value="name">Nom</option>
        <option value="date">Date</option>
        <option value="random">Aléatoire</option>
      </select>
    </div>
  
    <div>
      <label for="columns" class="mr-2 font-semibold">Colonnes:</label>
      <select id="columns" bind:value={columnsCount} class="p-2 bg-white border border-gray-300 rounded">
        {#each columnOptions as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
    </div>
  
    <button 
      on:click={() => dispatch('toggleFilename')}
      class="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-200">
      {showFilename ? "Masquer les noms" : "Afficher les noms"}
    </button>
  </div>