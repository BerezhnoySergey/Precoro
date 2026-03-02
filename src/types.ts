export interface UserOption {
	id: number;
	fullName: string;
	email?: string;
}

export interface BackupApproverRow {
	id: number;
	document: string;
	approvalStep: string;
	backupApproverId?: number | null;
}

export interface VacationModePayload {
	vacationMode: {
		enable: boolean;
		startDate: number;
		endDate: number;
	};
	substituteUser: string | number;
	backupApprovers: Array<{
		id: number;
		backupApproverId: number | undefined;
	}>;
}
