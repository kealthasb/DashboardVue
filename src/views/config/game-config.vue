<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.platform"
        style="width: 200px;"
        class="filter-item"
        placeholder="Please select"
        @keyup.enter.native="handleFilter"
      >
        <el-option
          v-for="item in platforms"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-input
        v-model="listQuery.name"
        :placeholder="$t('table.name')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t('table.search') }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="info"
        icon="el-icon-refresh"
        plain
        @click="handleRefresh"
      >
        {{ $t('table.refresh') }}
      </el-button>
    </div>
    <div class="action-container">
      <el-button
        class="action-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-refresh"
        plain
        @click="handleCreate"
      >
        {{ $t('table.add') }}
      </el-button>
      <el-button
        class="action-item"
        style="margin-left: 10px;"
        type="success"
        icon="el-icon-edit"
        plain
        :disabled="disableUpdate"
        @click="handleMultiUpdate"
      >
        {{ $t('table.edit') }}
      </el-button>
      <el-button
        class="action-item"
        style="margin-left: 10px;"
        type="info"
        icon="el-icon-delete"
        plain
        :disabled="disableDelete"
        @click="handleMultiDelete"
      >
        {{ $t('table.delete') }}
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="warning"
        icon="el-icon-download"
        @click="handleDownload"
      >
        {{ $t('table.export') }}
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        :label="$t('table.id')"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.name')"
        min-width="150px"
      >
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.appId')"
        width="180px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.appId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.platform')"
        width="180px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.platformName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.appSecret')"
        width="180px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.appSecret }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.appKey')"
        width="180px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.appKey }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.packageName')"
        width="180px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.packageName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="230"
        class-name="fixed-width"
      >
        <template slot-scope="{row, $index}">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(row)"
          >
            {{ $t('table.edit') }}
          </el-button>
          <el-button
            v-if="row.status!=='deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="tempGameData"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item
          :label="$t('table.name')"
          prop="name"
        >
          <el-input v-model="tempGameData.name" />
        </el-form-item>
        <el-form-item :label="$t('table.platform')">
          <el-select
            v-model="tempGameData.platform"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in platforms"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('table.appId')"
          prop="appId"
        >
          <el-input v-model="tempGameData.appId" />
        </el-form-item>
        <el-form-item
          :label="$t('table.appSecret')"
          prop="appSecret"
        >
          <el-input v-model="tempGameData.appSecret" />
        </el-form-item>
        <el-form-item
          :label="$t('table.appKey')"
          prop="appKey"
        >
          <el-input v-model="tempGameData.appKey" />
        </el-form-item>
        <el-form-item
          :label="$t('table.packageName')"
          prop="packageName"
        >
          <el-input v-model="tempGameData.packageName" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { cloneDeep } from 'lodash'
import { IGameData, IPlatformData } from '@/api/types'
import { exportJson2Excel } from '@/utils/excel'
import { formatJson } from '@/utils'
import Pagination from '@/components/Pagination/index.vue'
import { getGames, defaultGameData, addGame, getGame, deleteGame, updateGame } from '@/api/games'
import { getPlatforms } from '../../api/platforms'

const calendarTypeOptions = [
  { key: 'CN', displayName: 'China' },
  { key: 'US', displayName: 'USA' },
  { key: 'JP', displayName: 'Japan' },
  { key: 'EU', displayName: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc: { [key: string]: string }, cur) => {
  acc[cur.key] = cur.displayName
  return acc
}, {}) as { [key: string]: string }

@Component({
  name: 'GameConfig',
  components: {
    Pagination
  },
  filters: {
    typeFilter: (type: string) => {
      return calendarTypeKeyValue[type]
    }
  }
})
export default class extends Vue {
  private tableKey = 0
  private list: IGameData[] = []
  private platforms: IPlatformData[] = []
  private total = 0
  private listLoading = true
  private listQuery = {
    pageNum: 1,
    pageSize: 20,
    orderByColumn: 'id',
    isAsc: 'asc',
    platform: undefined,
    name: undefined
  }

  private dialogFormVisible = false
  private dialogStatus = ''
  private tempGameData = defaultGameData
  private importanceOptions = [1, 2, 3]
  private selectList: Array<number> = []
  private disableUpdate: Boolean = true
  private disableDelete: Boolean = true
  private calendarTypeOptions = calendarTypeOptions

