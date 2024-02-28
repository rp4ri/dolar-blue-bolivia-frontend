<script lang="ts">
    import { onMount } from 'svelte';
  
    export let words: string[] = [];
    export let interval: number = 8000; // Intervalo total para cada palabra
  
    let currentWord = '';
    let deleting = false;
    let currentWordIndex = 0;
    let currentCharIndex = 0;
  
    onMount(() => {
      const updateText = () => {
        const targetWord = words[currentWordIndex];
  
        if (!deleting) {
          currentCharIndex++;
          currentWord = targetWord.slice(0, currentCharIndex);
          if (currentWord === targetWord) {
            setTimeout(() => { deleting = true; }, interval / 4); // Espera antes de empezar a borrar
          }
        } else {
          currentCharIndex--;
          currentWord = targetWord.slice(0, currentCharIndex);
          if (currentCharIndex === 0) {
            deleting = false;
            currentWordIndex = (currentWordIndex + 1) % words.length;
          }
        }
      };
  
      const intervalId = setInterval(updateText, interval / 100 + 50); // Ajusta para controlar la velocidad de escritura/borrado
  
      return () => {
        clearInterval(intervalId);
      };
    });
  </script>
  
  <span>{currentWord}</span>
  