<template>
  <div class="main-content">
    <el-form :inline="true" :model="search" class="demo-form-inline">
      <el-form-item label="姓名：">
        <el-input v-model="search.name" placeholder="请输入内容"></el-input>
      </el-form-item>
      <div>
        <el-button type="primary" @click="to_search">搜索</el-button>
        <el-button @click="to_reset">重置</el-button>
      </div>
    </el-form>
    <div style="margin-top: 10px">
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        :header-cell-style="{background:'#f1f1f1',color:'#555555'}"
        style="width: 100%"
      >
        <el-table-column prop="name" label="店铺信息">
          <!-- <template slot-scope="scope">
            <span>{{ scope }}</span>
            <span>{{ scope }}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="name" label="发货地址数"></el-table-column>
        <el-table-column prop="name" label="收货地址数"></el-table-column>
        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <el-button type="text" @click="to_receiveAddress">新增收货地址</el-button>
            <el-button type="text" @click="to_deliverAddress">新增发货地址</el-button>
            <el-button type="text" @click="toShopAddressDetail(scope)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="margin-top: 10px">
        <!-- 分页 -->
        <table-pagination
          :total="pagination.total"
          :page.sync="pagination.current"
          :limit.sync="pagination.size"
          @pagination="getList"
        />
      </div>
    </div>
    <!-- 新增收货地址 -->
    <receive-dialog ref="receive_dialog" :is-edit="false" />
    <!-- 新增发货地址 -->
    <delive-dialog ref="deliver_dialog" :is-edit="false" />
  </div>
</template>
<script>
import TablePagination from '@/components/table-pagination'
import ReceiveDialog from '../components/ReceiveDialog'
import DeliveDialog from '../components/DeliveDialog'
export default {
  components: { TablePagination, ReceiveDialog, DeliveDialog },
  data() {
    return {
      tableLoading: false,
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      },
      tableData: [
        { name: '11' }
      ],
      search: {
        name: undefined
      }
    }
  },
  created() {},
  methods: {
    getList() {},
    toShopAddressDetail() {
      this.$router.push('/address/shop/detail')
    },
    // 去收货地址
    to_receiveAddress() {
      this.$refs.receive_dialog.interactive.dialogVisible_address = true
    },
    // 去发货地址
    to_deliverAddress() {
      this.$refs.deliver_dialog.interactive.dialogVisible_address = true
    },
    // 去搜索
    to_search() {},
    // 去重置
    to_reset() {
      this.search = {
        name: undefined
      }
    }
  }
}
</script>
