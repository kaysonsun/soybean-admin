<template>
	<n-card title="许可信息" :bordered="false" size="small" class="rounded-8px shadow-sm">
		<n-descriptions label-placement="left" label-align="center" bordered size="large" label-style="width:20%"
										:column="1">
			<n-descriptions-item label="许可状态">
				<n-tag type="primary">{{ licenseInfo.licenseStatus }}</n-tag>
			</n-descriptions-item>
			<n-descriptions-item label="归属">
				<n-tag type="primary">{{ licenseInfo.ownedTo }}</n-tag>
			</n-descriptions-item>
			<n-descriptions-item label="许可类型">
				<n-tag type="primary">{{ licenseInfo.licenseType }}</n-tag>
			</n-descriptions-item>
			<n-descriptions-item label="签发时间">
				<n-tag type="primary">{{ licenseInfo.signDateTime }}</n-tag>
			</n-descriptions-item>
			<n-descriptions-item label="到期时间">
				<n-tag type="primary">{{ licenseInfo.expiredAt }}</n-tag>
			</n-descriptions-item>
			<n-descriptions-item label="用户上限">
				<n-tag type="primary">{{ licenseInfo.userCount }}</n-tag>
			</n-descriptions-item>
			<n-descriptions-item label="分机上限">
				<n-tag type="primary">{{ licenseInfo.clientCount }}</n-tag>
			</n-descriptions-item>
		</n-descriptions>
		<n-space justify="end" class="mt-20px">
			<n-button type="primary" @click="handleGetRegFile">获取注册文件</n-button>
			<n-upload
				action="/api/license/licFile"
				method="POST"
				:headers="{'Authorization': localStg.get('token')}"
				@finish="handleLicFileUploadFinish"
			>
				<n-button type="primary">更新许可</n-button>
			</n-upload>
			<n-button type="primary" @click="handleBackupLicense">备份许可</n-button>
		</n-space>
	</n-card>

</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import type {Ref} from 'vue';
import {fetchLicenseInfo} from '@/service';
import axios from 'axios';
import {localStg} from '@/utils';

defineOptions({name: 'LicenseInfo'});

const licenseInfo: Ref<License.LicenseVO> = ref({
	ownedTo: '',
	licenseType: '',
	expiredAt: '',
	userCount: '',
	clientCount: '',
	signDateTime: '',
	licenseStatus: ''
})

const getLicenseInfo = async () => {
	const {data} = await fetchLicenseInfo()
	if (data) {
		licenseInfo.value = data
	}
}

const handleGetRegFile = async () => {
	axios({
		method: 'get',
		url: '/api/license/regFile',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Authorization': localStg.get('token'),
		},
		responseType: 'blob'
	}).then((res) => {
		console.log('res', res);
		let fileName = res.headers["content-disposition"].split(";")[1].split("filename=")[1]
		let blob = new Blob([res.data]);

		let url = window.URL.createObjectURL(blob);

		let link = document.createElement('a');

		link.style.display = 'none';
		link.download = fileName
		link.href = url
		document.body.appendChild(link)
		link.click();
		document.body.removeChild(link);
	})
}

const handleBackupLicense = async () => {
	axios({
		method: 'get',
		url: '/api/license/licFile',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Authorization': localStg.get('token'),
		},
		responseType: 'blob'
	}).then((res) => {
		console.log('res', res);
		let fileName = res.headers["content-disposition"].split(";")[1].split("filename=")[1]
		let blob = new Blob([res.data]);

		let url = window.URL.createObjectURL(blob);

		let link = document.createElement('a');

		link.style.display = 'none';
		link.download = fileName
		link.href = url
		document.body.appendChild(link)
		link.click();
		document.body.removeChild(link);
	})
}

const handleLicFileUploadFinish = async () => {
	await getLicenseInfo()
}

onMounted(() => {
	getLicenseInfo()
});

</script>

<style scoped></style>
