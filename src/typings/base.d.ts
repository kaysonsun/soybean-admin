declare namespace Base {

    interface BaseEntity {
        id: number;
        createBy: number;
        updateBy: number;
        createTime: string;
        updateTime: string;
        deleted: boolean;
        version: number;
    }

}

