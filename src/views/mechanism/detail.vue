<template>
  <div class="mechanism-content">
    <div class="main-top">
      <div class="main-top-item">
        <h3>{{ orgName?orgName:'--' }}</h3>
      </div>
      <div class="main-top-item">
        <span>主账号：{{ username?username:'--' }}({{ mobile?mobile:'--' }})</span>
      </div>
      <div class="status">
        <span class="status_text">{{ status==='normal'?'正常':'冻结' }}</span> 
        <span class="status_square"></span>
      </div>
    </div>
    <div class="main-bottom">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="子账号列表" name="first">
          <el-table
            v-loading="tableLoading"
            :data="relationList"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}" 
            class="el_table">
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="date" label="子账号信息" width="200">
              <template slot-scope="scope">
                <div class="user">
                  <div class="user-avatar">
                    <div>
                      <el-avatar :size="50" :src="scope.row.user.avatar"></el-avatar>
                    </div>
                  </div>
                  <div class="user-base">
                    <div>{{ scope.row.user.username }}</div>
                    <div>{{ scope.row.user.fullName }}</div>
                    <div>{{ scope.row.user.mobile }}</div>
                  </div>
                </div>
              </template> 
            </el-table-column>
            <el-table-column prop="createTime" label="关联时间"></el-table-column>
            <el-table-column label="操作" width="300" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click="toCancelRelationAccount(scope.row)">取消关联</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <table-pagination
            :total="pagination.total"
            :page.sync="pagination.current"
            :limit.sync="pagination.size"
            @pagination="getList"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import TablePagination from '@/components/table-pagination'
import {
  getRelationOrganization,
  delRelationOrganization
} from '@/api/mechanism/mechanism'
export default {
  components: { TablePagination },
  data() {
    return {
      tableLoading: false,
      activeName: 'first',
      relationList: [],
      orgId: null,
      orgName: null,
      username: null,
      mobile: null,
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      }
    }
  },
  created() {
    this.orgId = this.$route.query && this.$route.query.orgId
    this.orgName = this.$route.query && this.$route.query.orgName
    this.username = this.$route.query && this.$route.query.username
    this.mobile = this.$route.query && this.$route.query.mobile
    this.status = this.$route.query && this.$route.query.status
    this.getRelationOrganizationList()
  },
  methods: {
    getList() {
      this.getRelationOrganizationList()
    },
    // 子账号列表
    getRelationOrganizationList() {
      this.tableLoading = true
      getRelationOrganization({ orgId: this.orgId }).then(res => {
        this.relationList = res.data.data.records
        this.tableLoading = false
        this.tableData = res.data.data.records
        this.pagination.total = res.data.data.total
        this.pagination.pages = res.data.data.pages
      })
    },
    // 去取消关联
    toCancelRelationAccount(row) {
      this.$confirm('您确定不再关联“' + row.user.fullName + '”创客吗?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        delRelationOrganization(row.id).then(res => {
          this.$message({
            type: 'success',
            message: '取消关联成功!'
          })
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消关联'
        })          
      })
      
    },
    handleClick() {}
  }
}
</script>
<style scoped>
.mechanism-content {
   margin: 10px 20px;
  text-align: right;
}
.main-top {
  height: 70px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #FFF;
  margin-bottom: 20px;
  padding: 0px 30px;
  position: relative;
}
.status {
  position: absolute;
  right: 60px;
  top: 22px;
}
.status_text {
  background-color: #1890ff;
  color: #FFF;
  padding: 2px 20px 2px 10px;
}
.status_square {
  display: inline-block;
  width: 17px;
  height: 17px;
  transform: rotate(45deg);
  background-color: #1890ff;
  position: absolute;
  right: -9px;
  top: 2px;
}
.main-bottom {
  background-color: #FFF;
   padding: 20px 30px;
}
</style>
