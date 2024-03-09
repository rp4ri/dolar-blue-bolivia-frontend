<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    const dispatch = createEventDispatcher();
  
    let isChecked = false;
  
    function handleCheckboxChange() {
      isChecked = !isChecked;
      dispatch('change', isChecked ? 'daily' : 'hourly');
    }
  </script>
  
  <label
    class="themeSwitcherTwo shadow-two relative inline-flex cursor-pointer select-none items-center justify-center rounded-md bg-black dark:bg-dark-2 p-1"
  >
    <input type="checkbox" class="sr-only" on:change={handleCheckboxChange} bind:checked={isChecked} />
    <span
      class="light text-primary bg-gray dark:bg-dark-3 flex items-center space-x-[6px] rounded py-2 px-[18px] text-sm font-medium"
    >
      1H
    </span>
    <span
      class="dark text-body-color flex items-center space-x-[6px] rounded py-2 px-[18px] text-sm font-medium"
    >
      1D
    </span>
  </label>