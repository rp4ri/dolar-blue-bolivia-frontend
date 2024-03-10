<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let isChecked = false;

  function handleCheckboxChange() {
    isChecked = !isChecked;
    dispatch("change", isChecked ? "daily" : "hourly");
  }
</script>

<label
  class="themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center justify-center rounded-md bg-midnight-400 dark:bg-dark-2 p-1 shadow-two">
  <input
    type="checkbox"
    class="sr-only"
    on:change={handleCheckboxChange}
    bind:checked={isChecked} />
  <span
  class={`dark text-body-color flex items-center space-x-[6px] rounded py-2 px-[18px] text-sm font-medium ${!isChecked ? 'selected' : ''}`}>
    1H
  </span>
  <span
  class={`light text-primary bg-gray dark:bg-dark-3 flex items-center space-x-[6px] rounded py-2 px-[18px] text-sm font-medium ${isChecked ? 'selected' : ''}`}>
    1D
  </span>
</label>

<style lang="postcss">
  .selected {
    @apply bg-midnight-300;
  }
</style>
