<template>
  <div>
    <el-button
      v-if="!isEdit"
      icon="el-icon-plus"
      type="primary"
      style="margin-bottom: 10px"
      @click="to_addGoods()"
      >新增店铺</el-button
    >
    <el-table
      :data="selectStoreArr"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <el-table-column label="店铺名称">
        <template slot-scope="scope">
          <span>{{ scope.row.storeName ? scope.row.storeName : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template slot-scope="scope">
          <span>{{
            scope.row.storeTypeName ? scope.row.storeTypeName : '--'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址">
        <template slot-scope="scope">
          <span>{{ scope.row.address ? scope.row.address : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商户电话">
        <template slot-scope="scope">
          <span>{{ scope.row.contactTel ? scope.row.contactTel : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="to_delete(scope.$index)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="interview.dialogVisible" title="关联店铺">
      <div style="margin-bottom: 10px">
        <el-input
          v-model="search.storeName"
          placeholder="请输入搜索内容关键字"
          style="width: 200px"
        ></el-input>
        <el-button type="primary" style="margin-left: 10px" @click="to_search()"
          >搜索</el-button
        >
        <el-button @click="to_reset()">重置</el-button>
      </div>

      <div>
        <el-table
          ref="storeRef"
          :row-key="getRowKeys"
          :data="storeArr"
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          @selection-change="handleSelectionChange"
          height="500px"
        >
          <el-table-column
            type="selection"
            :reserve-selection="true"
          ></el-table-column>
          <el-table-column prop="storeNo" label="店铺编号"></el-table-column>
          <el-table-column prop="storeName" label="店铺名称"></el-table-column>
          <el-table-column prop="productNum" label="商品数量"></el-table-column>
        </el-table>
        <div style="text-align:right;margin-top:10px">
        <!-- 分页 -->
        <table-pagination
          :total="pagination.total"
          :page.sync="pagination.current"
          :limit.sync="pagination.size"
          @pagination="getList"
        />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="interview.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="to_relationStore()"
          >确定关联</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import TablePagination from '@/components/table-pagination'
import { getStorePage } from '@/api/store/store'
import { getActivityPageStore } from '@/api/operate/discount'
export default {
  name: 'DiscountAddGoods',
  components: { TablePagination },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      storeArr: [],
      // 关联店铺数组
      selectStoreArr: [],
      // 关联店铺id数组
      selectStoreIds: [],
      selectArr: [],
      interview: {
        dialogVisible: false
      },
      search: {
        storeName: undefined
      },
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20
      }
    }
  },
  created() {
    this.getPageStores()
    if (this.isEdit) {
      this.$nextTick(() => {
        this.getActivityDetail()
      })
    }
  },
  methods: {
    // 查询店铺信息
    _getActivityPageStore() {
      const query = {
        id: this.id,
        current: 1,
        size: 10000
      }
      getActivityPageStore(query).then(res => {
        const page = res.data.data
        this.selectStoreArr = page.records
      })
    },
    getList() {
      this.getPageStores()
    },
    // 选中关联
    handleSelectionChange(val) {
      console.debug('res', val)
      this.selectArr = val
    },
    // 去关联
    to_relationStore() {
      if (this.selectArr.length > 0) {
        this.selectStoreArr = []
        for (const i in this.selectArr) {
          this.selectStoreArr.push(this.selectArr[i])
          this.selectStoreIds.push(this.selectArr[i].storeId)
        }
      }
      this.interview.dialogVisible = false
    },
    // 去删除
    to_delete(index) {
      this.selectStoreArr.splice(index, 1)
    },
    // 查询店铺列表
    getPageStores() {
      const data = {
        keyword: this.search.storeName,
        current:this.pagination.current,
        size:this.pagination.size
      }
      getStorePage(data).then(res => {
        console.debug('res', res)
        this.storeArr = res.data.data.records
        this.pagination.total = res.data.data.total
      })
    },
    // 搜索
    to_search() {
      this.getPageStores()
    },
    // 重置
    to_reset() {
      this.search.storeName = undefined
      this.pagination = {
        total: 0,
        current: 1,
        size: 20
      }
      this.getPageStores()
    },
    to_addGoods() {
      if (this.selectStoreArr.length > 0) {
        // for()
        // this.$refs.storeRef.toggleRowSelection(this.dataList[i], true)
      }
      this.interview.dialogVisible = true
    },
    // 保存选中的数据id,row-key就是要指定一个key标识这一行的数据
    getRowKeys(row) {
      return row.storeId
    }
  }
}
</script>
<style scoped></style>
