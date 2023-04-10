import * as functions from 'firebase-functions';
import { Configuration, OpenAIApi } from 'openai';
import { OPENAI_API } from './config';
const cors = require('cors')({ origin: true });

export const getQuiz = functions.https.onRequest((request, response) => {
	cors(request, response, async () => {
		if (
			request.method === 'GET' &&
			request.query.topic &&
			request.query.numQuestions &&
			request.query.difficulty
		) {
			const confirguration = new Configuration({
				apiKey: OPENAI_API
			});
			const openai = new OpenAIApi(confirguration);

			const prompt = `topic: ${request.query.topic}, length: ${request.query.numQuestions}, difficulty: ${request.query.difficulty}}`;

			const quiz = await openai.createChatCompletion({
				model: 'gpt-3.5-turbo',
				messages: [
					{
						role: 'system',
						content: `You are a quiz generation bot, 
									you are given the parameters topic (the topic of the quiz), 
									length (the number of questions in the quiz) 
									and difficulty (the difficulty of the quiz). 
									You respond with a one line json string of format: 
									{
										"topic":<topic>,
										"difficulty":<difficulty>,
										"length": <length>,
										data: [
											{
												"question": ...,
												"answers": [
													{
														"text": ...,
														"correct":...,
													}
												]
											}
										]
									}
								Each question must have 4 answers, one of which is correct, randomise the 
								positon of the correct answer in the answers array.
								You should not generate questions that reference current events.
								You can only respond with the above json in one line string format or a message saying 
								"Could not generate quiz" if you cannot generate a quiz with the given parameters.
								`
					},
					{
						role: 'user',
						content: prompt
					}
				]
			});
			const data = quiz.data.choices[0].message?.content;
			response.json(data);
		} else {
			response.status(400).json({ error: 'Invalid request' });
		}
	});
});
