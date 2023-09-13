import {request} from '../../request';

export function fetchDeptTree(deptName?: string) {
    return request.get<Array<AdminDept.DeptVO>>(`/dept/tree?deptName=${deptName || ''}`);
}

