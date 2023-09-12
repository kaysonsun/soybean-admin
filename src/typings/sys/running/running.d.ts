declare namespace Metrics {
	type BizMetrics = {
		userCount: number;
		phoneCount: number;
		cdrCount: number;
	}

	type RunningInfo = {
		runningTime: string;
		licenseType: string;
		ownedTo: string;
		expiredAt: string;
		licenseStatus: string;
	}

	type CpuMetrics = {
		ts: string;
		used: number;
	}

	type MemMetrics = {
		ts: string;
		total: number;
		free: number;
	}

	type DiskMetrics = {
		name: string;
		ts: string;
		total: number;
		free: number;
	}

	type NetMetrics = {
		name: string;
		ts: string;
		up: number;
		down: number;
	}
}
