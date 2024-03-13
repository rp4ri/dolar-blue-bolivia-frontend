import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte from '@astrojs/svelte';
import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  site: "https://dolarbluebolivia.lat/",
  integrations: [tailwind(), mdx(), sitemap(), svelte(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
});
