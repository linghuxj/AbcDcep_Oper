<template>
  <div class="main-content">
    <!-- 商圈详情顶部 -->
    <div class="commerce-message">
      <!-- 右上角状态标签 -->
      <div
        v-if="businessDetail.status"
        :class="businessDetail.status == 'normal' ? 'status' : 'status red'"
      >
        {{ businessDetail.statusName }}
      </div>
      <div class="left">
        <el-image
          style="width: 100px; height: 100px"
          :src="businessDetail.districtLogo"
          fit="fit"
        ></el-image>
      </div>
      <div class="center">
        <div class="center-title">
          <div>{{ businessDetail.districtName }}</div>
          <div>推荐指数：{{ businessDetail.recommendRate }}</div>
          <div>嗨友派对动态数：0家</div>
        </div>
        <div class="center-history-Intro">
          {{ businessDetail.districtDesc }}
        </div>
      </div>
    </div>
    <div class="commerce-div"></div>
    <div class="commerce-store">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          :label="'关联店铺(' + relationStoreNum + ')'"
          name="activeName_store"
        >
          <div class="commerce-search">
            <!-- <div><el-button type="primary">导出</el-button></div> -->
            <div>
              <el-input
                v-model="paramter.store_keyword"
                placeholder="请输入搜索内容关键字"
                style="width: 200px"
              ></el-input>
              <el-button
                type="primary"
                icon="el-icon-search"
                style="margin-left: 10px"
                @click="search"
                >搜索</el-button
              >
              <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
            </div>
          </div>
          <el-table
            :data="relationList"
            border
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          >
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="店铺主图">
              <template slot-scope="{ row }">
                <el-image
                  :src="row.mainImage"
                  style="width: 100px; height: 100px"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column
              label="店铺名称"
              prop="storeName"
            ></el-table-column>
            <el-table-column label="营业时间">
              <template slot-scope="{ row }">
                <span class="jump-num"
                  >{{ row.startTime }}-{{ row.endTime }}</span
                >
              </template>
            </el-table-column>
            <el-table-column label="店铺地址" prop="address"></el-table-column>
            <!-- <el-table-column label="店铺排序">
              <template slot-scope="scope">
                <div>
                  <i v-if="scope.$index!=0" class="el-icon-upload2"></i>
                  <i v-if="pagination.current*scope.$index+1!=pagination.total" class="el-icon-download"></i>
                </div>
              </template>
            </el-table-column> -->
            <!-- <el-table-column label="店铺置顶">
              <template slot-scope="scope">
                <div>
                  <i v-if="scope.$index!=0" class="el-icon-top"></i>
                  <i v-if="pagination.current*scope.$index+1!=pagination.total" class="el-icon-bottom"></i>
                </div>
              </template>
            </el-table-column> -->
            <el-table-column
              label="累计收款次数(次)"
              prop="receiptNum"
            ></el-table-column>
            <el-table-column
              label="累计收款金额(元)"
              prop="receiptAmount"
            ></el-table-column>
            <el-table-column
              label="关联时间"
              prop="createTime"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row }">
                <el-button
                  v-if="permissions.business_district_store_edit"
                  type="text"
                  @click="cancleRelation(row.id)"
                  >取消关联</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          :label="'关联的圈子(' + relationCircleNum + ')'"
          name="activeName_circle"
        >
          <div class="commerce-search">
            <!-- <div><el-button type="primary">导出</el-button></div> -->
            <div>
              <el-input
                v-model="paramter.circle_keyword"
                placeholder="请输入搜索内容关键字"
                style="width: 200px"
              ></el-input>
              <el-button
                type="primary"
                icon="el-icon-search"
                style="margin-left: 10px"
                @click="search"
                >搜索</el-button
              >
              <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
            </div>
          </div>
          <el-table
            border
            :data="relationCircleList"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          >
            <el-table-column label="圈子主图">
              <template slot-scope="{ row }">
                <el-image
                  :src="row.circleLogo"
                  style="width: 100px; height: 100px"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column
              label="圈子名称"
              prop="circleName"
            ></el-table-column>
            <el-table-column
              label="圈子类型"
              prop="circleTypeName"
            ></el-table-column>
            <el-table-column
              label="圈子成员数(人)"
              prop="circleUserCount"
            ></el-table-column>
            <el-table-column
              label="圈子动态数(条)"
              prop="circleNoteCount"
            ></el-table-column>
            <el-table-column label="圈内展示">
              <template slot-scope="{ row }">
                <el-switch
                  v-model="row.status"
                  :active-value="1"
                  :inactive-value="0"
                  @change="changeStatus(row)"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column
              label="关联时间"
              prop="createTime"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row }">
                <el-button
                  v-if="permissions.business_district_store_edit"
                  type="text"
                  @click="cancleCircleRelation(row.id)"
                  >取消关联</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 分页 -->
        <table-pagination
          :total="pagination.total"
          :page.sync="pagination.current"
          :limit.sync="pagination.size"
          @pagination="getList"
        />
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TablePagination from '@/components/table-pagination'
import {
  detailBusiness,
  getRelationBusiness,
  cancleRelationStore,
  getRelationCircle,
  getCountRelationCircle,
  getCountRelationStore,
  deleteRelationCircle,
  circleShow
} from '@/api/commerce/commerce.js'
export default {
  components: { TablePagination },
  data() {
    return {
      activeName: 'activeName_store',
      url: '',
      districtId: null,
      businessDetail: {},
      relationList: [],
      relationCircleList: [],
      relationCircleNum: null,
      relationStoreNum: null,
      paramter: {
        store_keyword: undefined,
        circle_keyword: undefined
      },
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    if (this.$route.query.districtId) {
      this.districtId = this.$route.query.districtId
      this.getDetailBusiness()
      this.getRelationBusinessList()
      this.getRelationCircleList()
      this.getCountRelationCircle_num()
      this.getCountRelationStore_num()
    }
  },
  methods: {
    getList() {
      if (this.activeName === 'activeName_store') {
        this.getRelationBusinessList()
      } else if (this.activeName === 'activeName_circle') {
        this.getRelationCircleList()
      }
    },
    // 获取商圈详情
    getDetailBusiness() {
      detailBusiness(this.districtId).then(res => {
        this.businessDetail = res.data.data
      })
    },
    // 查询关联店铺列表
    getRelationBusinessList() {
      const data = {
        districtId: this.districtId,
        size: this.pagination.size,
        current: this.pagination.current,
        keyword: this.paramter.store_keyword
      }
      getRelationBusiness(data).then(res => {
        this.relationList = res.data.data.records
        this.pagination.size = res.data.data.size
        this.pagination.current = res.data.data.current
        this.pagination.total = res.data.data.total
      })
    },
    // 取消关联店铺
    cancleRelation(relationBusinessDistrictStoreIds) {
      cancleRelationStore(relationBusinessDistrictStoreIds).then(res => {
        if (res) {
          this.$message.success('取消关联成功')
          this.getList()
        }
      })
    },
    // 取消关联圈子
    cancleCircleRelation(id) {
      const data = {
        relationBusinessDistrictCircleIds: id
      }
      deleteRelationCircle(data).then(res => {
        this.$message.success('取消关联成功')
        this.getCountRelationCircle_num(this.districtId)
        this.getRelationCircleList(this.districtId)
      })
    },
    // 查询关联圈子列表
    getRelationCircleList() {
      const data = {
        districtId: this.districtId,
        size: this.pagination.size,
        current: this.pagination.current,
        keyword: this.paramter.store_keyword
      }
      getRelationCircle(data).then(res => {
        this.relationCircleList = res.data.data.records
        this.pagination.size = res.data.data.size
        this.pagination.current = res.data.data.current
        this.pagination.total = res.data.data.total
      })
    },
    // 查询圈子关联数量
    getCountRelationCircle_num() {
      getCountRelationCircle(this.districtId).then(res => {
        this.relationCircleNum = res.data.data.relationNum
      })
    },
    // 查询相关店铺关联数量
    getCountRelationStore_num() {
      getCountRelationStore(this.districtId).then(res => {
        this.relationStoreNum = res.data.data.relationNum
      })
    },
    search() {
      this.getList()
    },
    reset() {
      this.paramter = {
        store_keyword: undefined,
        circle_keyword: undefined
      }
      this.pagination = {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      }
      this.getList()
    },
    // tab切换
    handleClick() {
      this.pagination = {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      }
      if (this.activeName === 'activeName_circle') {
        this.getRelationCircleList()
      } else {
        this.getRelationBusinessList()
      }
    },
    // 是否展示
    changeStatus(row) {
      circleShow(row.id)
    }
  }
}
</script>
<style lang="scss" scoped>
.main-content {
  position: relative;
}
.commerce-message {
  .status {
    position: absolute;
    top: 20px;
    right: 30px;
    width: 60px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: #409eff;
    color: #fff;
    font-size: 13px;
    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: -10px;
      width: 0;
      height: 0;
      border-top: 15px solid transparent;
      border-right: 0px solid transparent;
      border-bottom: 15px solid transparent;
      border-left: 10px solid #409eff;
    }
  }
  .status.red {
    background-color: red;
    &::after {
      border-left: 10px solid red;
    }
  }
  font-size: 14px;
  color: #333333;
  display: flex;
  justify-content: space-between;
  .center {
    width: 80%;
    display: flex;
    flex-direction: column;
    .center-title {
      display: flex;
      margin-bottom: 20px;
      div {
        margin-right: 100px;
      }
    }
  }
}

.commerce-search {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
  div {
    display: flex;
    flex-direction: row;
  }
}
</style>
