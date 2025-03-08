<template>
	<div class="flex flex-wrap gap-2">
		<fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
			<legend class="fieldset-legend">Login</legend>
			
			<label class="fieldset-label">Simple Input</label>
			<input type="email" class="input" placeholder="Email" />

			<label class="input mt-3">
				<svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path></g></svg>
				<div class="divider divider-horizontal h-full mx-0"></div>
				<input type="text" class="grow" placeholder="index.php" />
			</label>


			<div class="mt-3">
				<label>Label translate</label>

				<div class="input input-on mt-3">
					<label class="input-on-label">Test</label>
					<input type="text" class="grow" placeholder="" />
				</div>

				<label class="input mt-3">
					<svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path></g></svg>
					<div class="divider divider-horizontal mx-0"></div>
					<div class="input-on h-full">
						<label class="input-on-label left-0">index.php</label>
						<input type="text" class="grow" placeholder="" />
					</div>
				</label>
			</div>

			
			<div class="mt-3">
				<label>Label static</label>

				<div class="input input-on mt-3">
					<label class="input-on-label static">Test</label>
					<input type="text" class="grow" placeholder="" />
				</div>

				<label class="input mt-3">
					<svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path></g></svg>
					<div class="divider divider-horizontal mx-0"></div>
					<div class="input-on h-full">
						<label class="input-on-label static left-0">index.php</label>
						<input type="text" class="grow" placeholder="" />
					</div>
				</label>
			</div>
			
		</fieldset>


		<fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
			<legend class="fieldset-legend">Patterns</legend>
			<div class="flex flex-wrap gap-2 w-125">
				<div class="pattern-cube pattern-white size-60"></div>
				<div class="pattern-cube size-60"></div>

				<div class="pattern-dots size-60"></div>

				<div class="pattern-line size-60"></div>
				<div class="pattern-line pattern-black size-60"></div>
			</div>
		</fieldset>


	</div>
</template>
