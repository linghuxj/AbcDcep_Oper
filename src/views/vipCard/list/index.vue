<template>
  <div class="main-content">
    <el-form :inline="true" :model="search" class="demo-form-inline">
      <el-form-item label="会员卡名称：">
        <el-input v-model="search.name" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="会员卡类型：" prop="type">
        <el-select v-model="search.status" placeholder="请选择会员卡状态">
          <el-option label="嗨ING用户权益卡" value="ING"></el-option>
          <el-option label="众包任务" value="task"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态：" prop="type">
        <el-select v-model="search.status">
          <el-option label="全部" value="all"></el-option>
          <el-option label="启用" value="Enable"></el-option>
          <el-option label="禁用" value="Disable"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="initPageCoupon">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" @click="addcompile">新增会员卡</el-button>
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
        <el-table-column prop="id" label="序号"> </el-table-column>
        <el-table-column prop="name" label="会员卡名称">
        </el-table-column>
        <el-table-column prop="platformName" label="使用平台">
        </el-table-column>
        <el-table-column prop="expiryDateType" label="有效期">
          <template slot-scope="scope">
            <div>{{ scope.row.expiryDate }}{{ scope.row.expiryDateType }}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="amount" label="绑定门店折扣数(家)" align="center">
          <template slot-scope="{row}">
            <router-link :to="'/hipro/lists/details/'+row.id">
              <span class="link-type">{{ row.quotaStore }}</span>
            </router-link>
          </template>
        </el-table-column> -->
        <el-table-column prop="price" label="划线价(元)"> </el-table-column>
        <el-table-column prop="price" label="零售价(元)"> </el-table-column>
        <el-table-column prop="quota" label="用户购买数">
          <template slot-scope="scope">
            <div>{{ scope.row.quota?scope.row.quota:'--' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="statusName" label="状态"> </el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleEdit(scope.row.id)">编辑</el-button>
            <!-- 详情暂时不做 -->
            <!-- <el-button size="mini" type="text" @click="handleLookCoupon(scope.row.id)">详情</el-button> -->
            <el-button size="mini" type="text" @click="forbid(scope.row)">禁用</el-button>
            <el-button size="mini" type="text" @click="enable(scope.row)">启用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        :page-count="pagination.pages"
        :current-page="pagination.current"
        :page-sizes="pagination.pageSize"
        :page-size="pagination.size"
        layout="sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @prev-click="handleCurrentChange"
        @next-click="handleCurrentChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { getCardPages } from '@/api/hipro/lists'
import { fetchItemList } from '@/api/system/dict'

export default {
  data() {
    return {
      tableLoading: false,
      search: {
        name: undefined,
        status: undefined
      }, // 表单绑定值
      heiproTypes: [],
      tableData: [],
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      }
    }
  },
  mounted() {
    this.initFetchItemList()
    this.initPageCoupon()
  },
  methods: {
    // 查询嗨卡类型
    initFetchItemList() {
      fetchItemList({ 'dictType': 'card_status' }).then(resp => {
        const page = resp.data.data
        this.heiproTypes = page.records
      })
        .catch(e => {
        })
    },
    // 查询优惠券列表
    initPageCoupon() {
      const query = Object.assign({}, this.search)
      console.debug('query', query)
      query.size = this.pagination.size
      query.current = this.pagination.current
      this.tableLoading = true
      getCardPages(query)
        .then(resp => {
          this.tableLoading = false
          const page = resp.data.data
          this.tableData = page.records
          this.pagination.total = page.total
          this.pagination.pages = page.pages
        })
        .catch(e => {
          this.tableLoading = false
        })
    },
    reset() {
      this.search = {
        couponTypeId: undefined,
        couponName: undefined
      }
      this.initPageCoupon()
    },
    // 禁用会员卡列表
    forbid(row) {
      const fullName = 'XXX'
      this.$confirm('确定要禁用“' + fullName + '”会员卡?', '禁用提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '禁用成功!'
        })
        this.initPageCoupon() 
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消禁用'
        })          
      })
    },
    // 启用会员卡列表
    enable(row) {
      const fullName = 'XXX'
      this.$confirm('确定要启用“' + fullName + '”会员卡?', '启用提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '启用成功!'
        })
        this.initPageCoupon()   
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消启用'
        })          
      })
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 查看
    // handleLookCoupon(id) {
    //   this.$router.push(`/hipro/lists/compile/${id}`)
    // },
    // 编辑
    handleEdit(id) {
      // this.$router.push(`/coupon/editCoupon/${couponId}`)
      this.$router.push('/vipCard/compile?id=' + id)
    },
    // 添加
    addcompile() {
      this.$router.push('/vipCard/establish')
    },
    //页容量改变
    handleSizeChange(val) {
      this.pagination.size = val
      this.initPageCoupon()
    },
    //页码改变
    handleCurrentChange(val) {
      this.pagination.current = val
      this.initPageCoupon()
    }
  }
}
</script>
<style lang="scss">
.business {
  background-color: white;
  margin: 10px 20px;
  padding: 30px;
}
.link-type,
.link-type:focus {
  color: #337ab7;
  cursor: pointer;
  text-decoration: underline;
  &:hover {
    color: rgb(32, 160, 255);
  }
}
</style>
