<template>
  <div class="execution">
    <basic-container>
    </basic-container>
  </div>
</template>

<script>
import { delObj, fetchList } from '@/api/system/file'
import { mapGetters } from 'vuex'
import { handleDown } from '@/util/util'


export default {
  name: 'SystemFile',
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
  mounted: function() {
  },
  computed: {
    ...mapGetters(['permissions']),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.sys_file_add, true),
        delBtn: this.vaildData(this.permissions.sys_file_del, true),
        editBtn: this.vaildData(this.permissions.sys_file_edit, false)
      }
    }
  },
  methods: {
    getList(page, params) {
      this.tableLoading = true
      fetchList(Object.assign({
        descs: 'create_time',
        current: page.currentPage,
        size: page.pageSize
      }, params, this.searchForm)).then(response => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    rowDel: function(row, index) {
      var _this = this
      this.$confirm('是否确认删除ID为' + row.id, '提示', {
        confirmButtonText: $t('message.confirm'),
        cancelButtonText: $t('message.cancel'),
        type: 'warning'
      }).then(function() {
        return delObj(row.id)
      }).then(data => {
        _this.$message.success($t('message.delete_success'))
        this.getList(this.page)
      })
    },
    searchChange(form, done) {
      this.getList(this.page, form)
      done()
    },
    refreshChange() {
      this.searchForm = this.form
      this.getList(this.page)
    },
    sizeChange(pageSize){
      this.page.pageSize = pageSize
    },
    currentChange(current){
      this.page.currentPage = current
    },
    download: function(row, index) {
      handleDown(row.fileName, row.bucketName)
    },
    uploadAfter(res, done, loading) {
        this.$message.success('上传成功')
        done()
        this.getList(this.page)
    },
  }
}
</script>

