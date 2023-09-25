import {request} from '../../request';
import qs from "qs";

export function fetchUserPage(params: any) {
    return request.get(`/user/page?${qs.stringify(params)}`);
}

export function fetchUserDetail(userId: number) {
    return request.get<AdminUser.User>(`/user/detail?id=${userId}`);
}

export function delUserById(userId: number) {
    return request.delete(`/user?id=${userId}`);
}

export function resetPwdById(userId: number) {
    return request.post(`/user/password/init?id =${userId}`);
}

export function fetchInitPwd() {
    return request.get<string>('/user/password/init');
}

export function editUser(user: AdminUser.UserEditDTO) {
    return request.post<number>('/user', user);
}

export function addUser(user: AdminUser.UserEditDTO) {
    return request.put<number>('/user', user);
}


