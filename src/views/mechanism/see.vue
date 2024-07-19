<template>
  <div class="mechanism-see">
    <div class="main-top">
      <div>
        <!-- 右上角状态标签 -->
        <div
          v-if="unitDetail.status"
          :class="unitDetail.status == 'normal' ? 'status' : 'status red'"
        >
          {{ unitDetail.statusName }}
        </div>
        <!-- 右下角按钮组 -->
        <el-button
          v-if="showType == 'normal'"
          class="position"
          icon="el-icon-edit"
          @click="editBtn"
          >修改单位名称</el-button
        >
        <el-button v-else class="position" type="primary" @click="unitEdit"
          >保存</el-button
        >
        <!-- 左侧内容 -->
        <el-form
          v-if="showType == 'edit'"
          :model="unitDetail"
          :rules="rules"
          ref="unitDetail"
        >
          <el-form-item prop="newName" class="newName">
            <el-input v-model="unitDetail.newName"></el-input>
          </el-form-item>
        </el-form>
        <p v-else style="font-size: 30px">{{ unitDetail.unitName }}</p>
        <p class="singleLine">
          {{ unitDetail.locationName + unitDetail.address }}
        </p>
        <p>
          已关联：
          <el-button type="text" @click="getRelationUnit">
            {{
              unitDetail.districtNum && unitDetail.districtNum > 0
                ? unitDetail.districtNum
                : 0
            }}
          </el-button>
          个商圈
        </p>
        <p>
          网点权限：可查看
          <el-button type="text" @click="getlowerList">
            {{
              unitDetail.unitNum && unitDetail.unitNum > 0
                ? unitDetail.unitNum
                : 0
            }}
          </el-button>
          个网点
        </p>
      </div>
      <!-- 右侧内容 -->
      <div style="vertical-align: top">
        <p style="font-size: 20px">
          <!-- 暂无权限配置 暂时搁置 -->
          主账号：
          <el-button
            v-if="!unitDetail.primaryUser"
            type="text"
            style="font-size: 20px"
            @click="getDistributionUnit"
            >关联主账号</el-button
          >
          <span v-else>
            {{
              `${unitDetail.primaryUser.fullName}（${unitDetail.primaryUser.mobile}）`
            }}
          </span>
        </p>
      </div>
    </div>
    <div class="main-content main-bottom">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="银行人员" name="ordinary"> </el-tab-pane>
        <el-tab-pane label="创客人员" name="distributor"> </el-tab-pane>
        <el-button
          v-if="activeName == 'distributor'"
          type="primary"
          style="margin-bottom: 10px"
          @click="getDistributionUnit('关联创客')"
          >添加人员</el-button
        >
        <div
          v-if="activeName == 'distributor' && relationList.length < 1"
          class="noDistributor"
        >
          <p>暂无关联</p>
          <el-button type="text" @click="getDistributionUnit('关联创客')">
            前去新增人员
          </el-button>
        </div>
        <el-table
          v-else
          v-loading="loading"
          :data="relationList"
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          style="width: 100%"
          border
        >
          <el-table-column
            type="index"
            width="50"
            label="序号"
          ></el-table-column>
          <el-table-column prop="date" label="子账号信息" width="260">
            <template slot-scope="scope">
              <div class="user-wrap">
                <el-image
                  class="avatar"
                  :src="
                    scope.row.avatar ? scope.row.avatar : './img/avatar.png'
                  "
                />
                <div class="user-base">
                  <div class="oneline">
                    名称：{{
                      activeName == 'ordinary'
                        ? scope.row.username
                        : scope.row.fullName
                    }}
                  </div>
                  <div class="oneline">手机号：{{ scope.row.mobile }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="关联时间"></el-table-column>
          <el-table-column
            v-if="activeName == 'distributor'"
            prop="userRoleName"
            label="角色"
          ></el-table-column>
          <el-table-column
            v-else
            prop="jobTitle"
            label="岗位"
          ></el-table-column>
          <el-table-column label="状态" prop="statusName"></el-table-column>
          <el-table-column label="操作" width="240" fixed="right">
            <template slot-scope="scope">
              <el-button
                v-if="
                  (scope.row.status == 'normal' &&
                    activeName == 'ordinary' &&
                    permissions.unit_user_status) ||
                  (scope.row.status == 'normal' &&
                    activeName == 'distributor' &&
                    permissions.user_status_edit)
                "
                type="text"
                @click="userDisabled(scope.row.userId)"
                >立即冻结</el-button
              >
              <el-button
                v-if="
                  (scope.row.status == 'disabled' &&
                    activeName == 'ordinary' &&
                    permissions.unit_user_status) ||
                  (scope.row.status == 'disabled' &&
                    activeName == 'distributor' &&
                    permissions.user_status_edit)
                "
                type="text"
                @click="userNormal(scope.row.userId)"
                >取消冻结</el-button
              >
              <el-button
                v-if="activeName == 'ordinary'"
                type="text"
                @click="resetPassword(scope.row.userId)"
                >一键改为默认密码</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <table-pagination
          :total="pagination.total"
          :page.sync="pagination.current"
          :limit.sync="pagination.size"
          @pagination="getUnitDetail"
        />
      </el-tabs>
      <!-- 弹窗 -->
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
        <el-tabs v-model="dialogActive" @tab-click="dialogHandleClick">
          <template v-if="dialogTitle == '商圈'">
            <el-tab-pane label="已关联" name="relation"> </el-tab-pane>
            <el-tab-pane label="未关联" name="unrelation"> </el-tab-pane>
          </template>

          <el-table
            v-if="dialogVisible"
            ref="dialogTable"
            v-loading="tableLoading"
            :data="dialogList"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            style="width: 100%"
            border
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              v-if="dialogTitle !== '网点' && dialogTitle !== '关联账户'"
              type="selection"
              width="55"
            />
            <template
              v-if="dialogTitle == '关联账户' || dialogTitle == '关联创客'"
            >
              <el-table-column label="姓名" prop="user.fullName" />
              <el-table-column label="手机号码" prop="user.mobile" />
              <el-table-column label="所属单位" prop="user.company" />
              <el-table-column
                v-if="dialogTitle == '关联账户'"
                label="操作"
                width="75"
                fixed="right"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="unitPrimaryUser(scope.row.user.userId)"
                    >关联</el-button
                  >
                </template>
              </el-table-column>
            </template>
            <template v-else-if="dialogTitle == '网点'">
              <el-table-column label="姓名">
                {{
                  dialogList.primaryUser
                    ? dialogList.primaryUser.fullName
                    : '--'
                }}
              </el-table-column>
              <el-table-column label="手机号码">
                {{
                  dialogList.primaryUser ? dialogList.primaryUser.mobile : '--'
                }}
              </el-table-column>
              <el-table-column label="所属单位" prop="unitName" />
            </template>
            <template v-else-if="dialogTitle == '商圈'">
              <el-table-column
                label="商圈名称"
                prop="districtName"
              ></el-table-column>
              <el-table-column
                label="已关联店铺"
                prop="storeNum"
              ></el-table-column>
              <el-table-column
                label="商圈地址"
                prop="address"
              ></el-table-column>
            </template>
          </el-table>
        </el-tabs>
        <!-- 分页 -->
        <template v-if="dialogTitle !== '网点'">
          <table-pagination
            v-if="
              (dialogActive == 'relation' && dialogTitle == '商圈') ||
              dialogTitle !== '商圈'
            "
            :total="dialogPagination.total"
            :page.sync="dialogPagination.current"
            :limit.sync="dialogPagination.size"
            layout="total, prev, pager, next"
            @pagination="
              dialogTitle == '关联账户' ? getDistributionUnit : getlowerList
            "
          />
          <span
            v-if="dialogTitle !== '关联账户'"
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              v-if="
                dialogActive == 'relation' &&
                dialogTitle == '商圈' &&
                permissions.delete_unit_district
              "
              @click="deleteDistrict"
              >取消关联</el-button
            >
            <el-button
              v-if="
                (dialogTitle == '商圈' &&
                  dialogActive !== 'relation' &&
                  permissions.relation_unit_district) ||
                (dialogTitle == '关联创客' &&
                  permissions.relation_unit_distributor)
              "
              type="primary"
              @click="submitFun"
              >确定关联</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import TablePagination from '@/components/table-pagination'
import { mapGetters } from 'vuex'
import {
  getUnitDetail,
  unitEdit,
  getDistributionUnit,
  getlowerList,
  getRelationUnit,
  unitDistrict,
  // 关联主账号待用
  unitPrimaryUser,
  getRelationUser,
  userNormal,
  userDisabled,
  unitDistributor,
  resetPassword,
  userStatusUpdate,
  getRelationList,
  deleteDistrict
} from '@/api/mechanism/see'
export default {
  components: { TablePagination },
  data() {
    return {
      // 校验规则
      rules: {
        newName: [
          { required: true, message: '请输入单位名称', trigger: 'blur' }
        ]
      },
      // 展示状态
      showType: 'normal',
      loading: false,
      tableLoading: false,
      activeName: 'ordinary',
      // 弹窗tab栏
      dialogActive: 'relation',
      // 单位详情数据
      unitDetail: { newName: '' },
      input: '',
      relationList: [],
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        total: 0, //总条数
        pages: 0
      },
      dialogVisible: false,
      dialogTitle: '关联账户',
      dialogList: [],
      dialogPagination: {
        current: 1, //页码
        size: 10,
        total: 0,
        pages: 0
      },
      // 弹窗表格选中项
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.getUnitDetail()
  },
  methods: {
    getUnitDetail() {
      getUnitDetail(this.$route.query.id).then(res => {
        this.unitDetail = {
          ...res.data.data,
          ...this.unitDetail
        }
      }).then(()=>{
        this.handleClick()
      })
    },
    // 修改按钮
    editBtn() {
      this.unitDetail.newName = this.unitDetail.unitName
      this.showType = 'edit'
    },
    // 修改保存
    unitEdit() {
      this.$refs['unitDetail'].validate(valid => {
        if (valid) {
          this.unitDetail.unitName = this.unitDetail.newName
          unitEdit(this.unitDetail).then(res => {
            if (res.data.data == true) {
              this.$message.success('单位名称修改成功')
              this.showType = 'normal'
              this.getUnitDetail()
            }
          })
        }
      })
    },
    // 获取未关联账号列表
    getDistributionUnit(dialogTitle) {
      this.tableLoading = true
      if (dialogTitle == '关联创客') {
        this.dialogTitle = dialogTitle
      } else {
        this.dialogTitle = '关联账户'
      }
      this.dialogVisible = true
      getDistributionUnit(this.dialogPagination).then(res => {
        this.dialogList = res.data.data.records
        this.dialogPagination.total = res.data.data.total
        this.tableLoading = false
      })
    },
    // 获取关联网点
    getlowerList() {
      this.tableLoading = true
      this.dialogTitle = '网点'
      this.dialogVisible = true
      getlowerList(this.unitDetail.unitId).then(res => {
        this.dialogList = res.data.data
        this.tableLoading = false
      })
    },
    getRelationUnit() {
      this.tableLoading = true
      this.dialogTitle = '商圈'
      this.dialogVisible = true
      this.dialogHandleClick()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 获取下方表格数据
    handleClick() {
      this.loading = true
      let reqData = {
        type: this.activeName,
        ...this.pagination,
        unitId: this.unitDetail.unitId
      }

      getRelationUser(reqData).then(res => {
        this.relationList = res.data.data.records
        this.pagination.total = res.data.data.total
        this.loading = false
      })
    },
    // 弹窗tab切换
    dialogHandleClick() {
      this.dialogList = []

      // 查询已关联商圈
      if (this.dialogActive == 'relation') {
        let reqData = {
          ...this.dialogPagination,
          unitId: this.unitDetail.unitId
        }
        getRelationList(reqData).then(res => {
          this.dialogList = res.data.data.records
          this.dialogPagination.total = res.data.data.total
          this.tableLoading = false
        })
      }
      // 查询未关联商圈
      else {
        getRelationUnit(this.unitDetail.location).then(res => {
          this.dialogList = res.data.data
          this.tableLoading = false
        })
      }
    },
    // 商圈取消关联
    deleteDistrict() {
      if (!this.unitDetail.status || this.unitDetail.status !== 'normal') {
        this.$message.error('停用单位不可进行操作~')
      } else {
        if (this.dialogTitle == '商圈' && this.multipleSelection.length < 1) {
          this.$message.warning('请勾选需要取消关联的商圈~')
        } else if (
          this.dialogTitle == '商圈' &&
          this.multipleSelection.length > 0
        ) {
          let ids = []
          this.multipleSelection.forEach(item => {
            ids.push(item.id)
          })
          deleteDistrict(ids.join())
            .then(res => {
              if (res.data.data) {
                this.dialogHandleClick()
                this.$message.success('取消关联成功')
              }
            })
            .finally(() => {
              this.multipleSelection = []
            })
        }
      }
    },
    // 关联主用户
    unitPrimaryUser(userId) {
      let reqData = {
        userId,
        unitId: this.unitDetail.unitId
      }
      this.$message('该功能暂未开放哦~')
      console.log(reqData)
    },
    // 关联提交
    submitFun() {
      if (!this.unitDetail.status || this.unitDetail.status !== 'normal') {
        this.$message.error('停用单位不可进行操作~')
      } else {
        // 弹窗操作为商圈组
        if (this.dialogTitle == '商圈' && this.multipleSelection.length < 1) {
          this.$message.warning('请勾选需要关联的商圈~')
        } else if (
          this.dialogTitle == '商圈' &&
          this.multipleSelection.length > 0
        ) {
          let reqData = {
            districtIds: [],
            unitId: this.unitDetail.unitId
          }
          this.multipleSelection.forEach(item => {
            reqData.districtIds.push(item.districtId)
          })
          unitDistrict(reqData)
            .then(res => {
              if (res.data.data) {
                this.getUnitDetail()
                this.$message.success('关联商圈成功')
              }
            })
            .finally(() => {
              this.multipleSelection = []
            })
        } else if (
          this.dialogTitle == '关联创客' &&
          this.multipleSelection.length < 1
        ) {
          this.$message.warning('请勾选需要关联的人员~')
        } else if (
          this.dialogTitle == '关联创客' &&
          this.multipleSelection.length > 0
        ) {
          let reqData = {
            userIds: [],
            unitId: this.unitDetail.unitId
          }
          this.multipleSelection.forEach(item => {
            reqData.userIds.push(item.user.userId)
          })
          unitDistributor(reqData)
            .then(res => {
              if (res.data.data) {
                this.handleClick()
                this.dialogVisible = false
                this.$message.success('关联创客成功')
              }
            })
            .finally(() => {
              this.multipleSelection = []
            })
        }
      }
    },
    // 冻结
    userDisabled(userId) {

      if (!this.unitDetail.status || this.unitDetail.status !== 'normal') {
        this.$message.error('停用单位不可进行操作~')
      } else if (this.activeName == 'ordinary') {
        userDisabled(userId).then(res => {
          if (res.data.data) {
            this.$message.success('操作成功')
            this.handleClick()
          }
        })
      } else {
        userStatusUpdate({
          status: 'disabled',
          userId
        }).then(res => {
          if (res.data.data) {
            this.$message.success('操作成功')
            this.handleClick()
          }
        })
      }
    },
    // 解冻
    userNormal(userId) {
      if (!this.unitDetail.status || this.unitDetail.status !== 'normal') {
        this.$message.error('停用单位不可进行操作~')
      } else if (this.activeName == 'ordinary') {
        userNormal(userId).then(res => {
          if (res.data.data) {
            this.$message.success('操作成功')
            this.handleClick()
          }
        })
      } else {
        userStatusUpdate({
          status: 'normal',
          userId
        }).then(res => {
          if (res.data.data) {
            this.$message.success('操作成功')
            this.handleClick()
          }
        })
      }
    },
    // 重置密码
    resetPassword(userId) {
      resetPassword(userId).then(res => {
        if (!this.unitDetail.status || this.unitDetail.status !== 'normal') {
          this.$message.error('停用单位不可进行操作~')
        } else if (res.data.data) {
          this.$message.success('操作成功')
          this.handleClick()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.mechanism-see {
  // 单行显示
  .singleLine {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .noDistributor {
    text-align: center;
    padding: 50px 0;
    p {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    button {
      font-size: 16px;
    }
  }
  .main-top {
    position: relative;
    background-color: #fff;
    margin: 0 20px;
    padding: 15px 0;
    padding: 50px 100px 50px 50px;
    // 按钮组样式
    .position.el-button {
      position: absolute;
      right: 20px;
      bottom: 20px;
      width: 135px;
      padding: 10px 15px;
      font-size: 14px;
    }
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
      font-size: 14px;
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
    & > div {
      display: inline-block;
      width: 50%;
      p {
        margin: 0 0 20px 0;
        font-size: 14px;
        button {
          font-size: 14px;
          padding: 0;
        }
      }
      p:last-of-type {
        margin: 0;
      }
    }
    ::v-deep .newName .el-input__inner {
      font-size: 30px;
      height: auto;
      line-height: 1;
    }
  }
  .main-bottom {
    background-color: #fff;
    padding: 0 10px;
    .user-wrap {
      text-align: left;
      .avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        vertical-align: sub;
        margin-right: 10px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .user-base {
        display: inline-block;
      }
    }
  }
}
</style>
