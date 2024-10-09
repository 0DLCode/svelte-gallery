<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';

  // Variables de propriétés du composant
  export let tabs: string[] = [];
  export let activeTab: string | null = null;
  export let defaultTab: string | null = null;

  // Dispatcher pour émettre l'événement
  const dispatch = createEventDispatcher();

  // Fonction pour changer d'onglet
  function selectTab(tab: string) {
    activeTab = tab;
    //console.log(`Changement d'onglet : ${tab}`);  // Afficher le changement d'onglet dans la console
    dispatch('changeTab', tab);  // Émission de l'événement
  }
  
  onMount(() => {
    selectTab(defaultTab || tabs[0]);  // Définir l'onglet actif au premier élément de la liste
  })
</script>

<!-- Liste dynamique des onglets -->
<ul class="tabs">
  {#each tabs as tab (tab)}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <li class="tab {activeTab === tab ? 'active' : ''}" on:click={() => selectTab(tab)}>
      {tab}
    </li>
  {/each}
</ul>
