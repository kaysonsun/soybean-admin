declare namespace License {
    type LicenseVO = {
        ownedTo: string;
        licenseType: string;
        expiredAt: string;
        userCount: number;
        clientCount: number;
        signDateTime: string;
        licenseStatus: string;
    }
}
