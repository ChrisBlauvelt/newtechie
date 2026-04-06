<script>
	import "../app.css";
	import "../tailwind.css";
	import { inject } from "@vercel/analytics";
	import { onMount } from "svelte";
	import BlueprintBackground from "$lib/components/BlueprintBackground.svelte";

	// Initialize Vercel Analytics
	onMount(() => {
		inject();
	});
</script>

<BlueprintBackground />
<slot />
