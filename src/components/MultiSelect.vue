<script setup lang="ts">
import { ref, computed, watch } from "vue";
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

const isSelected = (val: string | number) => props.modelValue.includes(val);

const clearSearch = () => {
	search.value = "";
};

const clearSelection = () => {
	emit("update:modelValue", []);
};

watch(isOpen, (open) => {
	if (!open) clearSearch();
});
</script>

<template>
	<div class="multi-select-wrapper">
		<div v-if="!hideLabel" class="multi-select-label-row">
			<span class="multi-select-label-message">Substitute User</span>
			<span class="multi-select-label-star">*</span>
		</div>
		<div
			class="multi-select-box"
			:class="{ 'no-border': noBorder }"
			@click="isOpen = !isOpen"
			tabindex="0"
		>
			<template v-if="modelValue.length">
				<span class="multi-select-chip">
					{{
						options.find((o) => o.value === modelValue[0])?.label ||
						modelValue[0]
					}}
				</span>
			</template>
			<span v-else class="multi-select-placeholder">{{
				placeholder || "Select..."
			}}</span>
			<button
				v-if="modelValue.length"
				type="button"
				class="multi-select-icon-btn"
				@click.stop="clearSelection"
			>
				<img :src="CancelIcon" alt="clear" style="width: 16px; height: 16px" />
			</button>
			<span v-else class="multi-select-icon-btn" style="pointer-events: none">
				<img
					:src="ArrowDownIcon"
					alt="open"
					style="width: 16px; height: 16px"
				/>
			</span>
		</div>
		<div v-if="isOpen" class="multi-select-dropdown">
			<input
				v-model="search"
				type="text"
				class="multi-select-search"
				:placeholder="'Поиск...'"
				@click.stop
			/>
			<div v-if="!filteredOptions.length" class="multi-select-no-options">
				Нет опций
			</div>
			<div
				v-for="opt in filteredOptions"
				:key="opt.value"
				class="multi-select-option"
				@click.stop="toggleOption(opt.value)"
			>
				<span>{{ opt.label }}</span>
			</div>
		</div>
	</div>
</template>

<style scoped>
.multi-select-wrapper {
	width: 356px;
	position: relative;
}
.multi-select-wrapper:has(.no-border) {
	width: 100%;
}

.multi-select-label-row {
	display: flex;
	align-items: center;
	margin-bottom: 4px;
}
.multi-select-label-message {
	font-family: Inter, sans-serif;
	font-weight: 600;
	font-size: 13px;
	line-height: 15px;
	font-style: normal;
}
.multi-select-label-star {
	color: #e53e3e;
	margin-left: 2px;
	font-family: Inter, sans-serif;
	font-weight: 600;
	font-size: 13px;
	line-height: 15px;
	font-style: normal;
}
.multi-select-box {
	width: 356px;
	height: 34px;
	border-width: 1px;
	border-radius: 8px;
	padding-top: 1px;
	padding-bottom: 1px;
	background: rgba(255, 255, 255, 1);
	border: 1px solid rgba(29, 36, 82, 0.3);
	display: flex;
	flex-wrap: nowrap;
	gap: 4px;
	align-items: center;
	cursor: pointer;
	box-sizing: border-box;
	padding-left: 8px;
	padding-right: 8px;
	position: relative;
}
.multi-select-icon-btn {
	margin-left: auto;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	background: none;
	border: none;
	padding: 0;
	margin-right: 4px;
	flex-shrink: 0;
}
.multi-select-placeholder {
	color: #bdbdbd;
	font-family: Inter, sans-serif;
	font-weight: 500;
	font-size: 14px;
	line-height: 144%;
	vertical-align: middle;
}
.multi-select-chip {
	background: #e8f0fe;
	color: #1d2452;
	border-radius: 4px;
	padding: 2px 8px;
	font-family: Inter, sans-serif;
	font-weight: 500;
	font-size: 14px;
	line-height: 144%;
	vertical-align: middle;
	display: flex;
	align-items: center;
}
.multi-select-box.no-border {
	border: none;
	border-radius: 0;
	width: 100%;
	height: 100%;
	padding-top: 0;
	padding-bottom: 0;
}
.multi-select-dropdown {
	position: absolute;
	left: 0;
	right: 0;
	margin-top: 2px;
	background: #fff;
	border: 1px solid rgba(29, 36, 82, 0.3);
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	z-index: 100;
	max-height: 180px;
	overflow-y: auto;
}
.multi-select-search {
	width: 100%;
	padding: 4px 8px;
	border: none;
	border-bottom: 1px solid #e0e0e0;
	outline: none;
	font-family: Inter, sans-serif;
	font-size: 14px;
	margin-bottom: 4px;
	box-sizing: border-box;
}
.multi-select-no-options {
	padding: 8px;
	color: #bdbdbd;
	font-size: 13px;
}
.multi-select-option {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 6px 12px;
	cursor: pointer;
	font-family: Inter, sans-serif;
	font-size: 14px;
	border-radius: 4px;
	transition: background 0.15s;
}
.multi-select-option:hover {
	background: #f5f7fa;
}
</style>
