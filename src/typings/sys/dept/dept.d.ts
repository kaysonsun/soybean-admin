declare namespace AdminDept {

	type DeptVO = {
		id: number;
		parentId: number;
		deptName: string;
		sortNum: number;
		children: Array<object>;
	}

	type Dept = {
		id: number;
		parentId: number;
		deptName: string;
		sortNum: number;
		children: Array<object>;
	}

}

