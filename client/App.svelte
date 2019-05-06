<script>
	import { onMount } from 'svelte';

	onMount(() => {
		fetchQuotes();
	});

	let quotes = [];

	// async data fetching function
	var myHeaders = new Headers();
	myHeaders.append('Accept', 'application/json');
	const fetchQuotes = async () => {
		const response = await fetch(`/api/v1/items`, {headers: myHeaders});
		const json = await response.json();
		quotes = json;
	}
</script>

<style>
</style>

<div id="app">
	{JSON.stringify(quotes)}
</div>
