<script>
	let selectedFile;

	function handleFileChange(event) {
		selectedFile = event.target.files[0];
		console.log(selectedFile);
	}

	async function imageToBase64(file) {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			const base64 = reader.result;
			console.log(base64);
			return base64;
		};
		reader.onerror = (error) => {
			console.error(error);
		};
	}

	async function handleImage() {
		const reader = new FileReader();
		reader.readAsDataURL(selectedFile);
		reader.onload = async () => {
			const base64 = reader.result;
			console.log(base64);
			const response = await fetch('api/image', {
				method: 'POST',
				body: JSON.stringify({ base64 })
			});

			const { success } = await response.json();
			console.log('response', success);
		};
		reader.onerror = (error) => {
			console.error(error);
		};
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
