<template>
  <div class="main-content">
    <el-form :inline="true" :model="paramter" class="demo-form-inline">
      <el-form-item label="机构名称">
        <span class="el-form-item-span">：</span>
        <el-input v-model="paramter.orgName" placeholder="请输入机构名称"></el-input>
      </el-form-item>
      <el-form-item label="主账号搜索">
        <span class="el-form-item-span">：</span>
        <el-select v-model="paramter.typeName" placeholder="请选择">
          <el-option label="主账号真实姓名" value="fullName"></el-option>
          <el-option label="主账号手机号码" value="mobile"></el-option>
        </el-select>
        <el-input v-model="paramter.typeValue" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div><el-button icon="el-icon-plus" type="primary" @click="adddOrModify">新增机构</el-button></div>
    <!-- 表格 -->
    <el-table
      v-loading="interactive.tableLoading"
      border
      :data="organizList"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}" 
      class="el_table">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="orgName" label="机构名称"></el-table-column>
      <el-table-column label="登录账号">
        <template slot-scope="scope">
          <span>{{ scope.row.username?scope.row.username:'--' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="主账号">
        <template slot-scope="scope">
          <div>{{ scope.row.user.fullName?scope.row.user.fullName:'--' }}</div>
          <div>{{ scope.row.user.mobile?scope.row.user.mobile:'--' }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="orgUserNum" label="子账号数"></el-table-column>
      <el-table-column label="操作" width="300" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="toRelationAccount(scope.row.orgId)">关联子账号</el-button>
          <el-button type="text" @click="editOrModify(scope.row)">编辑</el-button>
          <el-button type="text" @click="toDetail(scope.row)">详情</el-button>
          <el-button v-if="scope.row.status==='normal'" type="text" @click="toFrozen(scope.row.orgId)">冻结</el-button>
          <el-button v-if="scope.row.status==='disabled'" type="text" @click="toNormal(scope.row.orgId)">解冻</el-button>
          <el-button type="text" @click="toResetPassword(scope.row.adminUserId)">一键改为默认密码</el-button>
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
    <!-- 关联子账号 -->
    <el-dialog
      title="关联子账号"
      :visible.sync="interactive.relationAccountDialogVisible"
      width="80%"
      :before-close="relationAccountClose">
      <div>
        <el-input v-model="search_keyword" placeholder="请输入搜索内容关键字"></el-input>
        <el-button type="primary" @click="relation_search">搜索</el-button>
      </div>
      <el-table
        :data="noRelationUserList"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}" 
        class="el_table"
        @selection-change="selectionRelation">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="创客姓名" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.fullName?scope.row.fullName:'--' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="电话号码"></el-table-column>
        <el-table-column label="所属单位">
          <template slot-scope="scope">
            <span>{{ scope.row.company?scope.row.company:'--' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <table-pagination
        :total="relationPagination.total"
        :page.sync="relationPagination.current"
        :limit.sync="relationPagination.size"
        @pagination="getListRelation"
      />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureRelationAccount">确定关联</el-button>
      </span>
    </el-dialog>  
    <!--添加编辑机构  -->
    <el-dialog
      :title="orgStatus==='Add'?'添加机构':'编辑机构'"
      :visible.sync="interactive.dialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form :model="addOrg">
        <el-form-item label="机构名称：">
          <el-input v-model="addOrg.orgName" placeholder="请输入机构名称"></el-input>
        </el-form-item>
        <el-form-item label="选择主账号：">
          <el-autocomplete
            v-model="mainUserName"
            class="inline-input"
            :fetch-suggestions="querySearch"
            placeholder="请输入手机号选择主账号"
            :trigger-on-focus="false"            
            @select="handleRelation"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="登录账号：">
          <el-input v-model="addOrg.username" placeholder="请输入登录账号" :disabled="orgStatus==='Edit'"></el-input>
        </el-form-item>
        <el-form-item v-if="orgStatus === 'Add'" label="登录密码：">
          <span>默认密码为ck123456</span>
        </el-form-item>
        <el-form-item v-if="orgStatus === 'Edit'" label="登录密码：">
          <el-input v-model="OrgPassword" type="password" disabled></el-input>
          <!-- <el-button type="text" style="color:#3a96ff;margin-left:10px" @click="toResetPassword">一键改为默认密码</el-button> -->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="interactive.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import TablePagination from '@/components/table-pagination'
import {
  getOrganization,
  addOrganization,
  notRelationuser,
  disabledOrganization,
  normalOrganization,
  relationOrganization,
  getDistributorList,
  resetOrganizationPassword,
  updateOrganization
} from '@/api/mechanism/mechanism'
export default {
  components: { TablePagination },
  data() {
    return {
      interactive: {
        dialogVisible: false,
        relationAccountDialogVisible: false,
        tableLoading: false
      },
      paramter: {
        orgName: undefined,
        typeName: undefined,
        typeValue: undefined
      },
      form: {
        name: undefined
      },
      search_keyword: undefined,
      state2: undefined,
      orgId: undefined,
      addOrg: {
        orgId: undefined,
        orgName: undefined,
        userId: undefined,
        username: undefined
      },
      OrgPassword: 'ck123456',
      orgStatus: 'Add',
      mainUserName: undefined,
      organizList: [],
      // 选择关联子账号数组
      relationAccountArr: [],
      tableData: [{ 'date': '111' }],
      noRelationUserList: [],
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      },
      // 关联子账号分页
      relationPagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      }
    }
  },
  created() {
    this.getOrganizationList()
  },
  methods: {
    // 获取列表
    getList() {
      this.getOrganizationList()
    },
    // 关联子账号获取列表
    getListRelation() {
      this.getNotRelationuser()
    },
    // 查询机构列表
    getOrganizationList() {
      const typeName = this.paramter.typeName
      const data = {
        orgName: this.paramter.orgName,
        size: this.pagination.size,
        current: this.pagination.current
      }
      if (this.paramter.typeName) {
        delete data.typeName
        data[typeName] = this.paramter.typeValue
      }
      this.interactive.tableLoading = true
      getOrganization(data).then(res => {
        this.interactive.tableLoading = false
        this.organizList = res.data.data.records
        this.tableData = res.data.data.records
        this.pagination.total = res.data.data.total
        this.pagination.pages = res.data.data.pages
      })
    },
    // 弹框确定(添加机构)
    sureSubmit() {
      if (this.orgStatus === 'Add') {
        if (!this.addOrg.userId) {
          this.$message.warning('请选择正确的主账号')
          return
        }
        addOrganization(this.addOrg).then(res => {
          this.$message({
            type: 'success',
            message: '添加成功'
          }) 
          this.interactive.dialogVisible = false
          this.getOrganizationList()
        }).catch(res => {
          this.$message(res)
        })
      } else {
        const data = {
          orgId: this.addOrg.orgId,
          orgName: this.addOrg.orgName,
          userId: this.addOrg.userId
        }
        updateOrganization(data).then(res => {
          this.$message({
            type: 'success',
            message: '修改成功'
          }) 
          this.interactive.dialogVisible = false
          this.getOrganizationList()
        }).catch(res => {
          this.$message(res)
        })
      }
      
    },
    // 重置密码
    toResetPassword(adminUserId) {
      resetOrganizationPassword(adminUserId).then(res => {
        this.$message({
          type: 'success',
          message: '重置成功'
        })  
      }).catch(res => {
        this.$message(res)
      })
    },
    // 未关联子账号搜索
    relation_search() {
      this.getNotRelationuser()
    },
    // 查询未关联的子账号
    getNotRelationuser() {
      const data = {
        size: this.relationPagination.size,
        current: this.relationPagination.current,
        keyword: this.search_keyword
      }
      notRelationuser(data).then(res => {
        console.log('res', res)
        this.noRelationUserList = res.data.data.records
        this.relationPagination.total = res.data.data.total
        this.relationPagination.pages = res.data.data.pages
      })
    },
    // 多选关联账号
    selectionRelation(val) {
      console.debug('val', val)
      this.relationAccountArr = val
    },
    // 确定关联
    sureRelationAccount() {
      this.$confirm('您确定要关联吗?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        const userIds = []
        for (const i in this.relationAccountArr) {
          userIds.push(this.relationAccountArr[i].userId)
        }
        const data = {
          orgId: this.orgId,
          userIds: userIds
        }
        console.debug('data', data)
        relationOrganization(data).then(res => {
          this.$message({
            type: 'success',
            message: '关联成功'
          })  
          this.relationAccountClose()
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消关联'
        })          
      })
    },
    // 查询未关联的子账号搜索
    querySearch(mobile, cb) {
      console.log('mobile', mobile)
      if (!mobile) {
        cb(this.searchRecords)
        return
      }
      // 查询主账号列表
      getDistributorList(mobile).then(res => {
        console.debug('查询主账号列表', res)
        const users = res.data.data
        cb(
          users.map((user) => {
            return {
              value: user.username + `(${user.mobile})`,
              userId: user.userId
            }
          })
        )
      })
    },
    handleRelation(user) {
      this.addOrg.userId = user.userId
    },
    // 重置
    reset() {
      this.paramter.orgName = null
      this.paramter.typeName = null
      this.paramter.typeValue = null
      this.getOrganizationList()
    },
    // 搜索
    search() {
      this.getOrganizationList()
    },
    // 添加机构
    adddOrModify() {
      this.orgStatus = 'Add'
      this.addOrg.userId = undefined
      this.addOrg.orgId = undefined
      this.addOrg.orgName = undefined
      this.addOrg.username = undefined
      this.mainUserName = undefined
      this.interactive.dialogVisible = true
    },
    // 打开编辑机构弹框
    editOrModify(row) {
      this.addOrg.userId = row.user.userId
      this.addOrg.orgId = row.orgId
      this.addOrg.orgName = row.orgName
      this.addOrg.username = row.username
      this.mainUserName = row.user.username + `(${row.user.mobile})`
      this.orgStatus = 'Edit'
      this.interactive.dialogVisible = true
    },
    // 添加编辑机构弹框关闭
    handleClose() {
      this.interactive.dialogVisible = false
    },
    // 关联账户弹框关闭
    relationAccountClose() {
      this.interactive.relationAccountDialogVisible = false
    },
    // 打开关联账号弹框
    toRelationAccount(val) {
      this.orgId = val
      this.getNotRelationuser()
      this.interactive.relationAccountDialogVisible = true
    },
    //去详情页
    toDetail(row) {
      console.debug('row', row)
      this.$router.push({ path: '/mechanism/detail', 
        query: { orgId: row.orgId, orgName: row.orgName, username: row.user.username, mobile: row.user.mobile, status: row.status }})
    },
    // 去冻结用户
    toFrozen(val) {
      this.$confirm('您确定要冻结该机构吗?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        disabledOrganization(val).then(res => {
          console.debug('res', res)
          this.$message({
            type: 'success',
            message: '冻结成功!'
          })
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消冻结'
        })          
      })
    },
    // 去解冻
    toNormal(val) {
      this.$confirm('您确定要解冻该机构吗?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        normalOrganization(val).then(res => {
          console.debug('res', res)
          this.$message({
            type: 'success',
            message: '解冻成功!'
          })
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消解冻'
        })          
      })
    }
  }
}
</script>
<style scoped>
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.el_table {
  width: 100%;
  margin-top: 10px;
}
.el-input--mini {
  width: 200px;
}
</style>
