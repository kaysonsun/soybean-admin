declare namespace AdminDept {

    interface DeptVO {
        id: number;
        parentId: number;
        deptName: string;
        sortNum: number;
        children: Array<object>;
    }

    interface Dept {
        id: number;
        createBy: number;
        updateBy: number;
        createTime: string;
        updateTime: string;
        deleted: boolean;
        version: number;
        parentId: number;
        deptName: string;
        sortNum: number;
        description: string;
    }

}

