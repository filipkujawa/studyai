<script lang="ts">
	import Flashcard from '$lib/Flashcard.svelte';
	import type Card from '$lib/Flashcard.svelte';
	type Card = {
		front: String;
		back: String;
		front_side: boolean;
	};
	enum Page {
		FileUpload,
		Loading,
		Flashcards,
		Chat
	}

	let page: Page = Page.FileUpload;

	let selectedFile: File;
	let flashcards: Card[] = [
		{
			front: 'Front',
			back: 'Back',
			front_side: true
		}
	];

	function handleFileChange(event) {
		selectedFile = event.target.files[0];
		console.log(selectedFile);
	}

	const toBase64 = (file: File) =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = reject;
		});

	async function handleImage() {
		page = Page.Loading;
		const base64 = await toBase64(selectedFile);
		console.log(base64);
		const response = await fetch('api/image', {
			method: 'POST',
			body: JSON.stringify({ base64 })
		});

		const { success, deck } = await response.json();
		console.log('response', success);
		if (success) {
			flashcards = deck;
			page = Page.Flashcards;
		}
	}
</script>

{#if page == Page.FileUpload}
	<div class="flex flex-col space-y-4">
		<input
			type="file"
			class="file-input file-input-bordered file-input-primary w-full max-w-xs"
			on:change={handleFileChange}
			accept="image/*"
			name="image"
		/>
		<button class="btn btn-outline" disabled={!selectedFile} on:click={handleImage}>Continue</button
		>
	</div>
{:else if page == Page.Loading}
	<div class="flex space-x-4">
		<h1 class="text text-xl font-bold">Cutting out your flashcards</h1>
		<span class="loading loading-spinner loading-lg"></span>
	</div>
{:else if page == Page.Flashcards}
	<Flashcard bind:deck={flashcards} />
{:else if page == Page.Chat}
	<!---->
{/if}
