import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { base64 } = await request.json();

	return json({ success: true });
}