  private rules = {
    name: [{ required: true, message: 'name is required', trigger: 'blur' }],
    appId: [{ required: true, message: 'appId is required', trigger: 'blur' }],
    appSecret: [{ required: true, message: 'appSecret is required', trigger: 'blur' }],
    appKey: [{ required: true, message: 'appKey is required', trigger: 'blur' }],
    platform: [{ required: true, message: 'platform is required', trigger: 'blur' }],
    packageName: [{ required: true, message: 'packageName is required', trigger: 'blur' }]
  }

  private downloadLoading = false
  private textMap = {
    update: 'Edit',
    create: 'Create'
  }

  created() {
    this.getList()
    this.getPlatformList()
  }

  private async getList() {
    this.listLoading = true
    const { data } = await getGames(this.listQuery)
    this.list = data.rows
    this.total = data.total
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  private async getPlatformList() {
    this.listLoading = true
    const { data } = await getPlatforms(this.listQuery)
    this.platforms = data.rows
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  private handleSelectionChange(val: Array<IGameData>) {
    this.selectList = []
    val.forEach((item: IGameData) => {
      this.selectList.push(item.id)
    })
    this.disableUpdate = !(this.selectList.length === 1)
    this.disableDelete = !(this.selectList.length > 0)
  }

  private handleFilter() {
    this.listQuery.pageSize = 1
    this.getList()
  }

  private sortChange(data: any) {
    const { prop, order } = data
    if (prop === 'id') {
      this.sortByID(order)
    }
  }

  private sortByID(order: string) {
    if (order === 'ascending') {
      this.listQuery.isAsc = 'asc'
    } else {
      this.listQuery.isAsc = 'desc'
    }
    this.handleFilter()
  }

  private getSortClass() {
    const sort = this.listQuery.isAsc
    return sort === 'asc' ? 'ascending' : 'descending'
  }

  private resetTempGameData() {
    this.tempGameData = cloneDeep(defaultGameData)
  }

  private handleCreate() {
    this.resetTempGameData()
    this.dialogStatus = 'create'
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate()
    })
  }

  private createData() {
    (this.$refs.dataForm as Form).validate(async(valid) => {
      if (valid) {
        const gameData = this.tempGameData
        const { data } = await addGame(gameData)
        if (data.code === 200) {
          this.getList()
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: '创建失败',
            type: 'warning',
            duration: 2000
          })
        }
      }
    })
  }

  private handleRefresh() {
    this.listQuery = {
      pageNum: 1,
      pageSize: 20,
      orderByColumn: 'id',
      isAsc: 'asc',
      platform: undefined,
      name: undefined
    }
  }

  private handleUpdate(row: any) {
    this.tempGameData = Object.assign({}, row)
    this.dialogStatus = 'update'
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate()
    })
  }

  private handleMultiUpdate() {
    const row = this.list[this.selectList[0]]
    this.tempGameData = Object.assign({}, row)
    this.dialogStatus = 'update'
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate()
    })
  }

  private updateData() {
    (this.$refs.dataForm as Form).validate(async(valid) => {
      if (valid) {
        const tempData = Object.assign({}, this.tempGameData)
        const { data } = await updateGame(tempData)
        if (data.code === 200) {
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        } else {
          this.$notify({
            title: '失败',
            message: '更新失败',
            type: 'warning',
            duration: 2000
          })
        }
      }
    })
  }

  private async handleDelete(row: any, index: number) {
    const tmpList: Array<number> = []
    tmpList.push(row.id)
    const { data } = await deleteGame(tmpList)
    if (data.code === 200) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.getList()
    } else {
      this.$notify({
        title: '失败',
        message: '删除失败',
        type: 'warning',
        duration: 2000
      })
    }
  }

  private async handleMultiDelete() {
    const { data } = await deleteGame(this.selectList)
    if (data.code === 200) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.selectList = []
      this.getList()
    } else {
      this.$notify({
        title: '失败',
        message: '删除失败',
        type: 'warning',
        duration: 2000
      })
    }
  }

  private handleDownload() {
    this.downloadLoading = true
    const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
    const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
    const data = formatJson(filterVal, this.list)
    exportJson2Excel(tHeader, data, 'table-list')
    this.downloadLoading = false
  }
}
</script>
