<script setup lang="ts">
import {
	ref,
	computed,
	watch,
	nextTick,
	onMounted,
	onBeforeUnmount,
} from "vue";
import ArrowDownIcon from "../assets/images/icons/arrow-down.svg";
import CancelIcon from "../assets/images/icons/cancel.svg";

interface Option {
	label: string;
	value: string | number;
}

const props = defineProps<{
	options: Option[];
	modelValue: (string | number)[];
	placeholder?: string;
	label?: string;
	noBorder?: boolean;
	hideLabel?: boolean;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: (string | number)[]): void;
}>();

const search = ref("");
const isOpen = ref(false);
const wrapperRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const dropdownDirection = ref<"up" | "down">("down");

const filteredOptions = computed(() => {
	if (!search.value) return props.options;
	return props.options.filter((opt) =>
		opt.label.toLowerCase().includes(search.value.toLowerCase()),
	);
});

const toggleOption = (val: string | number) => {
	emit("update:modelValue", [val]);
	isOpen.value = false;
};

const clearSearch = () => {
	search.value = "";
};

const clearSelection = () => {
	emit("update:modelValue", []);
};

const determineDropdownDirection = () => {
	if (!wrapperRef.value) return;
	const wrapperRect = wrapperRef.value.getBoundingClientRect();
	const dropdownHeight = dropdownRef.value?.offsetHeight ?? 0;
	const spaceBelow = window.innerHeight - wrapperRect.bottom;
	const spaceAbove = wrapperRect.top;

	dropdownDirection.value =
		spaceBelow < dropdownHeight && spaceAbove > spaceBelow ? "up" : "down";
};

const handleClickOutside = (event: MouseEvent) => {
	if (!isOpen.value) return;
	if (!wrapperRef.value?.contains(event.target as Node)) {
		isOpen.value = false;
	}
};

const handleWindowResize = () => {
	if (isOpen.value) determineDropdownDirection();
};

onMounted(() => {
	document.addEventListener("click", handleClickOutside);
	window.addEventListener("resize", handleWindowResize);
});

onBeforeUnmount(() => {
	document.removeEventListener("click", handleClickOutside);
	window.removeEventListener("resize", handleWindowResize);
});

watch(isOpen, async (open) => {
	if (!open) {
		clearSearch();
		return;
	}
	await nextTick();
	determineDropdownDirection();
});
</script>

<template>
	<div
		:class="['relative', props.noBorder ? 'w-full' : 'w-[356px]']"
		ref="wrapperRef"
	>
		<div v-if="!hideLabel" class="flex items-center mb-1">
			<span class="font-semibold text-[13px] leading-[15px]"
				>Substitute User</span
			>
			<span class="text-red-600 ml-0.5 font-semibold text-[13px] leading-[15px]"
				>*</span
			>
		</div>

		<div
			:class="[
				'flex items-center gap-1 cursor-pointer p-[1px_8px] rounded-lg',
				props.noBorder
					? 'w-full h-full border-0 rounded-none'
					: 'w-[356px] h-[34px] border border-[#1d24524d]',
				isOpen ? 'border-[#1d24524d]' : '',
			]"
			@click="isOpen = !isOpen"
			tabindex="0"
		>
			<template v-if="modelValue.length">
				<span
					class="bg-[#e8f0fe] text-[#1d2452] rounded px-2 py-[2px] text-[14px] leading-[144%] flex items-center"
				>
					{{
						options.find((o) => o.value === modelValue[0])?.label ||
						modelValue[0]
					}}
				</span>
			</template>
			<span v-else class="text-gray-400 font-medium text-[14px] leading-[144%]">
				{{ placeholder || "Select..." }}
			</span>

			<button
				v-if="modelValue.length"
				type="button"
				class="ml-auto flex items-center justify-center p-0 mr-1 cursor-pointer bg-none border-none"
				@click.stop="clearSelection"
			>
				<img :src="CancelIcon" alt="clear" width="16" height="16" />
			</button>
			<span
				v-else
				class="ml-auto flex items-center justify-center p-0 mr-1 pointer-events-none"
			>
				<img :src="ArrowDownIcon" alt="open" width="12" height="8" />
			</span>
		</div>

		<div
			v-if="isOpen"
			ref="dropdownRef"
			:class="[
				'absolute left-0 right-0 bg-white border border-[#1d24521a] rounded shadow-md z-10 max-h-[220px] overflow-y-auto flex flex-col',
				dropdownDirection === 'up' ? 'bottom-full top-auto' : 'top-full',
			]"
			@click.stop
		>
			<div class="sticky top-0 bg-white border-b border-gray-200 z-10">
				<input
					v-model="search"
					type="text"
					class="w-full border-none outline-none bg-transparent text-[14px] p-2"
					placeholder="Поиск..."
				/>
			</div>

			<div v-if="!filteredOptions.length" class="p-2 text-gray-400 text-[13px]">
				No options
			</div>

			<div
				v-for="opt in filteredOptions"
				:key="opt.value"
				class="flex items-center gap-2 px-3 py-1.5 cursor-pointer text-[14px] rounded hover:bg-gray-100"
				@click.stop="toggleOption(opt.value)"
			>
				<span>{{ opt.label }}</span>
			</div>
		</div>
	</div>
</template>
