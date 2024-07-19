<template>
  <div class="main-content">
    <div id="demo-form-inline" class="main-top">
      <div class="main-top-item">
        <div>{{ userMes.fullName ? userMes.fullName : '--' }}</div>
        <div>{{ userMes.mobile ? userMes.mobile : '--' }}</div>
      </div>
      <div class="main-top-item">
        <el-button type="primary" @click="toAddAddress">新增收货地址</el-button>
      </div>
    </div>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :height="tableHeight"
    >
      <el-table-column type="index" label="序号" prop="name"></el-table-column>
      <el-table-column prop="name" label="收货人信息" width="200">
        <template slot-scope="scope">
          <div>{{ scope.row.fullName ? scope.row.fullName : '--' }}</div>
          <div>{{ scope.row.mobile ? scope.row.mobile : '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="地址" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.locationName }}{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设为默认地址">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isDefault"
            :disabled="!permissions.address_default_edit"
            @change="setDefault(scope.row.addressId)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="name" label="标签">
          <template slot-scope="scope">
            <span>{{ scope.row.remark?scope.row.remark:'--' }}</span>
          </template>
        </el-table-column> -->
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="toEditAddress(scope.row)"
            >编辑</el-button
          >
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
    <!-- 编辑和添加弹框 -->
    <el-dialog
      :title="editOrAdd === 'Add' ? '添加收货地址' : '编辑收货地址'"
      :visible.sync="interactive.dialogVisible_address"
      width="40%"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
        <el-form-item
          label="收货人："
          :label-width="formLabelWidth"
          prop="fullName"
        >
          <el-input
            v-model="ruleForm.fullName"
            placeholder="请输入收货人"
            width="100"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="手机号码："
          :label-width="formLabelWidth"
          prop="mobile"
        >
          <el-input
            v-model="ruleForm.mobile"
            placeholder="请输入手机号码"
            maxlength="11"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="所在地区："
          :label-width="formLabelWidth"
          prop="location"
        >
          <!-- <el-input v-model="ruleForm.location" placeholder="请输入所在地区"></el-input> -->
          <el-cascader
            v-if="areaShow"
            ref="cascader"
            v-model="ruleForm.location"
            :props="locationNameList"
            placeholder="请选择省/市/县区"
            clearable
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="详细地址："
          :label-width="formLabelWidth"
          prop="address"
        >
          <el-input
            v-model="ruleForm.address"
            placeholder="请输入详细地址"
            max="50"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="标签：" :label-width="formLabelWidth" prop="label">
          <el-radio-group v-model="interactive.label_radio">
            <el-radio label="公司"></el-radio>
            <el-radio label="学校"></el-radio>
            <el-radio label="家"></el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="设为默认标签：" :label-width="formLabelWidth">
          <el-switch v-model="ruleForm.isDefault"> </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog_cancle">取 消</el-button>
        <el-button type="primary" @click="to_saveAddress">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import TablePagination from '@/components/table-pagination'
import {
  getAddressPages,
  setDefaultAddress,
  addAddress,
  updateAddress
} from '@/api/address/user'
// 引入地区查询接口
import { areas } from '@/api/area'
import { mapGetters } from 'vuex'
export default {
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      // 省市区联动
      locationNameList: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node
          const parentId = !node.value ? '-1' : node.value
          setTimeout(() => {
            areas({ parentId: parentId, lazy: true }).then(res => {
              const areaList = res.data.data
              // console.log('areaList', areaList)
              const nodes = Array.from(areaList).map(item => ({
                value: item.areaId,
                label: item.name,
                leaf: level >= 2
              }))
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes)
            })
          }, 100)
        }
      },
      tableLoading: false,
      userMes: {},
      tableData: [],
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      },
      interactive: {
        default_value: true,
        dialogVisible_address: false
      },
      formLabelWidth: '120px',
      form: {},
      editOrAdd: 'Add',
      ruleForm: {
        fullName: undefined,
        mobile: undefined,
        location: undefined,
        address: undefined,
        isDefault: true,
        userId: undefined,
        addressId: undefined
      },
      areaShow: false, //显示隐藏组件
      rules: {
        fullName: [
          { required: true, message: '请输入收货人', trigger: 'blur' },
          { max: 10, message: '长度在10个字符以内', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { max: 11, message: '长度在11个字符以内', trigger: 'blur' }
        ],
        location: [
          { required: true, message: '请输入所在地区', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    if (this.$route.query) {
      this.userMes = this.$route.query
      this.$nextTick(() => {
        this.getUserAllList()
      })
    }
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
        190
      }px)`
    },
    getList() {
      this.getUserAllList()
    },
    // 获取收货地址列表
    getUserAllList() {
      const data = {
        current: this.pagination.current,
        size: this.pagination.size,
        userId: this.userMes.userId
      }
      this.tableLoading = true
      getAddressPages(data).then(res => {
        this.tableLoading = false
        const page = res.data.data
        this.tableData = page.records
        this.pagination.total = page.total
        this.pagination.pages = page.pages
      })
    },
    // 收货地址增加修改保存
    to_saveAddress() {
      if (typeof this.ruleForm.location === 'object') {
        this.ruleForm.location = this.ruleForm.location.join(',')
      }
      this.ruleForm.userId = this.userMes.userId
      if (!/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(this.ruleForm.mobile)) {
        this.$message.warning('填写正确的手机号码')
        return
      }
      if (this.editOrAdd === 'Add') {
        this.addAddress()
      } else if (this.editOrAdd === 'Edit') {
        this.updateAddress()
      }
    },
    // 增加
    addAddress() {
      addAddress(this.ruleForm).then(() => {
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
        this.interactive.dialogVisible_address = false
        this.getUserAllList()
      })
    },
    // 修改
    updateAddress() {
      updateAddress(this.ruleForm).then(() => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.interactive.dialogVisible_address = false
        this.getUserAllList()
      })
    },
    // 去编辑
    toEditAddress(user) {
      this.editOrAdd = 'Edit'
      this.areaShow = true
      this.ruleForm = {
        fullName: user.fullName,
        mobile: user.mobile,
        location: user.location.split(',').map(Number),
        address: user.address,
        isDefault: user.isDefault,
        addressId: user.addressId,
        userId: this.userMes.userId
      }
      this.interactive.dialogVisible_address = true
    },
    // 去添加
    toAddAddress() {
      this.areaShow = true
      this.ruleForm = {
        fullName: undefined,
        mobile: undefined,
        location: undefined,
        address: undefined,
        isDefault: true,
        userId: undefined,
        addressId: undefined
      }
      this.editOrAdd = 'Add'
      this.interactive.dialogVisible_address = true
    },
    // 取消
    dialog_cancle() {
      this.areaShow = false
      this.ruleForm = {
        fullName: undefined,
        mobile: undefined,
        location: undefined,
        address: undefined,
        isDefault: true,
        userId: undefined,
        addressId: undefined
      }
      this.interactive.dialogVisible_address = false
    },
    // 设为默认
    setDefault(addressId) {
      setDefaultAddress(addressId).then(() => {
        this.$message({
          type: 'success',
          message: '设置成功!'
        })
        this.getUserAllList()
      })
    }
  }
}
</script>
<style lang="scss" scope>
.main-top {
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 30px;
  position: relative;
}
</style>
