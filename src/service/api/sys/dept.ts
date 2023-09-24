import {request} from '../../request';

export function fetchDeptTree(deptName?: string) {
    return request.get<Array<AdminDept.DeptVO>>(`/dept/tree?deptName=${deptName || ''}`);
}

export function fetchDeptDetail(deptId: number) {
    return request.get<AdminDept.Dept>(`/dept/detail?id=${deptId}`);
}

export function addDept(dept: AdminDept.Dept) {
    return request.put<any>('/dept', dept);
}

export function editDept(dept: AdminDept.Dept) {
    return request.post<number>('/dept', dept);
}

export function delDept(deptId: number) {
    return request.delete<number>(`/dept?id=${deptId}`);
}
