<template>
  <div class="mechanism-content">
    <div class="main-top">
      <div class="main-top-item">
        <div>汉堡王(德思勤)</div>
        <div>地址地址地址地址地址</div>
      </div>
      <div class="main-top-item">
        <div>联系电话：0234839051</div>
        <div>负责人:刘大大(11111)</div>
      </div>
    </div>
    <div class="main-bottom">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="发货地址" name="deliver_goods">
          <el-table
            v-loading="tableLoading"
            :data="tableData"
            border
            :header-cell-style="{background:'#eef1f6',color:'#606266'}" 
            class="el_table">
            <el-table-column type="index" label="序号" prop="name"></el-table-column>
            <el-table-column prop="name" label="发货人信息" width="200">
              <template slot-scope="scope">
                <span>{{ scope.row.name?scope.row.name:'--' }}</span>
              </template> 
            </el-table-column>
            <el-table-column prop="name" label="地址"></el-table-column>
            <el-table-column prop="name" label="设为默认地址"></el-table-column>
            <el-table-column label="操作" width="300" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click="to_EditDeliveAddress(scope)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="收货地址" name="receiving_goods">
          <el-table
            v-loading="tableLoading"
            :data="tableData"
            border
            :header-cell-style="{background:'#eef1f6',color:'#606266'}" 
            class="el_table">
            <el-table-column type="index" label="序号" prop="name"></el-table-column>
            <el-table-column prop="name" label="收货人信息" width="200">
              <template slot-scope="scope">
                <span>{{ scope.row.name?scope.row.name:'--' }}</span>
              </template> 
            </el-table-column>
            <el-table-column prop="name" label="地址"></el-table-column>
            <el-table-column prop="name" label="设为默认地址">
              <el-switch
                v-model="interactive.default_value"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-table-column>
            <el-table-column label="操作" width="300" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click="to_EditReceiveAddress(scope)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 分页 -->
      <div style="text-align:right">
        <table-pagination
          :total="pagination.total"
          :page.sync="pagination.current"
          :limit.sync="pagination.size"
          @pagination="getList"
        />
      </div>
    </div>
    <!-- 编辑收货地址 -->
    <receive-dialog ref="receive_dialog" :is-edit="true" />
    <!-- 编辑发货地址 -->
    <delive-dialog ref="deliver_dialog" :is-edit="true" />
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
      tableData: [
        { name: '11' }
      ],
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      },
      interactive: {
        default_value: true,
        dialogVisible_address: false
      },
      formLabelWidth: '120px',
      form: {},
      editOrAdd: 'Add',
      activeName: 'receiving_goods'
      
    }
  },
  created() {},
  methods: {
    getList() {},
    // 编辑发货
    to_EditDeliveAddress() {
      this.$refs.deliver_dialog.interactive.dialogVisible_address = true
    },
    // 编辑收货
    to_EditReceiveAddress() {
      this.$refs.receive_dialog.interactive.dialogVisible_address = true
    },
    // 去添加
    toAddAddress() {
      this.form = {}
      this.editOrAdd = 'Add'
      this.interactive.dialogVisible_address = true
    },
    // 去关闭
    handleClose() {
      this.interactive.dialogVisible_address = false
    },
    // 表格切换
    handleClick() {}
  }
}
</script>
<style scope>
.mechanism-content {
   margin: 10px 20px;
}
.main-top {
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #FFF;
  margin-bottom: 10px;
  padding: 0px 30px;
  position: relative;
}
.main-bottom {
  background-color: #FFF;
   padding: 20px 30px;
}
.main-top-item div {
  font-size: 12px;
  color: #333333;
  margin: 5px;
}
</style>
