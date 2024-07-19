<template>
  <div>
    <el-button
      v-if="!isEdit"
      icon="el-icon-plus"
      type="primary"
      style="margin-bottom: 10px"
      @click="to_addGoods()"
      >新增商圈</el-button
    >
    <el-table
      :data="selectBussinessArr"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      tooltip-effect="light"
    >
      <el-table-column label="所在城市" prop="locationName"></el-table-column>
      <el-table-column label="商圈名称" prop="districtName"></el-table-column>
      <el-table-column label="商圈地址" prop="address"></el-table-column>
      <el-table-column
        label="商圈简介"
        prop="districtDesc"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.districtDesc ? scope.row.districtDesc : '--'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="75">
        <template slot-scope="scope">
          <el-button type="text" @click="to_delete(scope.$index)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="interview.dialogVisible" title="关联商圈">
      <div style="margin-bottom: 10px">
        <el-input
          v-model="filterText"
          placeholder="请输入搜索内容关键字"
          style="width: 200px"
        ></el-input>
      </div>
      <div>
        <el-tree
          ref="tree"
          :props="props"
          :load="loadNode"
          node-key="id"
          lazy
          show-checkbox
          :filter-node-method="filterNode"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="interview.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="to_relation()">确定关联</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getAreaList, getByCityCode } from '@/api/commerce/commerce'
import { getActivityPageBusiness } from '@/api/operate/discount'
export default {
  name: 'DiscountAddGoods',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    id: {
      default: ''
    }
  },
  data() {
    return {
      // 表格回显数组
      bussinessData: [],
      // 选中商圈ids
      bussinessIDs: [],
      // 选中商圈
      selectBussinessArr: [],
      filterText: undefined,
      options: [],
      interview: {
        dialogVisible: false
      },
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf'
      },
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 10000
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    console.log(this.isEdit,'this.isEdit')
    if (this.isEdit) {
      this.$nextTick(() => {
        this.getActivityDetail()
      })
    }
  },
  methods: {
    // 查询
    getActivityDetail() {
      const query = {
        id: this.id,
        current: 1,
        size: 10000
      }
      getActivityPageBusiness(query).then(res => {
        const page = res.data.data
        this.selectBussinessArr = page.records
        console.log(this.selectBussinessArr, 123)
      })
    },
    // 懒加载
    loadNode(node, resolve) {
      const _this = this
      const query = {
        current: 1,
        size: 10000
      }
      if (node.level === 0) {
        //父类id，查询省传-1
        query.parentId = -1
        getAreaList(query).then(res => {
          console.debug('res', res)
          const data = []
          const array = res.data.data
          for (let index = 0; index < array.length; index++) {
            const element = array[index]
            const ele = {
              name: element.name,
              id: element.areaId
            }
            data.push(ele)
          }
          return resolve(data)
        })
      }
      if (node.level === 1) {
        const data = {
          parentId: node.key
        }
        getAreaList(data).then(res => {
          const data = []
          const array = res.data.data
          for (let index = 0; index < array.length; index++) {
            const element = array[index]
            const ele = {
              name: element.name,
              id: element.areaId
            }
            data.push(ele)
          }
          return resolve(data)
        })
      }
      if (node.level === 2) {
        getByCityCode({ ...node.key, size: 99 }).then(res => {
          const data = []
          const array = res.data.data.records
          for (let index = 0; index < array.length; index++) {
            const element = array[index]
            const ele = {
              name: element.districtName,
              id: element.districtId,
              leaf: true
            }
            // _this.bussinessIDs.push(element.districtId)
            _this.bussinessData.push(element)
            // console.debug('_this.bussinessData', _this.bussinessData)
            data.push(ele)
          }
          return resolve(data)
        })
      }
      if (node.level > 2) return resolve([])
    },
    // 去删除
    to_delete(index) {
      this.selectBussinessArr.splice(index, 1)
    },
    // 过滤
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    //去关联
    to_relation() {
      const arr = this.$refs.tree.getCheckedKeys()
      this.bussinessIDs = arr
      // 集合去交集
      this.selectBussinessArr = []
      for (const i in arr) {
        for (const k in this.bussinessData) {
          if (arr[i] === this.bussinessData[k].districtId) {
            this.selectBussinessArr.push(this.bussinessData[k])
          }
        }
      }
      this.interview.dialogVisible = false
    },
    to_addGoods() {
      this.interview.dialogVisible = true
    }
  }
}
</script>
<style scoped></style>
