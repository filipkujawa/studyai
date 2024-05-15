import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { base64 } = await request.json();

	// Sleep 5 seconds (DEV: Testing loading spinner)
	// await new Promise((resolve) => setTimeout(resolve, 5000));

	// Create deck
	let deck = [];
	// (DEV: For testing without openai)
	for (let i = 0; i < 52; i++) {
		deck.push({
			front: i.toString(),
			back: 'test',
			front_side: true
		});
	}

	return json({ success: true, deck });
}
