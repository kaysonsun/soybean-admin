declare namespace RunningVO {
	type SysMetrics = {
		cpu: Array<Metrics.CpuMetrics>;
		mem: Array<Metrics.MemMetrics>;
		disk: Array<Metrics.DiskMetrics>;
		net: Array<Metrics.NetMetrics>
	}
}
