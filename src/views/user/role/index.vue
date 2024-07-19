<template>
  <div class="main-content role">
    <el-button
      v-if="permissions.role_add"
      id="tableBtn"
      class="add-item"
      type="primary"
      icon="el-icon-plus"
      @click="handleCreate"
    >
      {{ $t('message.add') }}
    </el-button>
    <el-table
      v-loading="listLoading"
      :empty-text="$t('message.table_empty_text')"
      :data="list"
      :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
      :height="tableHeight"
      border
    >
      <el-table-column prop="roleName" :label="$t('role.name')">
      </el-table-column>
      <el-table-column prop="roleCode" :label="$t('role.code')">
      </el-table-column>
      <el-table-column prop="roleDesc" :label="$t('role.desc')">
      </el-table-column>
      <el-table-column prop="createTime" :label="$t('message.createTime')">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | ndateFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.operate')" width="240" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-if="permissions.role_edit"
            type="text"
            size="mini"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row, scope.index)"
          >
            {{ $t('message.edit') }}
          </el-button>
          <el-button
            v-if="permissions.role_del"
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(scope.row, scope.index)"
          >
            {{ $t('message.delete') }}
          </el-button>
          <el-button
            v-if="permissions.role_permission"
            type="text"
            size="mini"
            icon="el-icon-plus"
            @click="handlePermission(scope.row, scope.index)"
          >
            {{ $t('role.permission') }}
          </el-button>
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
    <el-dialog
      :visible.sync="dialogPermissionVisible"
      :close-on-click-modal="false"
      :title="$t('role.title')"
    >
      <el-table
        ref="multipleTable"
        :empty-text="$t('message.table_empty_text')"
        check-strictly
        :data="treeData"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        border
        :tree-props="{ children: 'children' }"
        @select-all="selectDeptAll"
        @select="selectDeptCheck"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="id" label="#ID" sortable width="180">
        </el-table-column>
        <el-table-column
          prop="label"
          :label="$t('role.permission')"
          sortable
        >
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" size="small" @click="cancel()">{{
          $t('message.cancel')
        }}</el-button>
        <el-button type="primary" size="small" @click="updatePermission(roleId)"
          >{{ $t('message.update') }}
        </el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible="roleVisible"
      :title="isEdit ? $t('message.edit') : $t('message.add')"
      @close="handleCancel"
    >
      <el-form ref="roleForm" :rules="rules" :model="form" label-width="100px">
        <el-form-item prop="roleName" :label="$t('role.name') + '：'">
          <el-input v-model="form.roleName" />
        </el-form-item>
        <el-form-item prop="roleCode" :label="$t('role.code') + '：'">
          <el-input v-model="form.roleCode" />
        </el-form-item>
        <el-form-item prop="roleDesc" :label="$t('role.desc') + '：'">
          <el-input v-model="form.roleDesc" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">{{ $t('message.cancel') }}</el-button>
        <el-button
          v-if="!isEdit"
          type="primary"
          :disabled="b_loading"
          @click="create"
          >{{ $t('message.confirm') }}</el-button
        >
        <el-button
          v-if="isEdit"
          type="primary"
          :disabled="b_loading"
          @click="update"
          >{{ $t('message.confirm') }}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addObj,
  delObj,
  fetchPage,
  fetchRoleTree,
  permissionUpd,
  postObj
} from '@/api/user/role'
import { fetchMenuTree } from '@/api/user/menu'
import { mapGetters } from 'vuex'

import TablePagination from '@/components/table-pagination'

