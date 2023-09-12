declare namespace ApiAuth {
	type Token = {
		jti: string
		accessToken: string;
		refreshToken: string;
	}

	type UserInfo = {
		user: AdminUser.User;
		btnAuths: string[];
		menu: AdminAuth.MenuVO[];
	}
}
