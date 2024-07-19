<template>
  <div class="main-content">
    <el-form
      :inline="true"
      :model="search"
      id="demo-form-inline"
      class="el-form-filter"
    >
      <el-form-item label="类型名称：">
        <el-select
          v-model="search.areaCode"
          filterable
          remote
          reserve-keyword
          :remote-method="remoteArea"
          placeholder="请输入或选择城市名称"
        >
          <el-option
            v-for="(item, index) in areaList"
            :key="index"
            :label="item.name"
            :value="item.areaId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <div>
        <el-button type="primary" @click="to_search">搜索</el-button>
        <el-button @click="to_reset">重置</el-button>
      </div>
    </el-form>
    <div id="tableBtn">
      <el-button
        v-if="permissions.area_city_add"
        type="primary"
        @click="addHotCityLoding"
        >新增热门城市</el-button
      >
    </div>
    <el-table
      v-loading="interactive.tableLoading"
      :data="hotArr"
      :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
      :height="tableHeight"
    >
      <el-table-column label="序号" align="center" width="60">
        <template slot-scope="scope">
          <span>{{
            scope.$index + (pagination.current - 1) * pagination.size + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="areaName" label="城市名称"> </el-table-column>
      <el-table-column prop="clicks" label="点击次数"></el-table-column>
      <el-table-column prop="sort" label="排序">
        <template slot-scope="scope">
          <div>
            <i
              v-if="scope.$index != 0"
              class="el-icon-top"
              @click="to_sortTop(scope.row)"
            />
            <i
              v-if="pagination.current * scope.$index + 1 != pagination.total"
              class="el-icon-bottom"
              @click="to_sortBottom(scope.row)"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="展示">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="normal"
            inactive-value="disabled"
            @change="changeStatus(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            v-if="permissions.area_city_edit"
            type="text"
            @click="editHotCityLoding(scope.row)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- 分页 -->
    <table-pagination
      :total="pagination.total"
      :page.sync="pagination.current"
      :limit.sync="pagination.size"
      @pagination="getList"
    />
    <el-dialog
      :title="interactive.editOrAdd === 'Add' ? '新增热门城市' : '编辑热门城市'"
      :visible.sync="interactive.dialogVisible"
      width="40%"
    >
      <!-- 新增城市 -->
      <el-form ref="parameter" :model="parameter" label-width="140px">
        <el-form-item
          v-if="interactive.editOrAdd === 'Edit'"
          label="当前城市："
        >
          <span>{{ parameter.currentCity }}</span>
        </el-form-item>
        <el-form-item
          :label="
            interactive.editOrAdd === 'Add' ? '城市名称：' : '修改城市名称：'
          "
          :rules="[
            { required: true, message: '请输入城市名称', trigger: 'blur' }
          ]"
        >
          <el-select
            v-model="parameter.areaCode"
            filterable
            remote
            reserve-keyword
            :remote-method="remoteArea"
            placeholder="请输入或选择城市名称"
          >
            <el-option
              v-for="(item, index) in areaList"
              :key="index"
              :label="item.name"
              :value="item.areaId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="interactive.dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            interactive.editOrAdd === 'Add'
              ? addHotCity('parameter')
              : editHotCity('parameter')
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TablePagination from '@/components/table-pagination'
import {
  getPositionPage,
  disabledCity,
  normalCity,
  getAddCity,
  updateCity,
  updateSort
} from '@/api/address/hotCity'
import { getAreaList } from '@/api/content/advert'
export default {
  name: 'HotCity',
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      },
      // 操作类型
      interactive: {
        tableLoading: false,
        editOrAdd: 'Add',
        dialogVisible: false
      },
      tableData: [{ name: '11' }],
      //表示参数类
      parameter: {
        areaCode: undefined,
        id: undefined,
        currentCity: undefined,
        currentCode: undefined
      },
      search: {
        areaCode: undefined
      },
      hotArr: [],
      areaList: []
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.getList()
    this.getAreaList()
  },
  mounted() {
    this.$nextTick(() => {
      this.countHeight()
      this.watchWidth()
    })
  },
  methods: {
    // 监听视口宽度变化
    watchWidth() {
      window.onresize = () => {
        this.countHeight()
      }
    },
    // 计算表格高度
    countHeight() {
      // 监听视口宽度变化
      let demoForm = document.getElementById('demo-form-inline')
      let tableBtn = document.getElementById('tableBtn')
      this.tableHeight = `calc(100vh - ${
        (demoForm ? demoForm.offsetHeight + 15 : 0) +
        (tableBtn ? tableBtn.offsetHeight + 20 : 0) +
        190
      }px)`
    },
    getList() {
      const data = {
        areaCode: this.search.areaCode,
        current: this.pagination.current,
        size: this.pagination.size
      }
      getPositionPage(data).then(res => {
        this.hotArr = res.data.data.records
        this.pagination.total = res.data.data.total
      })
    },
    //查询地区列表
    getAreaList() {
      const data = {
        areaTypes: 'city',
        size: '50',
        keyword: this.keyword
      }
      getAreaList(data).then(res => {
        this.areaList = res.data.data
      })
    },
    //远程搜索城市
    remoteArea(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.keyword = query
          this.areaList = []
          this.getAreaList()
        }, 200)
      } else {
        this.areaList = []
        this.keyword = undefined
        this.getAreaList()
      }
    },
    // 向上排序
    to_sortTop(item) {
      const data = {
        sortStatus: 'up',
        id: item.id
      }
      this.to_updateSort(data)
    },
    // 向下排序
    to_sortBottom(item) {
      const data = {
        sortStatus: 'down',
        id: item.id
      }
      this.to_updateSort(data)
    },
    //排序
    to_updateSort(data) {
      updateSort(data).then(() => {
        this.$message.success('成功')
        this.getList()
      })
    },
    // 是否设置
    changeStatus(row) {
      if (row.status === 'normal') {
        this.normalCity(row.id)
      } else if (row.status === 'disabled') {
        this.disabledCity(row.id)
      }
    },
    // 禁用
    disabledCity(id) {
      disabledCity(id).then(() => {
        this.$message.success('隐藏成功')
        this.getList()
      })
    },
    // 启用
    normalCity(id) {
      normalCity(id).then(() => {
        this.$message.success('展示成功')
        this.getList()
      })
    },
    // 去搜索
    to_search() {
      this.getList()
    },
    // 去重置
    to_reset() {
      this.search = {
        areaCode: undefined
      }
      this.getList()
    },
    // 新增热门城市弹窗
    addHotCityLoding() {
      this.interactive.editOrAdd = 'Add'
      this.parameter = {
        areaCode: undefined,
        currentCity: undefined,
        id: undefined,
        currentCode: undefined
      }
      this.interactive.dialogVisible = true
    },
    // 新增
    addHotCity(parameter) {
      this.$refs[parameter].validate(valid => {
        if (valid) {
          const data = {
            areaId: this.parameter.areaCode
          }
          getAddCity(data).then(res => {
            console.debug('res', res)
            this.$message({
              showClose: true,
              message: '添加成功',
              type: 'success'
            })
            this.interactive.dialogVisible = false
            this.getList()
          })
        }
      })
    },
    // 修改
    editHotCityLoding(item) {
      this.interactive.editOrAdd = 'Edit'
      this.parameter = {
        id: item.id,
        areaCode: undefined,
        currentCity: item.areaName,
        currentCode: item.areaCode
      }
      this.interactive.dialogVisible = true
    },
    editHotCity(form) {
      if (!this.parameter.areaCode) {
        this.interactive.dialogVisible = false
        return
      }
      this.$refs[form].validate(valid => {
        if (valid) {
          const data = {
            areaId: this.parameter.areaCode,
            id: this.parameter.id
          }
          updateCity(data).then(res => {
            console.debug('res', res)
            this.$message({
              showClose: true,
              message: '修改成功',
              type: 'success'
            })
            this.interactive.dialogVisible = false
            this.getList()
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.el-form-filter {
  display: flex;
  width: 100%;
}
</style>
