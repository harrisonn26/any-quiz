<script lang="ts">
	import 'carbon-components-svelte/css/all.css';
	import {
		TextInput,
		Slider,
		Form,
		Select,
		SelectItem,
		Button,
		Loading,
		Theme,
		OverflowMenu,
		OverflowMenuItem
	} from 'carbon-components-svelte';
	import type { CarbonTheme } from 'carbon-components-svelte/types/Theme/Theme.svelte';

	let validState = {
		quizName: true,
		numQuestions: true,
		difficulty: true
	};
	let quizName = '';
	let numQuestions = 5;
	let difficulty = 'simple';

	let quizLoading = false;

	let theme: CarbonTheme;

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
	function toggleTheme() {
		if (theme === 'white') theme = 'g90';
		else theme = 'white';
	}
</script>

<Theme persist persistKey="__carbon-theme" bind:theme />
<div class="root">
	<div class="content">
		<div class="header">
			{#if quizName}
				<h1>{'Quiz<' + quizName + '>'}</h1>
			{:else}
				<h1>{'Quiz<any>'}</h1>
			{/if}
			<OverflowMenu flipped={true}>
				<OverflowMenuItem text="Toggle Dark Mode" on:click={toggleTheme} />
			</OverflowMenu>
		</div>
		<div class="container">
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
	</div>
</div>

<style>
	.container {
		margin-top: 32px;
		width: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
	}
	.spacer {
		height: 16px;
	}
	.content {
		max-width: 800px;
		padding-left: 16px;
		padding-right: 16px;
		width: 100%;
	}
	.root {
		display: flex;
		justify-content: center;
	}
	.header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		flex-wrap: wrap;
		width: 100%;
	}
	.dark_mode {
		height: 50px;
		width: 160px;
		display: flex;
		align-items: center;
	}
</style>
