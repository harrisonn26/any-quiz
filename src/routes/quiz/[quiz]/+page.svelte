<script lang="ts">
	import MediaQuery from 'svelte-media-queries';
	import {
		Tile,
		SkeletonPlaceholder,
		ButtonSet,
		ProgressBar,
		SkeletonText,
		Theme,
		Toggle
	} from 'carbon-components-svelte';
	import 'carbon-components-svelte/css/all.css';
	import { page } from '$app/stores';
	import type { CarbonTheme } from 'carbon-components-svelte/types/Theme/Theme.svelte.js';

	export let data;

	interface Quiz {
		topic: string;
		difficulty: Difficulty;
		length: number;
		data: Array<Question>;
	}
	enum Difficulty {
		'simple',
		'easy',
		'medium',
		'hard',
		'impossible'
	}
	interface Question {
		question: string;
		answers: Array<Answer>;
	}
	interface Answer {
		text: string;
		correct: boolean;
	}
	let quiz: Promise<Quiz> = getQuiz();
	let answerRevealed: Array<boolean>;

	async function getQuiz(): Promise<Quiz> {
		const res = await fetch(
			`https://us-central1-anyquiz.cloudfunctions.net/getQuiz?topic=${
				data.topic
			}&numQuestions=${$page.url.searchParams.get(
				'questions'
			)}&difficulty=${$page.url.searchParams.get('difficulty')}`
		);
		const json: Quiz = JSON.parse(await res.json());

		answerRevealed = new Array(json.data.length).fill(false);
		return json;
	}

	function revealAnswer(index: number): void {
		answerRevealed[index] = true;
	}
</script>

{#await quiz}
	<div class="loading">
		<ProgressBar helperText="Generating Quiz..." />
	</div>
	{#each Array(5) as _}
		<Tile>
			<SkeletonText heading />
			<div class="answers_container">
				<ButtonSet>
					{#each Array(4) as _}
						<SkeletonPlaceholder style="width: 25%; height: 65px; margin: 1px;" />
					{/each}
				</ButtonSet>
			</div>
		</Tile>
		<div class="spacer" />
	{/each}
{:then quiz}
	{#each quiz.data as item, i}
		<Tile>
			<h2>{item.question}</h2>
			<div class="answers_container">
				<MediaQuery query="(max-width: 550px)" let:matches>
					<ButtonSet>
						{#each item.answers as answer, j}
							{#if j % 2 || !matches}
								<div
									class="answer_button"
									class:correct_answer={answer.correct && answerRevealed[i]}
									class:incorrect_answer={!answer.correct && answerRevealed[i]}
									on:click={() => revealAnswer(i)}
								>
									{answer.text}
								</div>
							{/if}
						{/each}
					</ButtonSet>
					{#if matches}
						<ButtonSet>
							{#each item.answers as answer, k}
								{#if k % 2 === 0}
									<div
										class="answer_button"
										class:correct_answer={answer.correct && answerRevealed[i]}
										class:incorrect_answer={!answer.correct && answerRevealed[i]}
										on:click={() => revealAnswer(i)}
									>
										{answer.text}
									</div>
								{/if}
							{/each}
						</ButtonSet>
					{/if}
				</MediaQuery>
			</div>
		</Tile>
		<div class="spacer" />
	{/each}
{:catch}
	<h3>Cannot load quiz</h3>
{/await}

<style>
	h1 {
		margin: 32px;
	}
	.spacer {
		height: 32px;
	}
	.answers_container {
		margin-top: 16px;
	}
	.answer_button {
		background-color: rgb(28, 98, 251);
		color: white;
		width: 25%;
		height: 65px;
		padding: 16px;
		margin: 1px;
		cursor: pointer;
	}
	.correct_answer {
		background-color: #4caf50;
		cursor: auto;
	}
	.incorrect_answer {
		background-color: #ff4b4b;
		cursor: auto;
	}
	.loading {
		margin-top: 32px;
		margin-bottom: 32px;
	}

	@media (max-width: 550px) {
		.answer_button {
			width: 100%;
		}
	}
</style>
