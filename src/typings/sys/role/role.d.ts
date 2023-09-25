declare namespace AdminRole {
    interface Role {
        id: number;
        roleName: string;
        description: string;
        createTime: string;
    }

    interface RoleEditDTO {
        id: number;
        roleName: string;
        description: string;
        version: number;
    }
}
