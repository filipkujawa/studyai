<script>
	let selectedFile;

	function handleFileChange(event) {
		selectedFile = event.target.files[0];
		console.log(selectedFile);
	}

	const toBase64 = (file) =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = reject;
		});

	async function handleImage() {
		const base64 = await toBase64(selectedFile);
		console.log(base64);
		const response = await fetch('api/image', {
			method: 'POST',
			body: JSON.stringify({ base64 })
		});

		const { success } = await response.json();
		console.log('response', success);
	}
</script>

<div class="flex flex-col space-y-4">
	<input
		type="file"
		class="file-input file-input-bordered file-input-primary w-full max-w-xs"
		on:change={handleFileChange}
		accept="image/*"
		name="image"
	/>
	<button class="btn btn-outline" disabled={!selectedFile} on:click={handleImage}>Continue</button>
</div>
