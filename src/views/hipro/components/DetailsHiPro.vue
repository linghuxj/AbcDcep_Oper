<template>
  <div class="business">
    <div class="heder">
      <div class="user-item">
        <el-image style="width: 240px;" :src="form.image? form.image: './img/hiPro.png'" fit="scale-down">
        </el-image>
      </div>
      <div class="user-item">
        <div>昵称: {{ (form.name) || '/'}}</div>
        <div>类型: {{ (form.expiryDateType) || '/'}}</div>
        <div>编号: {{ form.id }}</div>
      </div>
      <div class="user-item">
        <div>售价: {{ (form.price) || '/'}}</div>
        <div>有效期: {{form.expiryDate}} {{form.expiryDateType}}</div>
        <div>使用平台: {{ (form.platform) || '/' }}</div>
      </div>
      <div class="user-item">
        <div>领取方式: {{ '/' }}</div>
        <div>用户购买数: </div>
        <div>关联门店数: {{ '/' }}</div>
      </div>
    </div>
    <div class="tabs">
      <div class="business-tit">
        <span class="tabitem actionts">未关联</span>
        <el-button type="primary">主要按钮</el-button>
      </div>
      <div class="business-tab">
        <div class="business-tab-search">
          <el-input placeholder="请输入请输入需要关联的门店名称" prefix-icon="el-icon-search" v-model="search" style="width:300px;">
            <template #append>
              <el-button type="primary">搜索</el-button>
            </template>
          </el-input>
        </div>
        <el-table
          :empty-text="$t('message.table_empty_text')"
          :data="tableData"
          border
          v-loading="tableLoading"
          style="width: 100%"
        >
          <el-table-column prop="id" label="嗨PRO卡编号"> </el-table-column>
          <el-table-column prop="name" label="门店名称">
          </el-table-column>
          <el-table-column prop="expiryDateType" label="原折扣（%）">
          </el-table-column>
          <el-table-column prop="price" label="会员折扣（%）"> </el-table-column>
          <el-table-column label="操作" width="220">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleLookCoupon(scope.row.id)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          background
          @size-change="handleSizeChange"
          @prev-click="handleCurrentChange"
          @next-click="handleCurrentChange"
          @current-change="handleCurrentChange"
          :page-count="pagination.pages"
          :current-page="pagination.current"
          :page-sizes="pagination.pageSize"
          :page-size="pagination.size"
          layout="sizes, prev, pager, next, jumper"
          :total="pagination.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  getCardById
} from '@/api/hipro/lists'

export default {
  name: 'DetailsHiPro',

  computed: {
    ...mapGetters(['permissions'])
  },
  data() {
    return {
      activeTag: 'statistical',
      form: {
        cardDesc: undefined,
        expiryDate: undefined,
        expiryDateType: undefined,
        image: undefined,
        name: undefined,
        platform: undefined,
        price: undefined,
        id: undefined
      },
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      },
      tableData: [],
      tableLoading: false,
      search: null
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.$nextTick(() => {
      this.getHiProDetail(id)
    })
  },
  mounted() {
  },
  methods: {
    // 根据id查询嗨卡信息
    getHiProDetail(id) {
      let _this = this
      getCardById(id).then((res) => {
        _this.form = res.data.data
      })
    },
    //页容量改变
    handleSizeChange(val) {
      this.pagination.size = val
      this.getSubLevelUsers()
    },
    //页码改变
    handleCurrentChange(val) {
      this.pagination.current = val
      this.getSubLevelUsers()
    },
  }
}
</script>
<style lang="scss" scoped>
.business {
  background-color: #fff;
  margin: 10px 20px;
  padding: 30px;
  .heder {
    display: flex;
    justify-content: space-between;
    .statusName{
      color: #FFF;
      background-color: #3399ff;
      text-align: center;
      margin-bottom: 10px;
    }
    .user-item{
        font-size: 13px;
        flex: 1;
        div{
          margin: 10px 0px 10px 0px;
        }
    }
    .image-slot{
      width: 1;
    }
  }
  .business-tit {
    margin-top: 20px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid #ebedef;
    .tabitem {
      display: inline-block;
      width: 100px;
      text-align: center;
      cursor: pointer;
    }
    .actionts {
      color: #0094ff;
      border-bottom: 2px solid #0094ff;
    }
  }

  .business-tab-search {
    margin-top: 20px;
    margin-bottom: 15px;
  }

  .tabs-select{
    text-align: right;
  }
  .statistical {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }
  .statis-type {
    padding: 10px 0px;
  }
  .statistical-item-item{
    margin: 5px 0px;
    div{
      color: #797979;
    }
  }
  .user {
    display: flex;
    justify-content: space-around;
    text-align: center;
    .user-avatar {
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 50%;
    }
    .user-base {
      width: 180px;
    }
  }
}
</style>
