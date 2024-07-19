<template>
  <div class="main-content">
    <div>
      <el-button type="primary" @click="addCompile">新增会员卡类型</el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table
        v-loading="tableLoading"
        :empty-text="$t('message.table_empty_text')"
        :data="tableData"
        border
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        style="width: 100%"
      >
        <el-table-column label="序号" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.$index+(pagination.current - 1) * pagination.size + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="typeName" label="会员卡类型名称" />
        <el-table-column prop="typeDesc" label="会员卡类型说明" />
        <el-table-column prop="" label="渠道" />
        <el-table-column label="停用/启用">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.status==='normal'?'true':'false'"
              active-text="停用"
              inactive-text="启用"
              change="to_changeStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="margin-top: 10px;">
        <!-- 分页 -->
        <table-pagination
          :total="pagination.total"
          :page.sync="pagination.current"
          :limit.sync="pagination.size"
          @pagination="getList"
        />
      </div>
    </div>
    <!-- 新增会员卡 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px">
        <el-form-item label="名称" style="display:none" prop="id">
          <el-input v-model="temp.id" />
        </el-form-item>
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="temp.typeName" placeholder="请输入名称" maxlength="20" />
        </el-form-item>
        <el-form-item label="类型说明">
          <el-input v-model="temp.typeDesc" :autosize="{ minRows: 3, maxRows: 5}" type="textarea" maxlength="100" />
        </el-form-item>
        <el-form-item label="渠道">
          <el-select v-model="temp.channel_select">
            <el-option label="创客plus" value="plus"></el-option>
            <el-option label="嗨ING" value="ING"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { 
  getTypeCard,
  addCardType,
  updateTypeCard
} from '@/api/hipro/lists'
import TablePagination from '@/components/table-pagination'
export default {
  components: { TablePagination },
  data() {
    return {
      tableLoading: false,
      tableData: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改会员卡类型',
        create: '新增会员卡类型'
      },
      temp: {
        id: undefined,
        typeName: undefined,
        typeDesc: undefined,
        channel_select: undefined
      },
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      },
      value: true,
      channel_select: 'ING'
    }
  },
  created() {
    this.getTypeCardList()
  },
  methods: {
    getList() {
      this.getTypeCardList()
    },
    // 查询嗨卡类型列表
    getTypeCardList() {
      const data = {
        current: this.pagination.current,
        size: this.pagination.size
      }
      getTypeCard(data).then(res => {
        this.tableData = res.data.data.records
        this.pagination.total = res.data.data.total
        this.pagination.pages = res.data.data.pages
      })
    },
    // 去改变停用和启用
    to_changeStatus() {},
    // 新增类型
    resetTemp() {
      this.temp = {
        id: undefined,
        typeDesc: undefined,
        typeName: undefined,
        channel_select: undefined
      }
    },
    // 打开新增弹框
    addCompile() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新增嗨卡
    createData() {
      this.dialogFormVisible = false
      // this.$refs['dataForm'].validate((valid) => {
      //   if (valid) {
      //     addCardType(this.temp).then(() => {
      //       this.dialogFormVisible = false
      //       this.$message({
      //         type: 'success',
      //         message: '添加成功!'
      //       })
      //       this.getList()
      //     }).catch(res => {
      //       this.$message(res)
      //     })
      //   }
      // })
    },
    // 打卡编辑嗨卡弹框
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    // 修改嗨卡
    updateData() {
      this.dialogFormVisible = false
      // this.$refs['dataForm'].validate((valid) => {
      //   if (valid) {
      //     updateTypeCard(this.temp).then(res => {
      //       this.dialogFormVisible = false
      //       this.$message({
      //         type: 'success',
      //         message: '修改成功!'
      //       })
      //       this.getList()
      //     })
      //   }
      // })
    }
  }


}
</script>

<style scoped lang="scss">
.pro-container{
  background-color: white;
  margin: 10px 20px;
  padding: 30px;
}

</style>
