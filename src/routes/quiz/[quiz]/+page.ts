export const load = async ({ fetch, params }) => {
	return await myPromise;
};

const myPromise = new Promise((resolve) => {
	setTimeout(() => {
		resolve(quiz);
	}, 5000);
});
const quiz = {
	name: 'France',
	difficulty: 'easy',
	length: 1,
	answers: 4,
	data: [
		{
			question: 'What is the capital of France?',
			answers: [
				{ text: 'Paris', correct: true },
				{ text: 'London', correct: false },
				{ text: 'Berlin', correct: false },
				{ text: 'Madrid', correct: false }
			]
		}
	]
};
