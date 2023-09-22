import {request} from '../../request';
import qs from "qs";

export function fetchUserPage(params: any) {
    return request.get(`/user/page?${qs.stringify(params)}`);
}
