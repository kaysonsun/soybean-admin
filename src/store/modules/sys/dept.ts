import {defineStore} from 'pinia';

export const useDeptStore = defineStore('dept-store', {
    state: () => {
        return {
            deptId: null
        };
    },
    getters: {},
    persist: {
        enabled: true
    }
});
