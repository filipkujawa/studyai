<script lang="ts">
	import Flashcard from '$lib/Flashcard.svelte';
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

	type Chat = {
		role: String;
		content: String;
	};

	let chatHistory: Chat[] = [
		{
			role: 'system',
			content: 'You are a tutor. Keep responses short and concise'
		},
		{
			role: 'assistant',
			content: 'Hello! I am your AI Tutor. How can I help you today?'
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

		const { success, deck, flashcards_txt } = await response.json();
		console.log('response', success);
		if (success) {
			flashcards = deck;
			page = Page.Flashcards;
			// Add flashcards_txt to chat history as context
			chatHistory = [
				...chatHistory,
				{
					role: 'assistant',
					content:
						"Keep responses brief. Student's flashcards from notes for context: " + flashcards_txt
				}
			];
		}
	}

	let chatLoading = false;
	let currentChat = '';

	async function handleChat() {
		chatHistory = [
			...chatHistory,
			{
				role: 'user',
				content: currentChat
			}
		];
		currentChat = '';
		const response = await fetch('api/chat', {
			method: 'POST',
			body: JSON.stringify({ chats: chatHistory })
		});
		const { success, chat } = await response.json();
		if (success) {
			chatHistory = [
				...chatHistory,
				{
					role: 'assistant',
					content: chat
				}
			];
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
	<div class="flex flex-col space-y-4">
		<Flashcard bind:deck={flashcards} />
		<div class="flex justify-center">
			<button
				class="btn btn-outline btn-primary btn-md max-w-48"
				on:click={() => {
					page = Page.Chat;
				}}>Chat with AI Tutor</button
			>
		</div>
	</div>
{:else if page == Page.Chat}
	<div class="flex flex-col space-y-12 w-3/4">
		<div class="chat chat-start space-y-4">
			{#each chatHistory as chat}
				{#if chat.role == 'assistant' && !chat.content.includes('flashcards from notes for context')}
					<div class="chat-bubble min-w-full">{chat.content}</div>
				{:else if chat.role == 'user'}
					<div class="chat-bubble chat-bubble-primary min-w-full">{chat.content}</div>
				{/if}
			{/each}
		</div>
		<div class="flex flex-row space-x-2">
			<input
				bind:value={currentChat}
				type="text"
				placeholder="Type here"
				class="input input-bordered input-primary w-full min-w-lg"
			/>
			<button class="btn btn-primary" disabled={chatLoading} on:click={handleChat}>Send</button>
		</div>
	</div>
{/if}
