import { OPENAI_API_KEY } from '$env/static/private';

export const actions = {
	image: async ({ cookies, request }) => {
		const formdata = await request.formData();
		const image = formdata.get('image');

		console.log(image);
	}
};
