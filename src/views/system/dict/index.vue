<template>
  <div class="main-content execution">
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchForm"
      id="demo-form-inline"
    >
      <el-form-item label="类型：">
        <el-input
          v-model="searchForm.dictType"
          placeholder="请输入字典类型"
        ></el-input>
      </el-form-item>
      <el-form-item label="描述：">
        <el-input
          v-model="searchForm.description"
          placeholder="请输入描述"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getSearch"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div id="tableBtn">
      <el-button
        v-if="permissions.dict_add"
        icon="el-icon-plus"
        class="add-item"
        type="primary"
        @click="openAdd"
      >
        {{ $t('message.add') }}
      </el-button>
    </div>
    <el-table
      :empty-text="$t('message.table_empty_text')"
      :data="tableData"
      border
      v-loading="tableLoading"
      :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
      :height="tableHeight"
    >
      <el-table-column
        type="index"
        :index="1"
        width="120"
        :label="$t('message.serial_number')"
      >
      </el-table-column>
      <el-table-column prop="dictType" :label="$t('system.dict.dict_type')">
      </el-table-column>
      <el-table-column
        prop="description"
        :label="$t('system.dict.description')"
      >
      </el-table-column>
      <el-table-column prop="remarks" :label="$t('system.dict.remarks')">
      </el-table-column>
      <el-table-column :label="$t('message.operate')" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
            v-if="permissions.dict_edit"
            type="text"
            @click="openEdit(scope.row)"
          >
            {{ $t('message.edit') }}
          </el-button>
          <el-button
            v-if="permissions.dict_del"
            type="text"
            @click="rowDel(scope.row)"
          >
            {{ $t('message.delete') }}
          </el-button>
          <el-button
            v-if="permissions.dict_item_add"
            type="text"
            size="mini"
            icon="el-icon-menu"
            @click="handleItem(scope.row)"
            >{{ $t('system.dict.item') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <table-pagination
      :total="page.total"
      :page.sync="page.current"
      :limit.sync="page.size"
      @pagination="getList"
    />
    <el-dialog
      :visible.sync="dialogFormVisible"
      :table-loading="tableLoading"
      :title="$t('system.dict.item_management')"
      width="90%"
      @close="dialogFormVisible = false"
    >
      <el-button
        v-if="permissions.dict_add"
        class="dialog-add-item"
        icon="el-icon-plus"
        type="primary"
        @click="openItemAdd"
      >
        {{ $t('message.add') }}
      </el-button>
      <el-table
        :empty-text="$t('message.table_empty_text')"
        :data="tableDictItemData"
        v-loading="tableLoading"
        border
      >
        <el-table-column
          type="index"
          :index="1"
          width="120"
          :label="$t('message.serial_number')"
        >
        </el-table-column>
        <el-table-column prop="itemValue" :label="$t('system.dict.item_value')">
        </el-table-column>
        <el-table-column prop="itemLabel" :label="$t('system.dict.item_label')">
        </el-table-column>
        <el-table-column
          prop="description"
          :label="$t('system.dict.item_description')"
        >
        </el-table-column>
        <el-table-column :label="$t('message.operate')" fixed="right">
          <template slot-scope="scope">
            <el-button @click="handleView(scope.row)" type="text">
              {{ $t('message.view') }}
            </el-button>
            <el-button
              v-if="permissions.dict_item_edit"
              type="text"
              @click="openItemEdit(scope.row)"
            >
              <i class="el-icon-edit"></i>
              {{ $t('message.edit') }}
            </el-button>
            <el-button
              v-if="permissions.dict_item_del"
              type="text"
              @click="rowItemDel(scope.row)"
            >
              <i class="el-icon-delete"></i>
              {{ $t('message.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      :visible="itemViewVisible"
      :title="$t('message.view')"
      @close="handleViewItemCancel"
    >
      <div style="margin-top: -2rem">
        <div style="color: #4d0000">
          {{ $t('system.dict.tips') }}
        </div>
        <span>{{ $t('system.dict.trans') }}：</span>
        <el-radio
          @change="translate"
          v-model="language"
          v-for="dict in languageDicts"
          :key="dict.id"
          :label="dict.itemValue"
          >{{ dict.itemLabel }}</el-radio
        >
      </div>
      <el-form v-model="itemForm">
        <el-form-item :label="$t('system.dict.dict_type')" prop="dictType">
          <el-input :disabled="true" v-model="itemForm.dictType"></el-input>
        </el-form-item>
        <el-form-item :label="$t('system.dict.item_value')" prop="itemValue">
          <el-input :disabled="true" v-model="itemForm.itemValue"></el-input>
        </el-form-item>
        <el-form-item :label="$t('system.dict.item_label')" prop="itemLabel">
          <el-input :disabled="true" v-model="itemForm.itemLabel"></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('system.dict.item_description')"
          prop="description"
        >
          <el-input :disabled="true" v-model="itemForm.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :disabled="b_loading"
            @click="handleTranslate"
            v-if="permissions.dict_trans"
          >
            {{ $t('message.trans') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      :visible="dictVisible"
      @close="handleCancel"
      :title="isEdit ? $t('message.edit') : $t('message.add')"
    >
      <el-form
        :rules="dictRules"
        ref="dictForm"
        :model="form"
        label-position="left"
        label-width="100px"
      >
        <el-form-item prop="dictType" :label="$t('system.dict.dict_type')">
          <el-input v-model="form.dictType" />
        </el-form-item>
        <el-form-item prop="description" :label="$t('system.dict.description')">
          <el-input v-model="form.description" />
        </el-form-item>
        <el-form-item prop="remarks" :label="$t('system.dict.remarks')">
          <el-input v-model="form.remarks" />
        </el-form-item>
        <el-form-item>
          <template>
            <el-button v-if="!isEdit" @click="handleSave">{{
              $t('message.confirm')
            }}</el-button>
            <el-button v-if="isEdit" @click="handleUpdate">{{
              $t('message.confirm')
            }}</el-button>
            <el-button @click="handleCancel">{{
              $t('message.cancel')
            }}</el-button>
          </template>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      :visible="dictItemVisible"
      :title="isItemEdit ? $t('message.edit') : $t('message.add')"
      @close="handleItemCancel"
    >
      <el-form
        :rules="itemRules"
        ref="itemForm"
        :model="itemForm"
        label-position="left"
        label-width="120px"
      >
        <el-form-item prop="dictType" :label="$t('system.dict.dict_type')">
          <el-input disabled v-model="itemForm.dictType" />
        </el-form-item>
        <el-form-item prop="itemValue" :label="$t('system.dict.item_value')">
          <el-input v-model="itemForm.itemValue" />
        </el-form-item>
        <el-form-item prop="itemLabel" :label="$t('system.dict.item_label')">
          <el-input v-model="itemForm.itemLabel" />
        </el-form-item>
        <el-form-item
          prop="description"
          :label="$t('system.dict.item_description')"
        >
          <el-input v-model="itemForm.description" />
        </el-form-item>
        <el-form-item>
          <template>
            <el-button v-if="!isItemEdit" @click="handleItemSave">{{
              $t('message.confirm')
            }}</el-button>
            <el-button v-if="isItemEdit" @click="handleItemUpdate">{{
              $t('message.confirm')
            }}</el-button>
            <el-button @click="handleItemCancel">{{
              $t('message.cancel')
            }}</el-button>
          </template>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  addItemObj,
  addObj,
  delItemObj,
  delObj,
  fetchItemList,
  fetchList,
  updateItemObj,
  updateObj,
  trans,
  remote,
  hasDictItemType,
  hasDictType
} from '@/api/system/dict'
import TablePagination from '@/components/table-pagination'
import { mapGetters } from 'vuex'

export default {
  name: 'Dict',
  components: { TablePagination },
  data() {
    const validDcitType = (rule, value, callback) => {
      if (value) {
        if (this.isEdit && this.tempForm.dictType === value) {
          return callback()
        }
        hasDictType(value).then(response => {
          if (response.data.data) {
            callback(
              new Error(this.$t(this.$t('system.dict.valid_has_dict_type')))
            )
          } else {
            callback()
          }
        })
      } else {
        callback()
      }
    }
    const validDictItemType = (rule, value, callback) => {
      if (value) {
        if (this.isItemEdit && this.tempItemForm.itemValue === value) {
          return callback()
        }
        hasDictItemType(this.dictType, value).then(response => {
          if (response.data.data) {
            callback(new Error(this.$t('system.dict.valid_has_dict_item_type')))
          } else {
            callback()
          }
        })
      } else {
        callback()
      }
    }
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      searchForm: {
        dictType: undefined,
        description: undefined
      },
      form: {
        dictType: undefined,
        description: undefined,
        remarks: ''
      },
      itemForm: {
        dictType: undefined,
        itemValue: undefined,
        itemLabel: undefined,
        description: undefined
      },
      tempForm: {},
      tempItemForm: {},
      dictItemVisible: false,
      dictType: undefined,
      dictId: undefined,
      dialogFormVisible: false,
      itemViewVisible: false,
      isItemEdit: false,
      isEdit: false,
      languageDicts: [],
      b_loading: false,
      language: window.localStorage.getItem('mewooo-language') || 'en',
      tableData: [],
      tableDictItemData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      dictPage: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      dictVisible: false,
      tableLoading: false,
      dictRules: {
        dictType: [
          {
            required: true,
            message: this.$t('system.dict.valid_dict_type'),
            trigger: 'blur'
          },
          { validator: validDcitType, trigger: 'blur' }
        ]
      },
      itemRules: {
        dictType: [
          {
            required: true,
            message: this.$t('system.dict.valid_dict_type'),
            trigger: 'blur'
          }
        ],
        itemLabel: [
          {
            required: true,
            message: this.$t('system.dict.valid_item_label'),
            trigger: 'blur'
          }
        ],
        itemValue: [
          {
            required: true,
            message: this.$t('system.dict.valid_item_value'),
            trigger: 'blur'
          },
          { validator: validDictItemType, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList(this.page)
  },
  mounted() {
    this.$nextTick(() => {
      this.countHeight()
      this.watchWidth()
    })
  },
  computed: {
    ...mapGetters(['permissions']),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.dict_add, false),
        delBtn: this.vaildData(this.permissions.dict_del, false),
        editBtn: this.vaildData(this.permissions.dict_edit, false)
      }
    }
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
    getSearch() {
      this.getList(this.page)
    },
    getList(page, params) {
      this.tableLoading = true
      fetchList(
        Object.assign(
          {
            current: page.page,
            size: page.limit
          },
          params,
          this.searchForm
        )
      ).then(response => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
        this.tableLoading = false
      })
    },
    // handlePagination(page) {
    //   this.page.currentPage = page
    //   this.getList(this.page)
    // },
    getDictItemList(dictId, type) {
      this.dictType = type
      this.dictId = dictId
      this.dialogFormVisible = true
      this.tableLoading = true
      fetchItemList(
        Object.assign(
          {
            current: this.dictPage.currentPage,
            size: this.dictPage.pageSize,
            dictType: this.dictType
          },
          { dictId: dictId }
        )
      ).then(response => {
        this.tableDictItemData = response.data.data.records
        this.tableLoading = false
      })
    },
    translate(language) {
      const param = {
        id: this.itemForm.itemId,
        language: language
      }
      trans(param).then(response => {
        this.itemForm = response.data.data
      })
    },
    handleView(row) {
      this.itemForm = row
      this.itemViewVisible = true
      if (this.languageDicts.length === 0) {
        remote('language').then(response => {
          this.languageDicts = response.data.data
        })
      }
    },
    handleViewItemCancel() {
      this.language = window.localStorage.getItem('mewooo-language') || 'en'
      this.itemViewVisible = false
      this.itemForm = {
        dictType: undefined,
        itemValue: undefined,
        itemLabel: undefined,
        description: undefined
      }
    },
    openAdd() {
      this.dictVisible = true
    },
    handleCancel() {
      this.dictVisible = false
      this.isEdit = false
      this.$refs.dictForm.resetFields()
      this.form = {
        dictType: undefined,
        description: undefined,
        remarks: ''
      }
    },
    openItemAdd() {
      this.dictItemVisible = true
      this.itemForm.dictType = this.dictType
      this.itemForm.dictId = this.dictId
    },
    openItemEdit(row) {
      this.dictItemVisible = true
      this.isItemEdit = true
      this.tempItemForm = Object.assign({}, row)
      this.itemForm = Object.assign({}, row)
    },
    openEdit(row) {
      this.dictVisible = true
      this.isEdit = true
      this.tempForm = Object.assign({}, row)
      this.form = Object.assign({}, row)
    },
    handleItemCancel() {
      this.dictItemVisible = false
      this.$refs.itemForm.resetFields()
      this.isItemEdit = false
      this.itemForm = {
        dictType: undefined,
        itemValue: undefined,
        itemLabel: undefined,
        description: undefined
      }
    },
    rowDel: function (row) {
      var _this = this
      this.$confirm(
        this.$t('message.will_delete_data'),
        this.$t('message.prompt'),
        {
          confirmButtonText: this.$t('message.confirm'),
          cancelButtonText: this.$t('message.cancel'),
          type: 'warning'
        }
      )
        .then(function () {
          return delObj(row)
        })
        .then(() => {
          this.getList(this.page)
          _this.$message.success(this.$t('message.delete_success'))
        })
        .catch(function () {})
    },
    handleUpdate: function () {
      this.$refs.dictForm.validate(valid => {
        if (valid) {
          updateObj(this.form).then(() => {
            this.dictVisible = false
            this.form = {
              dictType: undefined,
              description: undefined,
              remarks: ''
            }
            this.$message.success(this.$t('message.edit_success'))
            this.getList(this.page)
          })
        }
      })
    },
    handleSave: function () {
      this.$refs.dictForm.validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
            this.dictVisible = false
            this.form = {
              dictType: undefined,
              description: undefined,
              remarks: ''
            }
            this.$message.success(this.$t('message.add_success'))
            this.getList(this.page)
          })
        }
      })
    },
    handleItemSave: function () {
      this.$refs.itemForm.validate(valid => {
        if (valid) {
          addItemObj(this.itemForm).then(() => {
            this.dictItemVisible = false
            this.itemForm = {
              dictType: undefined,
              itemValue: undefined,
              itemLabel: undefined,
              description: undefined
            }
            this.$message.success(this.$t('message.add_success'))
            this.getDictItemList(this.dictId, this.dictType)
          })
        }
      })
    },
    handleItemUpdate: function () {
      this.$refs.itemForm.validate(valid => {
        if (valid) {
          updateItemObj(this.itemForm).then(() => {
            this.itemForm = {
              dictType: undefined,
              itemValue: undefined,
              itemLabel: undefined,
              description: undefined
            }
            this.$message.success(this.$t('message.edit_success'))
            this.getDictItemList(this.dictId, this.dictType)
          })
        }
      })
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize
    },
    currentChange(current) {
      this.page.currentPage = current
    },
    handleItem: function (row) {
      this.getDictItemList(row.dictId, row.dictType)
    },
    rowItemDel: function (row) {
      var _this = this
      this.$confirm(
        this.$t('message.will_delete_data'),
        this.$t('message.prompt'),
        {
          confirmButtonText: this.$t('message.confirm'),
          cancelButtonText: this.$t('message.cancel'),
          type: 'warning'
        }
      )
        .then(function () {
          return delItemObj(row.itemId)
        })
        .then(() => {
          this.getDictItemList(row.dictId, row.dictType)
          _this.$message.success(this.$t('message.delete_success'))
        })
        .catch(function () {})
    },
    // 重置
    reset() {
      this.searchForm = {
        dictType: undefined,
        description: undefined
      }
      this.getList({
        currentPage: 1,
        pageSize: 20
      })
    },
    // 翻译
    handleTranslate() {}
  }
}
</script>

<style lang="scss" scoped>
.add-item {
  margin: 0.5rem 0 1rem 0;
}
.dialog-add-item {
  margin: -2rem 0 1rem 0;
}
</style>
