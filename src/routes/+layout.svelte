<script>
	import { Theme } from 'carbon-components-svelte';
	export let data;
</script>

<div class="root">
	<div class="content">
		<div class="header">
			{#if data?.topic}
				<h1>{'Quiz<' + data?.topic + '>'}</h1>
			{:else}
				<h1>{'Quiz<any>'}</h1>
			{/if}
			<div class="dark_mode">
				<Theme
					persist
					persistKey="__carbon-theme"
					render="toggle"
					toggle={{
						themes: ['g10', 'g90'],
						labelA: 'Enable dark mode',
						labelB: 'Enable dark mode',
						hideLabel: true,
						size: 'sm'
					}}
				/>
			</div>
		</div>
		<slot />
	</div>
</div>

<style>
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
