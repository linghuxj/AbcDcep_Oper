<template>
  <div class="execution">
    <basic-container>
    </basic-container>
  </div>
</template>

<script>
  import {addObj, delObj, fetchList, putObj} from '@/api/system/social'
  import {mapGetters} from 'vuex'

  export default {
    name: 'SocialDetails',
    data() {
      return {
        searchForm: {},
        tableData: [],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
        },
        tableLoading: false,
      }
    },
    created() {
    },
    mounted: function () {
    },
    computed: {
      ...mapGetters(['permissions']),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permissions.sys_social_details_add, false),
          delBtn: this.vaildData(this.permissions.sys_social_details_del, false),
          editBtn: this.vaildData(this.permissions.sys_social_details_edit, false)
        }
      }
    },
    methods: {
      getList(page, params) {
        this.tableLoading = true
        fetchList(Object.assign({
          current: page.currentPage,
          size: page.pageSize
        }, params, this.searchForm)).then(response => {
          this.tableData = response.data.data.records
          this.page.total = response.data.data.total
          this.tableLoading = false
        })
      },
      rowDel: function (row, index) {
        var _this = this
        this.$confirm('是否确认删除ID为' + row.id, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delObj(row.id)
        }).then(() => {
          _this.$message.success($t('message.delete_success'))
          this.refreshChange()
        }).catch(function () {
        })
      },
      handleUpdate: function (row, index, done) {
        putObj(row).then(() => {
          this.$message.success(this.$t('message.edit_success'))
          this.refreshChange()
          done()
        })
      },
      handleSave: function (row, done) {
        addObj(row).then(() => {
          this.tableData.push(Object.assign({}, row))
          this.$message.success(this.$t('message.add_success'))
          this.refreshChange()
          done()
        })
      },
      refreshChange() {
        this.getList(this.page)
      },
      searchChange(form, done) {
        this.searchForm = form
        this.getList(this.page, form)
        done()
      },
      sizeChange(pageSize) {
        this.page.pageSize = pageSize
      },
      currentChange(current) {
        this.page.currentPage = current
      },
      beforeOpen(show, type) {
        window.boxType = type
        show()
      }
    }
  }
</script>

