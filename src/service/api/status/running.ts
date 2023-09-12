import {request} from '../../request';

export function fetchBizMetrics() {
	return request.get<Metrics.BizMetrics>('/status/bizMetrics');
}

export function fetchRunningInfo() {
	return request.get<Metrics.RunningInfo>('/status/running/info');
}

export function fetchSysMetrics() {
	return request.get<RunningVO.SysMetrics>('/status/sysMetrics');
}
