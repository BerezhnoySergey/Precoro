<script setup lang="ts">
import { computed } from "vue";
import MultiSelect from "./MultiSelect.vue";
import type { BackupApproverRow, UserOption } from "../types";

const props = defineProps<{
	rows: BackupApproverRow[];
	options: UserOption[];
	selections: Record<number, UserOption | null>;
	loading?: boolean;
	canUpdate?: boolean;
}>();

const emit = defineEmits<{
	(e: "select", rowId: number, value: UserOption | null): void;
	(e: "search", value: string): void;
}>();

function getSelectionIds(rowId: number): (string | number)[] {
	const sel = props.selections[rowId];
	return sel ? [sel.id] : [];
}

const groupedRows = computed(() => {
	const groups: Array<{ document: string; rows: BackupApproverRow[] }> = [];
	for (const row of props.rows) {
		const last = groups[groups.length - 1];
		if (last && last.document === row.document) {
			last.rows.push(row);
		} else {
			groups.push({ document: row.document, rows: [row] });
		}
	}
	return groups;
});

const borderColor = "rgba(65,90,218,0.1)";
const border = `1px solid ${borderColor}`;

function rowNameStyle(dIndex: number) {
	const radius = dIndex === 0 ? "0 0 0 0.5rem" : "0.5rem 0 0 0.5rem";
	return `border: ${border}; border-right: none; border-radius: ${radius};`;
}

function stepStyle(sIndex: number, total: number) {
	const isFirst = sIndex === 0;
	const isLast = sIndex === total - 1;
	let s = `border: ${border}; border-right: none;`;
	s += isLast ? "" : " border-bottom: none;";
	if (isLast && !isFirst) s += ` border-radius: 0 0 0 0.5rem;`;
	return s;
}

function selectStyle(dIndex: number, sIndex: number, total: number) {
	const isFirst = sIndex === 0;
	const isLast = sIndex === total - 1;
	let s = `border: ${border};`;
	s += isLast ? "" : " border-bottom: none;";
	if (isFirst) {
		s += dIndex === 0 ? " border-radius: 0;" : " border-radius: 0 0.5rem 0 0;";
	} else if (isLast) {
		s += " border-radius: 0 0 0.5rem 0;";
	}
	return s;
}
</script>

<template>
	<div class="mt-6 pb-[72px]">
		<p
			class="font-inter font-semibold text-[16px] text-[#1d2452] leading-5 mt-[20px]"
		>
			Backup Approver
		</p>
		<p
			class="font-inter font-normal text-[14px] text-[#8a94a6] leading-5 mb-[16px]"
		>
			Performs approval actions while you are away. Below, you can select the
			necessary Approvers.
		</p>

		<div
			class="grid gap-y-[1.35rem]"
			style="grid-template-columns: 8fr 13fr 12.3fr"
		>
			<!-- Header -->
			<div
				class="col-span-full grid bg-[#eceefb] rounded-t-[0.5rem]"
				style="grid-template-columns: subgrid"
			>
				<div class="py-[0.4rem] px-4 text-[#555b7d] text-xs font-semibold">
					Document
				</div>
				<div
					class="py-[0.4rem] px-4 text-[#555b7d] text-xs font-semibold border-l border-[rgba(29,36,82,0.05)]"
				>
					Approval Step
				</div>
				<div
					class="py-[0.4rem] px-4 text-[#555b7d] text-xs font-semibold border-l border-[rgba(29,36,82,0.05)]"
				>
					Backup Approver
				</div>
			</div>

			<!-- Groups -->
			<transition-group name="table">
				<div
					v-for="(group, dIndex) in groupedRows"
					:key="group.document"
					class="col-span-full grid"
					:class="{ '-mt-[1.35rem]': dIndex === 0 }"
					style="grid-template-columns: subgrid"
				>
					<!-- Document name -->
					<div
						class="h-fit py-[9px] px-4 text-sm font-semibold text-[#1d2452]"
						:style="rowNameStyle(dIndex)"
					>
						{{ group.document }}
					</div>

					<!-- Steps -->
					<div style="grid-column: 2 / 4">
						<transition-group name="steps">
							<div
								v-for="(step, sIndex) in group.rows"
								:key="step.id"
								class="grid"
								style="grid-template-columns: 13fr 12.3fr"
							>
								<!-- Step info -->
								<div
									class="flex items-center gap-2 py-[9px] px-4"
									:style="stepStyle(sIndex, group.rows.length)"
								>
									<div
										class="w-5 h-5 text-center bg-[#415ada] text-white leading-5 rounded-full text-xs font-bold flex items-center justify-center mr-[8px]"
									>
										{{ sIndex + 1 }}
									</div>
									<div class="relative text-sm font-medium text-[#1d2452]">
										{{ step.approvalStep }}
									</div>
								</div>

								<!-- Select -->
								<div
									class="flex items-center px-2 pr-[2px]"
									:style="selectStyle(dIndex, sIndex, group.rows.length)"
								>
									<MultiSelect
										:model-value="getSelectionIds(step.id)"
										:options="
											options.map((o) => ({ label: o.fullName, value: o.id }))
										"
										:loading="loading"
										:no-border="true"
										:hide-label="true"
										placeholder="Select"
										@update:modelValue="
											(ids) =>
												emit(
													'select',
													step.id,
													options.find((o) => o.id === ids[0]) ?? null,
												)
										"
									/>
								</div>
							</div>
						</transition-group>
					</div>
				</div>
			</transition-group>
		</div>
	</div>
</template>
