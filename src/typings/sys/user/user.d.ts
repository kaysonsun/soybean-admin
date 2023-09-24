declare namespace AdminUser {
    interface User {
        id: number;
        deptId: number;
        username: string;
        realName: string;
        mobilePhone: string;
        eMail: string;
        accountType: AdminEnum.AccountType;
        expiredAt: string;
        description: string;
        pinyin: string
    }

    interface UserEditDTO {
        id: number;
        username: string;
        realName: string;
        mobilePhone: string;
        accountType: string;
        expiredAt: string;
        deptId: number;
        roleIds: Array<number>;
        description: string;
        version: number;
    }
}
