<template>
	<div class="flex justify-between items-center w-full">
		<div class="flex flex-col">
			<div
				class="font-inter font-semibold text-[16px] text-[rgba(29,36,82,1)] leading-5 mt-[17px]"
			>
				Substitute User
			</div>
			<p
				class="font-inter font-normal text-[14px] text-[rgba(29,36,82,0.5)] leading-5 mb-[26px]"
			>
				Performs approval actions while you are away.
			</p>
		</div>
		<div class="flex flex-col items-end">
			<MultiSelect
				:options="options"
				:model-value="modelValue"
				@update:modelValue="(val) => $emit('update:modelValue', val)"
				placeholder="Select Substitute"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import MultiSelect from "./MultiSelect.vue";

const props = defineProps<{
	options: { label: string; value: string | number }[];
}>();
const modelValue = defineModel<(string | number)[]>({ required: true });
</script>
