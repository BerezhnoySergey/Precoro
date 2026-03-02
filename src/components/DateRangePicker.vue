<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import CalendarIcon from "../assets/images/icons/calendar.svg";
import CancelIcon from "../assets/images/icons/cancel.svg";
import CrossIcon from "../assets/images/icons/cross.svg";
import Check from "../assets/images/icons/check.svg";

const props = defineProps<{
	modelValue: { start: string | Date; end: string | Date };
	required?: boolean;
	isEnabled?: boolean;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: { start: string; end: string }): void;
}>();

const internalValue = ref<[Date, Date] | null>(null);
const pickerVisible = ref(false);

const formatDate = (date: Date) =>
	`${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;

const displayRange = computed(() => {
	if (!internalValue.value) return ["yyyy-mm-dd", "yyyy-mm-dd"];
	return internalValue.value.map(formatDate);
});

watch(
	() => props.modelValue,
	(value) => {
		const start = value.start ? new Date(value.start) : null;
		const end = value.end ? new Date(value.end) : null;
		internalValue.value = start && end ? [start, end] : null;
	},
	{ immediate: true },
);

const handleInputClick = () => {
	pickerVisible.value = !pickerVisible.value;
};

const handleClickOutside = (e: MouseEvent) => {
	const target = e.target as HTMLElement;
	if (
		!target.closest(".datepicker-input") &&
		!target.closest(".datepicker-menu")
	) {
		pickerVisible.value = false;
	}
};

if (typeof window !== "undefined") {
	window.addEventListener("click", handleClickOutside);
}

const clearRange = () => {
	internalValue.value = null;
};

const onPickerUpdate = (value) => {
	internalValue.value = value;
	if (
		value &&
		value[0] &&
		value[1] &&
		value[0].getTime() !== value[1].getTime()
	) {
		pickerVisible.value = false;
	}
};
</script>

<template>
	<div class="flex gap-2 items-center justify-between">
		<div class="flex flex-col">
			<div class="flex items-center">
				<p class="text-[20px] font-bold mr-[6px]">Vacation mode</p>
				<button
					type="button"
					disabled
					:class="
						isEnabled
							? 'flex h-[20px] items-center gap-1 rounded-[22px] px-2 text-[12px] font-medium leading-[10px]'
							: 'flex h-[20px] items-center gap-1 rounded-[22px] px-2 text-[12px] font-medium leading-[10px]'
					"
					:style="
						isEnabled
							? 'background: rgba(225,246,233,1); color: rgba(0,163,56,1);'
							: 'background: rgba(238,240,246,1); color: rgba(94,106,117,1);'
					"
				>
					<img
						v-if="isEnabled"
						:src="Check"
						alt=""
						style="width: 8px; height: 8px; flex-shrink: 0"
					/>
					<img
						v-else
						:src="CrossIcon"
						alt=""
						style="width: 8px; height: 8px; flex-shrink: 0"
					/>
					<span>{{ isEnabled ? "Enabled" : "Disabled" }}</span>
				</button>
			</div>
			<p
				class="font-medium text-[rgba(94,106,117,1)] text-[14px] leading-[20px]"
			>
				Select Date, Substitute User and Backup Approver to Enable Vacation
				Mode.
			</p>
		</div>

		<!-- DatePicker -->
		<div class="relative w-[285px]">
			<div
				:class="[
					'datepicker-input flex items-center gap-2 border border-[rgba(29,36,82,0.1)] rounded cursor-pointer bg-white min-h-[40px]',
					internalValue && internalValue[0] && internalValue[1]
						? 'px-2'
						: 'px-3',
				]"
				@click="handleInputClick"
			>
				<img :src="CalendarIcon" alt="Date" class="w-4 h-4" />
				<div class="flex items-center gap-1 text-[14px] font-medium">
					<span class="text-[rgba(29,36,82,1)]">From</span>
					<span
						:class="
							!internalValue || !internalValue[0]
								? 'text-[rgba(29,36,82,0.5)]'
								: 'font-semibold text-[rgba(29,36,82,1)]'
						"
					>
						{{ displayRange[0] }}
					</span>
					<span class="text-[rgba(29,36,82,1)]">to</span>
					<span
						:class="
							!internalValue || !internalValue[1]
								? 'text-[rgba(29,36,82,0.5)]'
								: 'font-semibold text-[rgba(29,36,82,1)]'
						"
					>
						{{ displayRange[1] }}
					</span>
				</div>
				<button
					v-if="internalValue && internalValue[0] && internalValue[1]"
					type="button"
					class="ml-auto"
					@click.stop="clearRange"
				>
					<img :src="CancelIcon" alt="clear" class="w-8 h-8" />
				</button>
			</div>

			<div
				v-if="pickerVisible"
				class="absolute left-0 top-[110%] z-20 bg-white rounded shadow-lg"
			>
				<VueDatePicker
					v-model="internalValue"
					@update:model-value="onPickerUpdate"
					range
					inline
					:enable-time-picker="false"
					:action-row="{ showPreview: false }"
					format="dd.MM.yyyy"
					class="p-2"
				/>
			</div>
		</div>
	</div>
</template>
