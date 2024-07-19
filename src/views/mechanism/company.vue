<template>
  <basic-container>
    <div class="avue-crud">
      <div class="avue-crud-add" v-if="permissions.unit_add">
        <el-button type="primary" @click="addOrUpdateHandle(false, 'insert')">
          新建单位
        </el-button>
      </div>

      <el-table
        v-loading="loading"
        :empty-text="$t('message.table_empty_text')"
        border
        :data="menuList"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildrens' }"
      >
        <el-table-column
          prop="unitName"
          label="单位名称"
          :show-overflow-tooltip="true"
          width="500"
        ></el-table-column>

        <el-table-column label="状态" align="center" width="300">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-text="启用"
              inactive-text="停用"
              active-value="normal"
              inactive-value="disabled"
              :disabled="!permissions.unit_status"
              @change="switchStatus($event, scope.row.id)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              v-if="permissions.unit_add"
              size="small"
              type="text"
              @click="addOrUpdateHandle(false, 'add', scope.row.id)"
            >
              新建下级
            </el-button>
            <el-button
              v-if="permissions.unit_edit"
              size="small"
              type="text"
              @click="addOrUpdateHandle(true, 'edit', scope.row.id)"
            >
              编辑
            </el-button>

            <el-button size="small" type="text" @click="seeHandle(scope.row)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <table-form
        v-if="addOrUpdateVisible"
        ref="addOrUpdate"
        @refreshDataList="getList"
      ></table-form>
    </div>
  </basic-container>
</template>

<script>
import {
  getUnitTree,
  updateUnitDisabled,
  updateUnitNormal
} from '@/api/mechanism/company'
import TableForm from './components/company-form'
import { mapGetters } from 'vuex'

export default {
  name: 'Company',
  components: { TableForm },
  data() {
    return {
      addOrUpdateVisible: false,
      // 遮罩层
      loading: true,
      // 菜单表格树数据
      menuList: []
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.getList()
  },

  methods: {
    // 查看
    getList() {
      this.loading = true
      ;(this.addOrUpdateVisible = false),
        getUnitTree(false).then(response => {
          this.menuList = response.data.data
          this.loading = false
        })
    },
    // 重置
    reset(formName) {
      this.$refs[formName].resetFields()
      this.getList()
    },

    // 新增、修改
    addOrUpdateHandle(isEdit, title, id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(isEdit, title, id)
      })
    },

    seeHandle(row) {
      console.log(row)
      this.$router.push({ path: '/mechanism/see', query: { id: row.id } })
      // this.$confirm(
      //   this.$t('message.will_delete_data'),
      //   this.$t('message.prompt'),
      //   {
      //     confirmButtonText: this.$t('message.confirm'),
      //     cancelButtonText: this.$t('message.cancel'),
      //     type: 'warning'
      //   }
      // )
      //   .then(function() {
      //     return delObj(row.id)
      //   })
      //   .then(() => {
      //     this.getList()
      //     this.$message.success(this.$t('message.delete_success'))
      //   })
    },
    // 启用/停用
    switchStatus(val, va) {
      console.log(va)
      if (val === 'normal') {
        updateUnitNormal(va)
          .then(() => {
            this.$message({
              message: '启用成功！',
              type: 'success'
            })
          })
          .catch(e => {
            console.error(e)
          })
      } else {
        updateUnitDisabled(va)
          .then(() => {
            this.$message({
              message: '停用成功！',
              type: 'success'
            })
          })
          .catch(e => {
            console.error(e)
          })
        
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.avue-crud-add {
  margin: 10px 0px;
}
</style>
