<template>
  <div class="main-content">
    <!-- 筛选条件表单 -->
    <el-form
      :inline="true"
      :model="search"
      id="demo-form-inline"
      class="demo-form-inline"
    >
      <!-- 用户搜索 -->
      <el-form-item label="网点名称：">
        <el-input
          v-model="search.name"
          style="width: 100%"
          placeholder="请输入网点名称"
        >
        </el-input>
      </el-form-item>
      <div>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">
          搜索
        </el-button>
        <el-button icon="el-icon-refresh" class="reset" @click="resetSearch">
          重置
        </el-button>
      </div>
    </el-form>
    <!-- 新增 -->
    <div id="tableBtn">
      <el-button type="primary" @click="addNetwork()"> 新增网点 </el-button>
    </div>
    <!-- 表格 -->
    <div>
      <el-table
        :data="networkArr"
        style="width: 100%"
        row-key="id"
        border
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        :height="tableHeight"
        lazy
        :load="load"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="locationName" label="地区" sortable>
        </el-table-column>
        <el-table-column prop="name" label="网点" sortable width="180">
        </el-table-column>
        <el-table-column label="详细地址">
          <template slot-scope="scope">
            {{ scope.row.address ? scope.row.address : "--" }}
          </template>
        </el-table-column>
        <el-table-column label="电话">
          <template slot-scope="scope">
            {{ scope.row.telephone ? scope.row.telephone : "--" }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope" v-if="!scope.row.areaFlag">
            <el-button type="text" @click="toEdit(scope.row)"> 编辑 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹框 -->
    <el-dialog
      title="新增/编辑网点"
      :visible.sync="interview.dialogVisibleForm"
      style="width: 100%"
    >
      <el-form ref="dataForm" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="网点名称：" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入网点名称"
            maxlength="20"
            tyle="width: 50%"
          />
        </el-form-item>
        <el-form-item label="网点地址：" prop="location">
          <el-cascader
            ref="cascader"
            v-model="form.locationArr"
            :props="locationNameList"
            placeholder="请选择省/市/县区"
            clearable
            tyle="width: 50%"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item prop="address">
          <el-autocomplete
            v-model="form.address"
            style="width: 50%"
            popper-class="autoAddressClass"
            :fetch-suggestions="querySearchAsync"
            :trigger-on-focus="false"
            placeholder="请输入详细地址,最多50个字符"
            clearable
            @select="handleAddress"
          >
            <template slot-scope="{ item }">
              <div style="overflow: hidden">
                <div class="title">{{ item.title }}</div>
                <span class="address ellipsis">{{ item.address }}</span>
              </div>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item>
          <!-- 地图 -->
          <baidu-map
            class="map"
            :zoom="14"
            :scroll-wheel-zoom="true"
            :center="mapData.center"
            @ready="onReady"
          />
        </el-form-item>
        <el-form-item label="联系电话：" prop="telephone">
          <el-input
            v-model="form.telephone"
            placeholder="请输入联系电话"
            maxlength="15"
            style="width: 50%"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :disabled="interview.formLoading"
          @click="formSave()"
        >
          保存
        </el-button>
        <el-button @click="interview.dialogVisibleForm = false">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getUnitList, addUnit, updateUnit } from "@/api/network/network";
