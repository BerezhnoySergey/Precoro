<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { UserOption } from "../types";
import ArrowDownIcon from "../assets/ArrowDown.svg";
import CancelIcon from "../assets/Cancel.svg";

const props = defineProps<{
	modelValue: UserOption | null;
	options: UserOption[];
	placeholder?: string;
	loading?: boolean;
	required?: boolean;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: UserOption | null): void;
	(e: "search", value: string): void;
}>();

const isOpen = ref(false);
const query = ref("");
const debounced = ref<number | null>(null);

const displayValue = computed(() => props.modelValue?.fullName ?? "");

watch(
	() => query.value,
	(value) => {
		if (debounced.value) window.clearTimeout(debounced.value);
		debounced.value = window.setTimeout(() => {
			emit("search", value);
		}, 300);
	},
);

function selectOption(option: UserOption) {
	emit("update:modelValue", option);
	isOpen.value = false;
	query.value = "";
}

function clearSelection() {
	emit("update:modelValue", null);
}

function onFocus() {
	isOpen.value = true;
	emit("search", query.value);
}

function onBlur() {
	setTimeout(() => {
		isOpen.value = false;
	}, 150);
}
</script>

<template>
	<div class="relative w-full">
		<label
			v-if="placeholder"
			class="mb-2 block text-xs font-medium text-slate-500"
		>
			{{ placeholder }}<span v-if="required" class="text-rose-500"> *</span>
		</label>
		<div class="relative w-full">
			<input
				:value="displayValue"
				@input="query = ($event.target as HTMLInputElement).value"
				@focus="onFocus"
				@blur="onBlur"
				placeholder="Select"
				class="w-full bg-transparent pr-10 pl-0 py-2 text-sm text-slate-900 outline-none border-none focus:ring-0 cursor-pointer"
				style="border: none; box-shadow: none"
			/>
			<button
				v-if="modelValue"
				type="button"
				class="absolute right-[16px] top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer"
				@click.prevent="clearSelection"
			>
				<img :src="CancelIcon" alt="clear" class="w-4 h-4" />
			</button>
			<span
				v-else
				class="absolute right-[16px] top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
			>
				<img :src="ArrowDownIcon" alt="open" class="w-4 h-4" />
			</span>
		</div>

		<div
			v-if="isOpen"
			class="absolute z-20 mt-2 w-full rounded-lg border border-slate-200 bg-white shadow-sm h-[200px] overflow-auto pointer-events-auto hover:shadow-md hover:border-slate-300"
		>
			<div v-if="loading" class="px-3 py-2 text-xs text-slate-400">
				Loading...
			</div>
			<ul v-else class="max-h-56 overflow-auto py-1">
				<li
					v-for="option in options"
					:key="option.id"
					class="cursor-pointer px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
					@click="selectOption(option)"
				>
					<div class="font-medium text-slate-900">{{ option.fullName }}</div>
					<div v-if="option.email" class="text-xs text-slate-400">
						{{ option.email }}
					</div>
				</li>
				<li v-if="!options.length" class="px-3 py-2 text-xs text-slate-400">
					No users found
				</li>
			</ul>
		</div>
	</div>
</template>
