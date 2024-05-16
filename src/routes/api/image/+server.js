import { json } from '@sveltejs/kit';
import { OPENAI_API_KEY } from '$env/static/private';
import OpenAI from 'openai';

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY
});

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { base64 } = await request.json();

	//console.log('base64', base64);

	const response = await openai.chat.completions.create({
		model: 'gpt-4-turbo',
		messages: [
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: "You are my studying assistant. You will receive a photo of a student's notes and you will need to create flashcards for them. Your response should be only the flashcards in this format: {front of card 1}:{back of card 1}*{front of card 2}:{back of card2}... "
					},
					{
						type: 'image_url',
						image_url: {
							url: base64,
							detail: 'auto'
						}
					}
				]
			}
		]
	});

	let flashcards_txt = response.choices[0].message.content;
	console.log(flashcards_txt);

	// Sleep 5 seconds (DEV: Testing loading spinner)
	// await new Promise((resolve) => setTimeout(resolve, 5000));

	// Create deck
	let deck = [];

	// Split flashcards
	let flashcards = flashcards_txt.split('*');
	for (let i = 0; i < flashcards.length; i++) {
		let card = flashcards[i].split(':');
		deck.push({ front: card[0], back: card[1] });
	}

	return json({ success: true, deck, flashcards_txt });
}
