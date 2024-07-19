<template>
  <div class="business">
    <el-form :inline="true" :model="search" class="demo-form-inline" :rules="rules">
      <el-form-item :label="$t('business.search')">
        <el-select
          v-model="search.searchType"
          :placeholder="$t('business.search')"
          style="width: 30%"
        >
          <el-option label="综合筛选" value></el-option>
          <el-option label="商户编号" value="storeId"></el-option>
          <el-option label="商户名称" value="storeName"></el-option>
          <el-option label="联系电话" value="contactTel"></el-option>
          <el-option label="负责人手机号" value="mobile"></el-option>
          <el-option label="负责人姓名" value="fullName"></el-option>
        </el-select>
        <el-input
          v-model="search.searchValue"
          :placeholder="$t('business.search')"
          style="width: 70%"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('business.type')" prop="storeType">
        <el-select v-model="search.storeType" :placeholder="$t('business.type')">
          <el-option
            v-for="item in types"
            :key="item.typeId"
            :label="item.typeName"
            :value="item.typeId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('business.address')">
        <el-input v-model="search.address" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item :label="$t('business.time')">
        <el-date-picker
          v-model="search.date"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="initPageStore">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" @click="addCompile">创建商户</el-button>
    </div>
    <div class="businesstab">
      <span :class="[type == 0 ? 'tabitem actionts' : 'tabitem']" @click="tabview((type = 0))">正常</span>
      <span :class="[type == 2 ? 'tabitem actionts' : 'tabitem']" @click="tabview((type = 2))">待审核</span>
      <span :class="[type == 1 ? 'tabitem actionts' : 'tabitem']" @click="tabview((type = 1))">冻结</span>
    </div>
    <div style="margin-top: 10px">
      <el-table
        v-loading="tableLoading"
        :empty-text="$t('message.table_empty_text')"
        :data="tableData"
        :header-cell-style="{background:'#f1f1f1',color:'#555555'}"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="storeId" label="商户编号"></el-table-column>
        <el-table-column prop="storeName" label="商户名称"></el-table-column>
        <el-table-column prop="storeType" label="商户类型"></el-table-column>
        <el-table-column prop="location" label="省 市 区/县"></el-table-column>
        <el-table-column prop="address" label="详细地址"></el-table-column>
        <el-table-column prop="mobile" label="负责人姓名"></el-table-column>
        <el-table-column prop="contactTel" label="联系电话"></el-table-column>
        <el-table-column prop="createTime" label="注册时间"></el-table-column>
        <el-table-column v-if="showStore" label="门店数量" width="110px" align="center">
          <template slot-scope="{row}">
            <span class="link-type">{{ row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <el-button size="mini" @click="editCompile(scope.row.storeId)">添加门店</el-button>
            <el-button size="mini" type="success" @click="editCompile(scope.row.storeId)">查看</el-button>
            <!-- <el-button
              v-if="scope.row.status !== 'disabled'"
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row.storeId)"
            >冻结</el-button> -->
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
        layout="sizes, prev, pager, next"
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
// import { mapGetters } from 'vuex'
import {
  pageStores
} from '@/api/store/store'
import { allStoreType } from '@/api/store/storeType'


// 设置默认表头
// const defaultTabelHeader = [
//   { title: '商户编号', value: 'storeName' },
//   { title: '商户名称', value: 'storeTypeName' },
//   { title: '商户类型', value: 'storeTypeName' },
//   { title: '省 市 区/县', value: 'location' },
//   { title: '详细地址', value: 'address' },
//   { title: '负责人姓名', value: 'contactTel' },
//   { title: '联系电话', value: 'contactTel' },
//   { title: '开通时间', value: 'createTime' }
// ]
// const defaultTabelThead = [
//   { title: '商户编号', value: 'storeName' },
//   { title: '商户名称', value: 'storeTypeName' },
//   { title: '商户类型', value: 'storeTypeName' },
//   { title: '省 市 区/县', value: 'location' },
//   { title: '详细地址', value: 'address' },
//   { title: '负责人姓名', value: 'contactTel' },
//   { title: '联系电话', value: 'contactTel' },
//   { title: '注册时间', value: 'createTime' },
//   { title: '登录账号', value: 'createTime' }
// ]

export default {
  data() {
    return {
      search: {
        searchType: undefined,
        searchValue: undefined,
        storeType: undefined,
        address: undefined,
        date: [],
        status: 'normal'
      },
      tableLoading: false,
      rules: {
        type: [
          { required: true, message: '请选择商户类型', trigger: 'change' }
        ]
      },
      types: [],
      type: 0,
      tableData: [],
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      },
      showStore: true
    }
  },
  mounted() {
    this.initPageStore()
    this.getTypes()
  },
  methods: {
    getTypes() {
      allStoreType().then((res) => {
        this.types = res.data.data
      })
    },
    tabview(type) {
      if (type === 0) {
        this.search.status = 'normal'
        this.showStore = true
      } else if (type === 1) {
        this.search.status = 'disabled'
        this.showStore = false
      } else if (type === 2) {
        this.showStore = false
      }
      this.initPageStore()
    },
    // 分页获取商户列表
    initPageStore() {
      const [startCreateTime, endCreateTime] = this.search.date
      const params = {
        startCreateTime,
        endCreateTime,
        storeType: this.search.storeType,
        address: this.search.address,
        size: this.pagination.size,
        current: this.pagination.current,
        status: this.search.status
      }
      if (this.search.searchType) {
        params[this.search.searchType] = this.search.searchValue
      }
      this.tableLoading = true
      // getSellerPages(params)
      pageStores(params)
        .then((resp) => {
          this.tableLoading = false
          const page = resp.data.data
          this.tableData = page.records
          this.pagination.total = page.total
          this.pagination.pages = page.pages
        })
        .catch((e) => {
          this.tableLoading = false
        })
    },
    reset() {
      this.search = {
        searchType: undefined,
        searchValue: undefined,
        storeType: undefined,
        address: undefined,
        date: []
      }
      this.initPageStore()
    },
    handleSizeChange(size) {
      this.pagination.size = size
      this.initPageStore()
    },
    handleCurrentChange(current) {
      this.pagination.current = current
      this.initPageStore()
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          return false
        }
      })
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 新增
    addCompile() {
      this.$router.push('/business/compile')
    },
    // 编辑
    editCompile(val) {
      this.$router.push('/business/compile?id=' + val)
    }

    // 冻结
    // handleDelete(no, id) {
    //   editStoreStatus(id, 'disabled').then((resp) => {
    //     this.initPageStore()
    //   })
    // }
  }
}
</script>
<style lang="scss">
.business {
  background-color: white;
  margin: 10px 20px;
  padding: 30px;
  .businesstab {
    margin-top: 20px;
    .tabitem {
      display: inline-block;
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      cursor: pointer;
    }
    .actionts {
      color: #0094ff;
      border-bottom: 2px solid #0094ff;
    }
  }
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
