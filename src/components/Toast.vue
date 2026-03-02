<script setup lang="ts">
import { watch, ref } from "vue";
import SuccessIcon from "../assets/images/icons/success.svg";

const props = defineProps<{
	message: string;
	duration?: number;
}>();

const emit = defineEmits<{
	(e: "close"): void;
}>();

const visible = ref(false);
let timer: ReturnType<typeof setTimeout> | null = null;

watch(
	() => props.message,
	(val) => {
		if (!val) return;
		visible.value = true;
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			visible.value = false;
			emit("close");
		}, props.duration ?? 3000);
	},
	{ immediate: true },
);

function close() {
	visible.value = false;
	if (timer) clearTimeout(timer);
	emit("close");
}
</script>

<template>
	<Transition name="toast">
		<div
			v-if="visible && message"
			class="fixed top-[7.5%] right-[1%] z-50 flex items-center gap-2 pl-2 bg-white rounded-[4px] border-l-4 border-[#3fb34f] transition-opacity duration-500 drop-shadow-lg"
		>
			>
			<img
				:src="SuccessIcon"
				alt="Success"
				class="block w-[1.8rem] h-[1.8rem] mr-[9px] ml-[9px]"
			/>

			<div
				class="min-w-[16rem] flex flex-col items-start gap-[0.15rem] py-[0.35rem] px-[0.25rem] border-r border-[rgba(29,36,82,0.1)]"
			>
				<div class="text-sm font-bold text-[#1d2452]">SUCCESS</div>
				<div class="text-sm font-medium text-[rgba(29,36,82,0.5)]">
					{{ message }}
				</div>
			</div>

			<button
				class="text-[10px] font-medium text-[rgba(29,36,82,0.5)] cursor-pointer hover:text-[rgba(29,36,82,0.8)] ml-[8px] mr-[8px]"
				@click="close"
			>
				CLOSE
			</button>
		</div>
	</Transition>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
	transition: opacity 0.5s ease-in-out;
}
.toast-enter-from,
.toast-leave-to {
	opacity: 0;
}
</style>
