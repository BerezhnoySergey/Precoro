<script setup lang="ts">
import { updateVacationMode } from "../services/api";
import { computed, onMounted, ref } from "vue";
import ApproverTable from "../components/ApproverTable.vue";
import DateRangePicker from "../components/DateRangePicker.vue";
import { fetchBackupApproverData, fetchUsers } from "../services/api";
import type { BackupApproverRow, UserOption } from "../types";
import Header from "../components/Header.vue";
import SubstituteUserBlock from "../components/SubstituteUserBlock.vue";
import Toast from "../components/Toast.vue";

const successMessage = ref("");
const updating = ref(false);
const isEnabled = ref(false);

async function handleUpdate() {
	if (!canUpdate.value) return;
	updating.value = true;
	try {
		const payload = {
			vacationMode: {
				enable: true,
				startDate: Math.floor(new Date(dateRange.value.start).getTime() / 1000),
				endDate: Math.floor(new Date(dateRange.value.end).getTime() / 1000),
			},
			substituteUser: substituteUser.value[0],
			backupApprovers: approverRows.value.map((row) => ({
				id: row.id,
				backupApproverId: backupSelections.value[row.id]?.id,
			})),
		};
		const res = await updateVacationMode(payload);
		if (res && res.ok) {
			isEnabled.value = true;
			successMessage.value = "Updated successfully.";
			setTimeout(() => {
				successMessage.value = "";
			}, 3000);
		}
	} catch (e) {
		alert("Update failed");
	} finally {
		updating.value = false;
	}
}

const dateRange = ref({ start: "", end: "" });
const substituteUser = ref<(string | number)[]>([]);
const approverRows = ref<BackupApproverRow[]>([]);
const backupApproverOptions = ref<UserOption[]>([]);
const multiSelectOptions = computed(() =>
	backupApproverOptions.value.map((u) => ({ label: u.fullName, value: u.id })),
);
const backupSelections = ref<Record<number, UserOption | null>>({});
const loadingRows = ref(false);
const loadingUsers = ref(false);

const canUpdate = computed(() => {
	if (!dateRange.value.start || !dateRange.value.end) return false;
	// substituteUser должен быть массивом с одним выбранным id
	if (!Array.isArray(substituteUser.value) || substituteUser.value.length !== 1)
		return false;
	// Для каждого approverRows должен быть выбран backupApproverId (id пользователя)
	const allSelected = approverRows.value.every(
		(row) =>
			backupSelections.value[row.id] &&
			typeof backupSelections.value[row.id]?.id === "number",
	);
	return allSelected;
});

async function loadRows() {
	loadingRows.value = true;
	try {
		const data = await fetchBackupApproverData();
		approverRows.value = data;
		backupSelections.value = data.reduce<Record<number, UserOption | null>>(
			(acc, row) => {
				acc[row.id] = null;
				return acc;
			},
			{},
		);
	} finally {
		loadingRows.value = false;
	}
}

async function searchUsers(query: string) {
	loadingUsers.value = true;
	try {
		const result = await fetchUsers(query, 1);
		backupApproverOptions.value = Array.isArray(result) ? result : [];
		if (!Array.isArray(result) || result.length === 0) {
			console.warn("API вернул пустой массив или не массив:", result);
		}
	} catch (err) {
		console.error("Ошибка при запросе пользователей:", err);
	} finally {
		loadingUsers.value = false;
	}
}

onMounted(async () => {
	await loadRows();
	await searchUsers("");
});

function onSelectBackup(rowId: number, value: UserOption | null) {
	backupSelections.value = {
		...backupSelections.value,
		[rowId]: value,
	};
}
</script>

<template>
	<div>
		<Header />

		<div class="flex items-center justify-between py-[14px]">
			<h1 class="text-[20px] font-bold">Vacation Mode Settings</h1>

			<button
				:type="'button'"
				class="h-[28px] rounded-full bg-[rgba(29,36,82,1)] px-4 text-xs font-semibold leading-none text-white disabled:bg-[rgba(147,152,195,1)]"
				:disabled="!canUpdate || updating"
				@click="handleUpdate"
			>
				<span v-if="updating">Updating...</span>
				<span v-else>Update</span>
			</button>
		</div>
		<div
			class="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen border-b border-[rgba(65,90,218,0.1)]"
		></div>

		<div class="mt-8">
			<div class="mt-[27px] mb-[24px]">
				<DateRangePicker v-model="dateRange" required :is-enabled="isEnabled" />
			</div>

			<div class="border-b border-[rgba(65,90,218,0.1)]"></div>

			<div class="mt-6">
				<SubstituteUserBlock
					v-model="substituteUser"
					:options="multiSelectOptions"
					:loading="loadingUsers"
					@search="searchUsers"
				/>
			</div>

			<div class="border-b border-[rgba(65,90,218,0.1)]"></div>

			<div class="mt-4">
				<ApproverTable
					:rows="approverRows"
					:options="backupApproverOptions"
					:selections="backupSelections"
					:loading="loadingUsers || loadingRows"
					@select="onSelectBackup"
					@search="searchUsers"
				/>
			</div>
		</div>
	</div>

	<Toast :message="successMessage" />
</template>
