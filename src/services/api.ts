import type {
	BackupApproverRow,
	UserOption,
	VacationModePayload,
} from "../types";

const API_BASE = "https://precoro-vuejs-test-task-api.avramch.workers.dev";

const jsonHeaders = {
	"Content-Type": "application/json",
};

export async function fetchBackupApproverData(): Promise<BackupApproverRow[]> {
	const response = await fetch(`${API_BASE}/data`);
	if (!response.ok) {
		throw new Error("Failed to load backup approver data");
	}
	const payload = (await response.json()) as {
		ok: boolean;
		data: {
			approvalSteps: Array<{
				id: number;
				documentId: number;
				stepNumber: number;
				stepName: string;
			}>;
			documents: Array<{ id: number; name: string }>;
		};
	};

	const documentsById = new Map(
		payload.data.documents.map((doc) => [doc.id, doc.name]),
	);

	return payload.data.approvalSteps.map((step) => ({
		id: step.id,
		document: documentsById.get(step.documentId) ?? "Unknown",
		approvalStep: step.stepName,
		backupApproverId: null,
	}));
}

export async function fetchUsers(search = "", page = 1): Promise<UserOption[]> {
	const params = new URLSearchParams();
	if (search.trim()) params.set("search", search.trim());
	params.set("page", String(page));

	const response = await fetch(`${API_BASE}/users?${params.toString()}`);
	if (!response.ok) {
		throw new Error("Failed to load users");
	}
	const result = await response.json();
	return Array.isArray(result.data) ? result.data : [];
}

export async function updateVacationMode(
	payload: VacationModePayload,
): Promise<{ ok: boolean }> {
	const response = await fetch(`${API_BASE}/update`, {
		method: "PATCH",
		headers: jsonHeaders,
		body: JSON.stringify(payload),
	});
	if (!response.ok) {
		throw new Error("Failed to update vacation mode");
	}
	return (await response.json()) as { ok: boolean };
}
