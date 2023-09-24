import {request} from '../../request';
import qs from "qs";

export function fetchUserPage(params: any) {
    return request.get(`/user/page?${qs.stringify(params)}`);
}

export function fetchUserDetail(userId: number) {
    return request.get<AdminUser.User>(`/user/detail?userId=${userId}`);
}

export function delUserById(userId: number) {
    return request.delete(`/user?userId=${userId}`);
}

export function resetPwdById(userId: number) {
    return request.post(`/user/password/init?userId=${userId}`);
}

export function fetchInitPwd() {
    return request.get<string>('/user/password/init');
}

export function editUser(user: AdminUser.UserEditDTO) {
    return request.post<number>('/user', user);
}


