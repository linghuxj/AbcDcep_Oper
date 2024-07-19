<template>
  <div class="execution">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :table-loading="tableLoading"
        :option="tableOption"
        :before-open="beforeOpen"
        :permission="permissionList"
        @on-load="getList"
        @refresh-change="refreshChange"
        @size-change="sizeChange"
        @current-change="currentChange"
        @row-update="handleUpdate"
        @row-save="handleSave"
        @row-del="handleDelete"/>
    </basic-container>
  </div>
</template>

<script>
  import {addObj, delObj, fetchList, putObj} from '@/api/system/client'
  import {mapGetters} from 'vuex'

  export default {
    name: 'Client',
    data() {
      return {
        tableData: [],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
        },
        tableLoading: false,
      }
    },
    computed: {
      ...mapGetters(['permissions']),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permissions.sys_client_add, false),
          delBtn: this.vaildData(this.permissions.sys_client_del, false),
          editBtn: this.vaildData(this.permissions.sys_client_edit, false)
        }
      }
    },
    methods: {
      getList(page, params) {
        this.tableLoading = true
        fetchList(Object.assign({
          current: page.currentPage,
          size: page.pageSize
        }, params)).then(response => {
          this.tableData = response.data.data.records
          this.page.total = response.data.data.total
          this.tableLoading = false
        })
      },
      handleDelete: function (row, index) {
        var _this = this
        this.$confirm(this.$t('message.will_delete_data'), this.$t('message.prompt'), {
        confirmButtonText: this.$t('message.confirm'),
          cancelButtonText: this.$t('message.cancel'),
        type: "warning"
      })
        .then(function () {
          return delObj(row.clientId)
        }).then(() => {
          _this.$message.success($t('message.delete_success'))
          this.refreshChange()
        })
      },
      handleUpdate: function (row, index, done) {
        if (row.accessTokenValidity === undefined) {
          row.accessTokenValidity = 60 * 60 * 12
        }
        if (row.refreshTokenValidity === undefined) {
          row.refreshTokenValidity = 60 * 60 * 24 * 30
        }

        putObj(row).then(() => {
          this.$message.success(this.$t('message.edit_success'));
          this.refreshChange()
          done()
        })
      },
      handleSave: function (row, done) {
        if (row.accessTokenValidity === undefined) {
          row.accessTokenValidity = 60 * 60 * 12
        }
        if (row.refreshTokenValidity === undefined) {
          row.refreshTokenValidity = 60 * 60 * 24 * 30
        }
        addObj(row).then(() => {
          this.$message.success(this.$t('message.add_success'));
          this.refreshChange()
          done()
        })
      },
      sizeChange(pageSize) {
        this.page.pageSize = pageSize
      },
      currentChange(current) {
        this.page.currentPage = current
      },
      refreshChange() {
        this.getList(this.page)
      },
      beforeOpen(show, type) {
        window.boxType = type
        show()
      }
    }
  }
</script>
