<script lang="ts">
	import { shortcut } from '$lib/shortcut.js';
	type Card = {
		front: String;
		back: String;
		front_side: boolean;
	};

	export let deck: Card[] = [];
	let currentCardIndex = 0;

	function backHandle() {
		if (currentCardIndex > 0) {
			currentCardIndex--;
		}

		deck[currentCardIndex].front_side = true;
	}

	function nextHandle() {
		if (currentCardIndex < deck.length - 1) {
			currentCardIndex++;
		}
		deck[currentCardIndex].front_side = true;
	}
</script>

<div class="min-h-screen w-screen">
	<div class="flex flex-col justify-center items-center py-24">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<btn
			use:shortcut={{ code: 'Space' }}
			on:click={() => {
				deck[currentCardIndex].front_side = !deck[currentCardIndex].front_side;
			}}
			class="card {deck[currentCardIndex].front_side
				? 'bg-primary'
				: 'bg-neutral-content'} text-primary-content w-1/2 h-48"
		>
			{#if deck[currentCardIndex].front_side}
				<div class="card-body">
					<h2 class="card-title select-none text-2xl">
						{deck[currentCardIndex].front}
					</h2>
				</div>
			{:else}
				<div class="card-body">
					<h2 class="card-title select-none text-2xl">
						{deck[currentCardIndex].back}
					</h2>
				</div>
			{/if}
		</btn>
		<div class="flex flex-row space-x-4 py-6">
			<button class="btn btn-outline" on:click={backHandle} use:shortcut={{ code: 'ArrowLeft' }}>
				Back
			</button>
			<button class="btn btn-outline" on:click={nextHandle} use:shortcut={{ code: 'ArrowRight' }}>
				Next
			</button>
		</div>
	</div>
</div>
