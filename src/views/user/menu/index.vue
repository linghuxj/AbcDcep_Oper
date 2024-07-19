<template>
  <div class="main-content menu-index">
    <div id="tableBtn">
      <el-button
        v-if="permissions.menu_add"
        icon="el-icon-plus"
        type="primary"
        @click="addOrUpdateHandle(false)"
      >
        {{ $t('message.add') }}
      </el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="menuList"
      :empty-text="$t('message.table_empty_text')"
      border
      :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
      row-key="id"
      :height="tableHeight"
      :tree-props="{ children: 'children', hasChildren: 'hasChildrens' }"
    >
      <el-table-column
        prop="label"
        :label="$t('menu.name')"
        :show-overflow-tooltip="true"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="icon"
        :label="$t('menu.icon')"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <i :class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        :label="$t('menu.sort')"
        width="60"
      ></el-table-column>
      <el-table-column
        prop="path"
        :label="$t('menu.path')"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="typeName"
        :label="$t('menu.type')"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag>{{ scope.row.typeName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="permission"
        :label="$t('menu.authority_sign')"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        :label="$t('message.operate')"
        align="center"
        class-name="small-padding fixed-width"
        width="240"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            v-if="permissions.menu_add"
            size="small"
            type="text"
            icon="el-icon-plus"
            @click="addOrUpdateHandle(false, scope.row.id)"
            >{{ $t('message.add') }}
          </el-button>
          <el-button
            v-if="permissions.menu_edit"
            size="small"
            type="text"
            icon="el-icon-edit"
            @click="addOrUpdateHandle(true, scope.row.id)"
            >{{ $t('message.edit') }}
          </el-button>
          <!-- <el-button
            icon="el-icon-refresh"
            type="text"
            size="mini"
            @click="handleTrans(scope.row)"
          >
            {{ $t('system.dict.trans') }}
          </el-button> -->
          <el-button
            v-if="permissions.menu_del"
            size="small"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >{{ $t('message.delete') }}
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
</template>

<script>
import { delObj, fetchMenuTree } from '@/api/user/menu'
import TableForm from './menu-form'
import { mapGetters } from 'vuex'

export default {
  name: 'Menu',
  components: { TableForm },
  data() {
    return {
      addOrUpdateVisible: false,
      // 遮罩层
      loading: true,
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 表格高度
      tableHeight: 'calc(100vh - 335px)'
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.getList()
  },
  mounted() {
    this.$nextTick(() => {
      this.countHeight()
      this.watchWidth()
    })
  },
  methods: {
    // 监听视口宽度变化
    watchWidth() {
      window.onresize = () => {
        this.countHeight()
      }
    },
    // 计算表格高度
    countHeight() {
      // 监听视口宽度变化
      let demoForm = document.getElementById('demo-form-inline')
      let tableBtn = document.getElementById('tableBtn')
      this.tableHeight = `calc(100vh - ${
        (demoForm ? demoForm.offsetHeight : 0) +
        (tableBtn ? tableBtn.offsetHeight : 0) +
        190
      }px)`
    },
    addOrUpdateHandle(isEdit, id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(isEdit, id)
      })
    },
    handleTrans(menu) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.handleTransDialog(menu)
      })
    },
    getList() {
      this.loading = true
      fetchMenuTree(false).then(response => {
        this.menuList = response.data.data
        this.loading = false
      })
    },
    handleDelete(row) {
      this.$confirm(this.$t('message.will_delete_data'), '提示', {
        confirmButtonText: this.$t('message.confirm'),
        cancelButtonText: this.$t('message.cancel'),
        type: 'warning'
      })
        .then(() => {
          delObj(row.id).then(res => {
            if (res) {
              this.$message.success(this.$t('message.delete_success'))
              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