export default {
  name: 'TableRole',
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      searchForm: {},
      scopeData: [],
      treeData: [],
      checkedKeys: [],
      checkedScope: [],
      defaultProps: {
        children: 'children',
        label: 'label'
        // value: 'id'
      },
      scopeProps: {
        children: 'children',
        label: 'name'
        // value: 'id'
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20
      },
      menuIds: '',
      roleVisible: false,
      isEdit: false,
      list: [],
      listLoading: true,
      form: {
        roleName: '',
        roleCode: '',
        roleDesc: ''
      },
      b_loading: false,
      roleId: undefined,
      roleCode: undefined,
      rolesOptions: undefined,
      dialogPermissionVisible: false,
      roleManager_btn_add: false,
      roleManager_btn_edit: false,
      roleManager_btn_del: false,
      roleManager_btn_perm: false,
      rules: {
        roleName: [
          {
            required: true,
            message: this.$t('role.valid_name'),
            trigger: 'blur'
          }
        ],
        roleCode: [
          {
            required: true,
            message: this.$t('role.valid_code'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.roleManager_btn_add = this.permissions['role_add']
    this.roleManager_btn_edit = this.permissions['role_edit']
    this.roleManager_btn_del = this.permissions['role_del']
    this.roleManager_btn_perm = this.permissions['role_permission']
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
        (demoForm ? demoForm.offsetHeight + 15 : 0) +
        (tableBtn ? tableBtn.offsetHeight + 20 : 0) +
        187
      }px)`
    },
    getList(params) {
      console.log()
      const query = Object.assign({}, this.pagination, params, this.searchForm)
      this.listLoading = true
      fetchPage(query)
        .then(response => {
          this.list = response.data.data.records
          this.pagination.total = response.data.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handlePagination(page) {
      this.pagination.currentPage = page
      this.getList()
    },
    sizeChange(pageSize) {
      this.pagination.size = pageSize
    },
    currentChange(current) {
      this.pagination.current = current
    },
    handleCreate() {
      this.roleVisible = true
    },
    handleCancel() {
      this.$refs.roleForm.resetFields()
      this.roleVisible = false
      this.isEdit = false
      this.form = {
        roleName: '',
        roleCode: '',
        roleDesc: ''
      }
    },
    handleUpdate(row) {
      this.roleVisible = true
      this.isEdit = true
      this.form = Object.assign({}, row)
    },
    cancel() {
      this.dialogPermissionVisible = false
    },
    handlePermission(row) {
      fetchRoleTree(row.roleId)
        .then(response => {
          this.checkedKeys = response.data.data
          return fetchMenuTree()
        })
        .then(response => {
          this.treeData = response.data.data
          this.$nextTick(() => {
            this.checkedKeys.forEach(item => {
              this.findSelectedData(this.treeData, item)
            })
          })
          this.dialogPermissionVisible = true
          this.roleId = row.roleId
          this.roleCode = row.roleCode
        })
    },
    findSelectedData(data, id) {
      data.some(element => {
        if (element.id === id) {
          this.$refs.multipleTable.toggleRowSelection(element, true)
          return true
        }
        if (element.children !== null) {
          element.children.some(children => {
            if (children.id === id) {
              this.$refs.multipleTable.toggleRowSelection(children, true)
              return true
            }
            if (children.children !== null) {
              this.findSelectedData(children.children, id)
              // children.children.some(item => {
              //   if (item.id === id) {
              //     this.$refs.multipleTable.toggleRowSelection(item, true)
              //     return true
              //   }
              // })
            }
          })
        }
      })
      // })
    },
    /**
     * 权限多选功能
     */
    selectDeptAll() {
      // 自定义的select-all方法
      this.deptCheckData = [] // data属性
      if (this.$refs.multipleTable.selection.length === 0) {
        this.deptSelectItem(this.treeData, true)
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    deptSelectItem(data, idx) {
      // 递归选中与不选中
      data.map(item => {
        if (idx) {
          // 选中
          if (item.children && item.children.length > 0) {
            if (
              this.$refs.multipleTable.selection.findIndex(
                se => se.id === item.id
              ) === -1
            ) {
              this.$refs.multipleTable.selection.push(item)
            }
            this.deptSelectItem(item.children, idx)
          } else {
            if (
              this.$refs.multipleTable.selection.findIndex(
                se => se.id === item.id
              ) === -1
            ) {
              this.$refs.multipleTable.selection.push(item)
            }
          }
        } else {
          // 不选中
          if (item.children && item.children.length > 0) {
            this.$refs.multipleTable.toggleRowSelection(item, false)
            this.deptSelectItem(item.children, idx)
          } else {
            this.$refs.multipleTable.toggleRowSelection(item, false)
          }
        }
      })
    },
    selectDeptCheck(val, row) {
      // 自定义select方法
      if (val.findIndex(item => item.id === row.id) === -1) {
        // 父节点取消选择
        this.deptSelectItem([row], false)
      } else {
        // 选择父节点
        this.deptSelectItem([row], true)
      }
    },
    /**
     * 解析出所有的太监节点id
     * @param json 待解析的json串
     * @param idArr 原始节点数组
     * @param temp 临时存放节点id的数组
     * @return 太监节点id数组
     */
    resolveAllEunuchNodeId(json, idArr, temp) {
      for (let i = 0; i < json.length; i++) {
        const item = json[i]
        // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
        if (item.children && item.children.length !== 0) {
          this.resolveAllEunuchNodeId(item.children, idArr, temp)
        } else {
          temp.push(idArr.filter(id => id === item.id))
        }
      }
      return temp
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleDelete(row) {
      var _this = this
      this.$confirm(
        _this.$t('message.will_delete_data'),
        _this.$t('message.tips'),
        {
          confirmButtonText: _this.$t('message.confirm'),
          cancelButtonText: _this.$t('message.cancel'),
          type: 'warning'
        }
      )
        .then(function () {
          return delObj(row.roleId)
        })
        .then(() => {
          this.getList()
          this.$notify.success(this.$t('message.delete_success'))
        })
    },
    create() {
      if (this.form.type === 1) {
        this.form.scope = this.$refs.scopeTree.getCheckedKeys().join(',')
      }
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          this.b_loading = true
          addObj(this.form)
            .then(() => {
              this.roleVisible = false
              this.b_loading = false
              this.getList()
              this.$notify.success(this.$t('message.add_success'))
            })
            .catch(() => {
              this.b_loading = false
            })
        }
      })
    },
    update() {
      if (this.form.type === 1) {
        this.form.scope = this.$refs.scopeTree.getCheckedKeys().join(',')
      }
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          this.b_loading = true
          postObj(this.form)
            .then(() => {
              this.b_loading = false
              this.roleVisible = false
              this.getList()
              this.$notify.success(this.$t('message.edit_success'))
            })
            .catch(() => {
              this.b_loading = false
            })
        }
      })
    },
    updatePermission(roleId) {
      const selecteds = this.$refs.multipleTable.selection
      this.menuIds = []
      selecteds.forEach(select => {
        this.menuIds.push(select.id)
      })

      permissionUpd(roleId, this.menuIds).then(() => {
        this.dialogPermissionVisible = false
        this.$store.dispatch('GetMenu', { type: false })
        this.$notify.success(this.$t('message.edit_success'))
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__wrapper {
  .el-dialog {
    width: 61% !important;
    .dialog-main-tree {
      max-height: 400px;
      overflow-y: auto;
    }
  }
  .el-form-item__label {
    width: 20% !important;
    padding-right: 20px;
  }
  .el-form-item__content {
    margin-left: 20% !important;
  }
}
.add-item {
  margin: 0.5rem 0 1rem 0;
}
</style>
