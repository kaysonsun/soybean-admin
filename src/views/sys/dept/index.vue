<template>
	<n-grid :x-gap="16" :y-gap="16" :item-responsive="true">
		<n-grid-item span="0:24 640:24 1024:8">
			<n-card :bordered="false" class="rounded-8px shadow-sm">
				<n-space class="pb-12px" justify="space-between">
					<n-space>
						<n-button size="small" type="primary" @click="">
							<icon-ic-round-plus class="mr-4px text-15px"/>
							新增
						</n-button>
						<n-button size="small" type="error">
							<icon-ic-round-delete class="mr-4px text-15px"/>
							删除
						</n-button>
					</n-space>
					<n-space align="center" :size="18">
						<n-button size="small" type="primary" @click="">
							<icon-mdi-refresh class="mr-4px text-15px" :class="{ 'animate-spin': loading }"/>
							刷新表格
						</n-button>
					</n-space>
				</n-space>
				<n-space vertical :size="12">
					<n-input v-model:value="pattern" placeholder="搜索"/>
					<n-tree
						:show-irrelevant-nodes="showIrrelevantNodes"
						:pattern="pattern"
						:data="data"
						block-line
					/>
				</n-space>
			</n-card>
		</n-grid-item>
		<n-grid-item span="0:24 640:24 1024:16">
			<n-card :bordered="false" class="rounded-8px shadow-sm">
				<n-space class="pb-12px" justify="space-between">
					<n-space>
						<n-button size="small" type="primary" @click="">
							<icon-ic-round-plus class="mr-4px text-15px"/>
							新增
						</n-button>
						<n-button size="small" type="error">
							<icon-ic-round-delete class="mr-4px text-15px"/>
							删除
						</n-button>
					</n-space>
					<n-space align="center" :size="18">
						<n-button size="small" type="primary" @click="">
							<icon-mdi-refresh class="mr-4px text-15px" :class="{ 'animate-spin': loading }"/>
							刷新表格
						</n-button>
						<!--						<column-setting v-model:columns="columns"/>-->
					</n-space>
				</n-space>
				<!--				<n-data-table-->
				<!--					:columns="columns"-->
				<!--					:data="tableData"-->
				<!--					:loading="loading"-->
				<!--					:pagination="pagination"-->
				<!--					flex-height-->
				<!--					class="flex-1-hidden"-->
				<!--				/>-->
			</n-card>
		</n-grid-item>
	</n-grid>
</template>

<script lang="ts" setup>
import {NButton, NSpace} from "naive-ui";
import ColumnSetting from "@/views/management/user/components/column-setting.vue";
</script>

<style scoped></style>
