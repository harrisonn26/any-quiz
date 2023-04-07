<script>
	import { goto } from '$app/navigation';
	import 'carbon-components-svelte/css/all.css';
	import {
		TextInput,
		Slider,
		Form,
		Select,
		SelectItem,
		Button,
		Loading
	} from 'carbon-components-svelte';

	import { navigating } from '$app/stores';

	let validState = {
		quizName: true,
		numQuestions: true,
		difficulty: true
	};
	let quizName = '';
	let numQuestions = 5;
	let difficulty = 'simple';

	let quizLoading = false;

	function submit(form) {
		form.preventDefault();
		if (validate()) {
			quizLoading = true;
			window.location.assign(
				`/quiz/${quizName}?questions=${numQuestions}&difficulty=${difficulty}`
			);
		}
	}
	function validate() {
		if (quizName.length < 3) {
			validState.quizName = false;
			validState = { ...validState };
			return false;
		}
		if (numQuestions < 5 || numQuestions > 50) {
			validState.numQuestions = false;
			validState = { ...validState };
			return false;
		}
		if (difficulty.length < 1) {
			validState.difficulty = false;
			validState = { ...validState };
			return false;
		}
		return true;
	}
</script>

<div class="container">
	<h1 class="title">Any Quiz</h1>
	<Form on:submit={submit}>
		<TextInput
			on:keydown={(event) => {
				if (event.key === 'Enter') {
					event.preventDefault();
				}
			}}
			bind:value={quizName}
			invalid={!validState.quizName}
			invalidText="Quiz Name must be at least 3 characters long."
			id="quizName"
			size="xl"
			labelText="Quiz Name"
			placeholder="Enter quiz name..."
		/>
		<div class="spacer" />
		<Slider
			bind:value={numQuestions}
			invalid={!validState.numQuestions}
			id="numQuestions"
			class="slider"
			labelText="Number of Questions"
			min={5}
			max={50}
		/>
		<div class="spacer" />
		<Select
			bind:value={difficulty}
			invalid={!validState.difficulty}
			invalidText="Please select a difficulty."
			id="difficulty"
			labelText="Difficulty"
		>
			<SelectItem value="simple" text="Simple" />
			<SelectItem value="easy" text="Easy" />
			<SelectItem value="medium" text="Medium" />
			<SelectItem value="hard" text="Hard" />
			<SelectItem value="impossible" text="Impossible" />
		</Select>
		<div class="spacer" />
		<Button type="submit">Generate Quiz</Button>
		{#if quizLoading}
			<Loading />
		{/if}
	</Form>
</div>

<style>
	.container {
		position: absolute;
		width: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
		margin: 16px;
	}
	.title {
		margin: 16px;
	}
	.spacer {
		height: 16px;
	}
</style>
