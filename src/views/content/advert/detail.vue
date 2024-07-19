<template>
  <div class="main-content" style="position:relation">
    <div class="main-top">
      <div>{{ advertPostionMes.positionName }}</div>
      <div style="position:absolute;top:0px;right:0px">
        <wel-tag :type="parameter.type">
          {{ funStatus(advertPostionMes.status) }}
        </wel-tag>
      </div>
    </div>
    <div>
      <el-tabs v-model="parameter.status" @tab-click="handleClick()">
        <el-tab-pane :label="'已上架'+'('+normalCount+')'" name="normal"></el-tab-pane>
        <el-tab-pane :label="'已下架'+'('+disabledCount+')'" name="disabled"></el-tab-pane>
      </el-tabs>
      <el-form :inline="true" :model="paramter" class="el-form-filter">
        <el-form-item label="选择城市：" prop="areaCodeList">
          <el-select
            v-model="parameter.areaCodeList"
            multiple
            filterable
            remote
            :multiple-limit="multiple_limit"
            reserve-keyword
            :remote-method="remoteArea"
            placeholder="请输入或选择城市名称"
            style="width:450px">
            <el-option
              v-for="(item,index) in areaList"
              :key="index"
              :label="item.name"
              :value="item.areaId">
            </el-option>
          </el-select>
        </el-form-item>
        <div style="margin-left:10px">
          <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
        </div>
      </el-form>
      
      <el-table
        v-loading="interactive.tableLoading"
        :empty-text="$t('message.table_empty_text')"
        :data="tableData"
        border
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        style="width: 100%"
      >
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="所属城市">
          <template slot-scope="scope">
            <div>
              <span v-for="(item,index) in scope.row.areaNameList" :key="index" style="margin-right:10px">{{ item }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="广告图片">
          <template slot-scope="scope">
            <div class="content-wrap">
              <el-image
                :src="scope.row.adImage"
                fit="cover"
                :preview-src-list="[scope.row.adImage]"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="adLink" label="链接">
          <template slot-scope="scope">
            <span>{{ scope.row.adLink?scope.row.adLink:'--' }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="parameter.status==='normal'" key="adSort" prop="adSort" label="排序"></el-table-column>
        <el-table-column label="起止时间" width="300">
          <template slot-scope="scope">
            <span>{{ scope.row.startTime }} 至 {{ scope.row.endTime }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="parameter.status==='normal'" label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status==='normal' && permissions.advert_disabled" type="text" size="mini" @click="to_down(scope.row)">下架</el-button>
            <el-button v-if="permissions.advert_edit" type="text" size="mini" @click="to_edit(scope.row.adId)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <table-pagination
        :total="pagination.total"
        :page.sync="pagination.current"
        :limit.sync="pagination.size"
        @pagination="getSearch" />
    </div>
  </div>
</template>
<script>
import WelTag from '@/template/Wel-Tag/index.vue'
import TablePagination from '@/components/table-pagination'
import { getAdvertPage, disabledAdvert, getAdvertCount } from '@/api/content/advert'
import { getAreaList } from '@/api/content/advert'
import { mapGetters } from 'vuex'
export default {
  components: { WelTag, TablePagination },
  data() {
    return {
      interactive: {
        tableLoading: false
      },
      parameter: {
        status: 'normal',
        postionId: undefined,
        type: undefined,
        areaCodes: []
      },
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20
      },
      tableData: [
        { name: '创客Plus首页banner' }
      ],
      advertPostionMes: {
        status: undefined,
        positionName: undefined
      },
      paramter: {
        areaCodeList: []
      },
      normalCount: 0,
      disabledCount: 0,
      multiple_limit: 5,
      areaList: []
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    console.debug('this.$route.query', this.$route.query)
    if (this.$route.query) {
      this.parameter.postionId = this.$route.query.positionId
      this.advertPostionMes = {
        status: this.$route.query.status,
        positionName: this.$route.query.positionName,
        position:this.$route.query.position
      }
      this.$nextTick(() => {
        this.getAdvertPage()
        this.getAdvertNormalCount()
        this.getAdvertDisabledCount()
        this.getAreaList()
      })
    }
  },
  methods: {
    getSearch() {
      this.getAdvertPage()
    },
    //查询地区列表
    getAreaList() {
      const data = {
        areaTypes: 'city',
        size: '50',
        keyword: this.keyword
      }
      getAreaList(data).then(res => {
        this.areaList = res.data.data
      })
    }, 
    //搜索 
    search() {
      this.getAdvertPage()
    },
    // 重置
    reset() {
      this.parameter.areaCodeList = []
      this.getAdvertPage()
    },
    //远程搜索城市
    remoteArea(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.keyword = query
          this.areaList = []
          this.getAreaList()
        }, 200)
      } else {
        this.areaList = []
        this.keyword = undefined
        this.getAreaList()
      }
    },
    // 分页查询广告列表
    getAdvertPage() {
      console.debug('this.paramter.areaCodeList', this.parameter.areaCodeList)
      const data = {
        current: this.pagination.current,
        size: this.pagination.size,
        status: this.parameter.status, //（上线：online、下线：offline）
        adPosition: this.advertPostionMes.position,
        areaCodes: this.parameter.areaCodeList
      }
      console.debug('data', data)
      getAdvertPage(data).then(res => {
        this.tableData = res.data.data.records
        this.pagination.total = res.data.data.total
        this.pagination.current = res.data.data.current
        this.pagination.size = res.data.data.size
      })
    },
    // 查询广告上架数量
    getAdvertNormalCount() {
      const data = {
        status: 'normal',
        position: this.advertPostionMes.position
      }
      getAdvertCount(data).then(res => {
        this.normalCount = res.data.data
      })
    },
    // 查询广告下架数量
    getAdvertDisabledCount() {
      const data = {
        status: 'disabled',
        position: this.advertPostionMes.position
      }
      getAdvertCount(data).then(res => {
        this.disabledCount = res.data.data
      })
    },
    // 去下架
    to_down(val) {
      this.$confirm('下架后，“' + val.adName + '”广告将不在前端展示，是否要下架？', '下架提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        disabledAdvert(val.adId).then(() => {
          this.$message({
            type: 'success',
            message: '确定下架成功!'
          })
          this.getAdvertPage()
          this.getAdvertNormalCount()
          this.getAdvertDisabledCount()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消下架'
        })          
      })
    },
    // 去编辑
    to_edit(adId) {
      this.$router.push(`/content/advert/compile?adId=${adId}`)
    },
    // tab标签切换
    handleClick() {
      this.getAdvertPage()
    },
    // 状态判断
    funStatus(val) {
      if (!val) {
        this.parameter.type = ''
        return ''
      }
        
      if (val === 'disabled') {
        this.parameter.type = 'danger'
        return '已下架'
      }
      
      if (val === 'normal') {
        this.parameter.type = 'primary'
        return '正常'
      }
      
      this.parameter.type = ''
      return '已下架'
    }
  }
}
</script>
<style scoped>
.main-top {
  position: relative;
  height: 100px;
  line-height: 100px;
}
.content-wrap {
  display: flex;
  height: 100px;
  line-height: 100px;
  flex-direction: column;
  justify-content: center;
}
.el-form-filter {
  display: flex;
  width: 100%;
}
</style>
