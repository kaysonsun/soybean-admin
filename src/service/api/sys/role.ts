import {request} from '../../request';
import qs from "qs";

export function fetchRolePage(params: any) {
    return request.get(`/role/page?${qs.stringify(params)}`);
}

export function fetchRoleDetail(roleId: number) {
    return request.get<AdminRole.Role>(`/role/detail?id=${roleId}`);
}

export function fetchRoleDict() {
    return request.get<Array<AdminRole.Role>>('/role/dict');
}

export function delRoleById(roleId: number) {
    return request.delete<number>(`/role?id=${roleId}`);
}

export function editRole(role: AdminRole.RoleEditDTO) {
    return request.post<number>('/role', role);
}

export function addRole(role: AdminRole.RoleEditDTO) {
    return request.put<number>('/role', role);
}