// 引入地区查询接口
import { areas } from "@/api/area";
export default {
  data() {
    return {
      // 省市区联动
      locationNameList: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          const parentId = !node.value ? "-1" : node.value;
          setTimeout(() => {
            areas({ parentId: parentId, lazy: true }).then((res) => {
              const areaList = res.data.data;
              const nodes = Array.from(areaList).map((item) => ({
                value: item.areaId,
                label: item.name,
                leaf: level >= 2,
              }));
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes);
            });
          }, 100);
        },
      },
      // 表格高度
      tableHeight: "calc(100vh - 335px)",
      search: {
        name: undefined,
      },
      parentLocation: -1,
      location: null,
      tableData1: [],
      // 经纬度 默认长沙市天心区
      //地图数据
      mapData: {
        //中心坐标
        center: { lng: 28.1127, lat: 112.98991 },
        //缩放级别
        zoom: 14,
      },
      form: {
        address: null,
        lat: null,
        lng: null,
        location: null,
        locationArr: [],
        locationName: null,
        name: null,
        telephone: null,
        id: null,
      },
      interview: {
        formLoading: false,
        dialogVisibleForm: false,
        isEdit: false,
      },
      networkArr: [],
      // 表单校验
      rules: {
        address: [
          {
            required: true,
            message: "请输入详情信息",
            trigger: "blur",
          },
        ],
        location: [
          {
            required: true,
            message: "请选择省市区",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "请填写网点名称",
            trigger: "blur",
          },
        ],
        telephone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { max: 15, message: "长度在15个字符以内", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getUnitList();
  },
  methods: {
    // 获取网点列表
    getUnitList() {
      let data = {
        location: this.location,
        name: this.search.name,
        parentLocation: this.parentLocation,
      };
      getUnitList(data).then((res) => {
        console.debug("res", res);
        for (let i in res.data.data) {
          res.data.data[i].hasChildren = res.data.data[i].areaFlag;
        }
        this.networkArr = res.data.data;
      });
    },
    // 地图初始化回调
    onReady({ BMap, map }) {
      this.BMap = BMap;
      this.map = map;
      //如果一开始坐标存在(编辑的时候)
      if (this.form.lng && this.form.lat) {
        //设置坐标
        this.mapData.center.lng = this.form.lng;
        this.mapData.center.lat = this.form.lat;
      }
      let marker = new BMap.Marker(
        new BMap.Point(this.form.lng, this.form.lat)
      );
      //将标记添加到地图上
      map.addOverlay(marker);
    },
    // 加载
    load(tree, treeNode, resolve) {
      console.debug("tree,treeNode", tree, treeNode);
      let data = {
        location: this.location,
        name: this.search.name,
        parentLocation: tree.location,
      };
      getUnitList(data).then((res) => {
        console.debug("res", res);
        for (let i in res.data.data) {
          res.data.data[i].hasChildren = res.data.data[i].areaFlag;
        }
        setTimeout(() => {
          resolve(res.data.data);
        }, 1000);
      });
    },
    // 搜索
    handleSearch() {
      this.getUnitList();
    },
    // 重置
    resetSearch() {
      this.search.name = null;
      this.getUnitList();
    },
    // 省市区选择事件
    handleChange() {
      this.form.locationName = this.$refs.cascader
        .getCheckedNodes()[0]
        .pathLabels.join("");
      if (this.form.address) {
        this.$refs["dataForm"].validateField("address");
      }
    },
    // 地址搜索
    querySearchAsync(str, cb) {
      var options = {
        onSearchComplete: function (res) {
          var s = [];
          // eslint-disable-next-line no-undef
          if (local.getStatus() == BMAP_STATUS_SUCCESS) {
            for (var i = 0; i < res.getCurrentNumPois(); i++) {
              s.push(res.getPoi(i));
            }
            cb(s);
          } else {
            cb(s);
          }
        },
      };
      var local = new this.BMap.LocalSearch(this.map, options);
      local.search(str);
    },
    // 选择地址
    handleAddress(item) {
      this.form.address = item.title;
      this.form.lat = item.point.lat;
      this.form.lng = item.point.lng;
      this.map.clearOverlays();
      this.mk = new this.BMap.Marker(item.point);
      this.map.addOverlay(this.mk);
      this.map.panTo(item.point);
    },
    // 新增网点
    addNetwork() {
      this.form = {
        address: null,
        lat: null,
        lng: null,
        location: null,
        locationArr: [],
        locationName: null,
        name: null,
        telephone: null,
        id: null,
      };
      this.interview.isEdit = false;
      this.interview.dialogVisibleForm = true;
    },
    // 去编辑
    toEdit(item) {
      const locationArr = [];
      if (item.location) {
        const arr = item.location.split(",");
        for (const i in arr) {
          locationArr.push(Number(arr[i]));
        }
      }
      this.form = {
        address: item.address,
        lat: item.lat,
        lng: item.lng,
        location: locationArr,
        locationArr: locationArr,
        locationName: item.locationName,
        name: item.name,
        telephone: item.telephone,
        id: item.id,
      };
      console.debug("this,form", this.form);
      this.interview.isEdit = true;
      this.interview.dialogVisibleForm = true;
    },
    // 新增编辑保存
    formSave() {
      console.debug("this.form", this.form);
      this.interview.formLoading = true;
      if (this.form.locationArr) {
        this.form.location = this.form.locationArr.toString();
      }
      if (this.form.id) {
        updateUnit(this.form)
          .then(() => {
            this.$message.success("修改成功");
            this.interview.dialogVisibleForm = false;
            this.interview.formLoading = false;
            this.getUnitList();
          })
          .catch(() => {
            this.interview.formLoading = false;
          });
      } else {
        addUnit(this.form)
          .then((res) => {
            console.debug("res", res);
            this.$message("添加成功");
            this.interview.dialogVisibleForm = false;
            this.interview.formLoading = false;
            this.getUnitList();
          })
          .catch(() => {
            this.interview.formLoading = false;
          });
      }
    },
  },
};
</script>
<style scoped>
.map {
  width: 100%;
  height: 300px;
  background-color: #000;
}
</style>
