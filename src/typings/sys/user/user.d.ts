declare namespace AdminUser {
	type User = {
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
}
