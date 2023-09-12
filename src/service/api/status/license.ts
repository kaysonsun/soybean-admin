import {request} from '../../request';

export function fetchLicenseInfo() {
    return request.get<License.LicenseVO>('/license/info');
}

