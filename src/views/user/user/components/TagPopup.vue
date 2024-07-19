<template>
  <div class="tag-container">
    <div class="tag-container-title">
      {{ $t("feed.tag.name") }}：
      <el-input v-model="tag.tagName" class="tag-container-input" placeholder="请输入标签名称" />

      <el-button
        class="tag-container-button"
        type="primary"
        @click="getTagLabelByName"
      >{{ $t("feed.gift.search") }}</el-button
      >
    </div>
    <el-table
      v-loading="listLoading"
      :data="tagList"
      :header-cell-style="{background:'#f1f1f1',color:'#555555'}"
      class="tag-el-table"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column :label="$t('feed.tag.name')">
        <template slot-scope="{ row }">
          <span>{{ row.tagName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('feed.tag.explain')">
        <template slot-scope="{ row }">
          <span>
            {{ row.tagDesc }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page="pagination.current"
      :page-sizes="pagination.pageSize"
      :page-size="pagination.page"
      layout="prev, pager, next"
      :total="pagination.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <div class="dialog-footer">
      <el-button @click="resetTagPopup">取 消</el-button>
      <el-button
        type="primary"
        @click="submitTagPopup"
      >确 定</el-button
      >
    </div>
  </div>
</template>
<script>
import { getTagPage } from '@/api/tag/tag'
// 添加基本用户接口
import {
  addSubscriberTag
} from '@/api/customer/subscriber'

export default {
  props: { 
    // userIdList: {
    //   type: Array,
    //   default: []
    // },
    closeTag: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      tagList: [],
      // 搜索条件
      tag: {
        tagName: undefined
      },
      listLoading: false,
      //分页
      pagination: {
        //页码
        current: 1,
        //页容量
        size: 10,
        //页面数组
        pageSize: [5, 10, 15, 20],
        //总条数
        total: 0,
        pages: 0
      },
      tagValue: {
        userIdList: this.userIdList,
        tagIdList: []
      }
    }
  },
  mounted() {
    this.getTagLabel()
  },
  methods: {
    //页容量改变
    handleSizeChange(val) {
      this.pagination.size = val
      this.getTagLabel()
    },
    //页码改变
    handleCurrentChange(val) {
      this.pagination.current = val
      this.getTagLabel()
    },
    // 查询标签
    getTagLabel() {
      const query = Object.assign({}, this.tag)
      // console.log(query)
      query.size = this.pagination.size
      query.current = this.pagination.current
      this.listLoading = true
      getTagPage(query).then((response) => {
        // console.log('response', response.data.data)
        this.listLoading = false
        const result = response.data.data
        this.tagList = result.records
        this.pagination.total = result.total
        this.pagination.pages = result.pages
      })
        .catch(() => {
          this.listLoading = false
        })
    },
    // 根据标签名称搜索标签
    getTagLabelByName() {
      this.pagination.current = 1
      this.getTagLabel()
    },
    // 复选框点击事件
    handleSelectionChange(val) {
      console.log(val)
      if (val) {
        this.tagValue.tagIdList = []
        for (var i in val) {
          this.tagValue.tagIdList[i] = (val[i].tagId)
        }
      }
    },
    // 取消事件
    resetTagPopup() {
      console.log('取消')
      if (this.closeTag) {
        this.closeTag()
      }
    },
    submitTagPopup() {
      console.log('确定')
      if (this.tagValue.tagIdList) {
        addSubscriberTag(this.tagValue).then((response) => {
          if (this.closeTag) {
            this.closeTag()
          }
        })
      } else {
        this.$message({
          message: '请先选择需要贴标签的名称~',
          type: 'warning'
        })
      }
      // if (this.closeTag) {
      // this.closeTag()
      // }
    }
  }
}
</script>
<style lang="scss" scoped>
.tag-container-title {
  display: flex;
}
.tag-container-input {
  width: 130px;
}
.tag-el-table {
  margin: 20px 0px;
}
.tag-container-button {
  margin-left: 20px;
}
.dialog-footer {
  text-align: end;
  margin: 20px 0px;
}
</style>

