import {request} from '../../request';
import qs from "qs";

export function fetchUserPage(params: any) {
    return request.get(`/user/page?${qs.stringify(params)}`);
}

export function fetchUserDetail(userId: number) {
    return request.get<AdminUser.User>(`/user/detail?userId=${userId}`);
}
