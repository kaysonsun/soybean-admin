declare namespace AdminDept {

    interface DeptVO {
        id: number;
        parentId: number;
        deptName: string;
        sortNum: number;
        children: Array<object>;
    }

    interface Dept extends Base.BaseEntity {
        parentId: number;
        deptName: string;
        sortNum: number;
        description: string;
    }

}

