import {request} from '../../request';
import qs from "qs";

export function fetchRolePage(params: any) {
    return request.get(`/role/page?${qs.stringify(params)}`);
}

export function fetchRoleDetail(roleId: number) {
    return request.get<AdminRole.Role>(`/role/detail?roleId=${roleId}`);
}

export function fetchRoleDict() {
    return request.get<Array<AdminRole.Role>>('/role/dict');
}
