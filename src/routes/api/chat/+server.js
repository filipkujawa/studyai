import { json } from '@sveltejs/kit';
import { OPENAI_API_KEY } from '$env/static/private';
import OpenAI from 'openai';

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY
});

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { chats } = await request.json();

	console.log(chats);

	const response = await openai.chat.completions.create({
		model: 'gpt-4-turbo',
		messages: chats
	});

	let chat = response.choices[0].message.content;
	console.log(chat);

	return json({ success: true, chat });
}
