<script>
	let selectedFile;

	function handleFileChange(event) {
		selectedFile = event.target.files[0];
		console.log(selectedFile);
	}
</script>

<div>
	<form method="POST" action="?/image" class="flex flex-col space-y-4">
		<input
			type="file"
			class="file-input file-input-bordered file-input-primary w-full max-w-xs"
			on:change={handleFileChange}
			accept="image/*"
			name="image"
		/>
		<button class="btn btn-outline" disabled={!selectedFile}>Continue</button>
	</form>
</div>
