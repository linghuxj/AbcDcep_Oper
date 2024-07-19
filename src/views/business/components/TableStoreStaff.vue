<template>
  <div>
    <div class="store-search">
      <el-input placeholder="请输入搜索内容关键字">
        <el-button slot="append" type="primary">搜索</el-button>
      </el-input>
    </div>  
    <el-table
      v-loading="tableLoading"
      :empty-text="$t('message.table_empty_text')"
      :data="tableData"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      style="width: 100%"
    >
      <el-table-column label="序号"></el-table-column>
      <el-table-column label="头像">
        <!-- <template slot-scope="scope">
          <el-avatar size="size" :src="scope.row"></el-avatar>
        </template> -->
      </el-table-column>
      <el-table-column label="员工姓名"></el-table-column>
      <el-table-column label="员工手机号码"></el-table-column>
      <el-table-column label="加入时间"></el-table-column>
      <el-table-column label="登录账号"></el-table-column>
      <el-table-column label="状态"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="resetPassword(scope.row)">重置密码</el-button>
          <el-button type="text" @click="toDisable(scope.row)">冻结</el-button>
          <el-button type="text" @click="toNormal(scope.row)">解冻</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div style="margin-top: 10px">
      <table-pagination
        :total="pagination.total"
        :page.sync="pagination.current"
        :limit.sync="pagination.size"
        @pagination="getList"
      />
    </div>
  </div>
</template>
<script>
import TablePagination from '@/components/table-pagination'
export default {
  components: { TablePagination },
  data() {
    return {
      tableLoading: false,
      tableData: [{ name: '11' }],
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      }
    }
  },
  created() {},
  methods: {
    getList() {},
    // 冻结
    toDisable() {
      const fullName = 'XXX'
      this.$confirm('确定要冻结“' + fullName + '”员工吗？冻结后将无法登录商户平台', '冻结提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        // normalDistributionStatus({ userId: row.userId }).then(res => {
        //   this.$message({
        //     type: 'success',
        //     message: '解冻成功!'
        //   })
        //   this.getDistributors()
        // })
          
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消冻结'
        })          
      })
    },
    //解冻
    toNormal() {
      const fullName = 'XXX'
      this.$confirm('确定将“' + fullName + '”员工解冻吗？?', '解冻提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        // normalDistributionStatus({ userId: row.userId }).then(res => {
        //   this.$message({
        //     type: 'success',
        //     message: '解冻成功!'
        //   })
        //   this.getDistributors()
        // })
          
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消解冻'
        })          
      })
    }, 
    // 重置密码
    resetPassword() {
      this.$message('暂未开发此功能')
    }
  }
}
</script>
<style scoped>
.store-search {
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-end;
}
.el-input-group{
  width: 260px;
}
.el-input__inner {
  width: 100px;
}
</style>
