<template>
  <el-scrollbar>
    <div class="tem-container">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :v-loading="formLoading"
      >
        <el-alert
          title="任务信息"
          type="info"
          class="el-alert"
          :closable="false"
        ></el-alert>
        <el-form-item label="任务类型：" prop="typeCode">
          <el-select
            v-model="ruleForm.typeCode"
            placeholder="请选择任务类型"
            style="width: 40%"
            @change="typeChange"
            :disabled="isEdit"
          >
            <div v-for="(level, levelIndex) in taskTypeAll" :key="levelIndex">
              <el-option
                :value="level.dictValue"
                :label="level.dictName"
                v-if="level.dictValue != 'inspection'"
              ></el-option>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="permissions.task_audit"
          label="保证金类型："
          prop="suretyType"
        >
          <el-radio-group v-model="ruleForm.suretyType">
            <div class="bond-raido">
              <el-radio
                v-for="(item, bondIndex) in bondTypeArr"
                :key="bondIndex"
                :label="item.dictValue"
              >
                <span
                  class="bond-raido-single"
                  v-if="
                    ruleForm.suretyType === 'single' &&
                    item.dictValue === 'single'
                  "
                >
                  {{ item.dictName }}
                  <el-form-item
                    :prop="
                      ruleForm.suretyType === 'single' ? 'suretyAmount' : ''
                    "
                  >
                    <el-input
                      v-model="ruleForm.suretyAmount"
                      placeholder=""
                      style="width: 200px; margin-left: 20px"
                    >
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                </span>
                <span v-else>
                  {{ item.dictName }}
                </span>
              </el-radio>
            </div>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="任务名称：" prop="taskName">
          <el-input
            v-model="ruleForm.taskName"
            placeholder="请填写任务名称"
            style="width: 40%"
          />
        </el-form-item>
        <el-form-item label="任务说明：" prop="taskDesc">
          <el-input
            v-model="ruleForm.taskDesc"
            placeholder="请尽量详细描述您的任务需求，合作条件，周期，目标等，可以减少沟通提供接单率~"
            type="textarea"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="创客实名认证：" prop="realAuth">
          <el-radio-group v-model="ruleForm.realAuth">
            <el-radio :label="false">不限制</el-radio>
            <el-radio :label="true">需要实名认证</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="超时时间："
          prop="cancelReceiveType"
          v-if="ruleForm.applyUser !== 'union'"
        >
          <el-radio-group v-model="ruleForm.cancelReceiveType">
            <el-radio label="unlimited">不限制</el-radio>
            <el-radio label="period_time">需要超时时间</el-radio>
          </el-radio-group>
          <el-input
            placeholder="填写超时时间(小时)"
            style="width: 30%; margin-left: 10px"
            v-model="ruleForm.cancelReceivePeriod"
            v-if="ruleForm.cancelReceiveType === 'period_time'"
          >
          </el-input>
        </el-form-item>
        <el-alert
          title="任务奖励"
          type="info"
          class="el-alert"
          :closable="false"
        ></el-alert>
        <el-form-item label="领取人数：" prop="personNum">
          <el-input
            v-model.number="ruleForm.personNum"
            placeholder="请输入最大领取任务的人数"
            style="width: 40%"
          >
            <template slot="append">人</template>
          </el-input>
          <span style="margin-left: 30px; color: #b5b5b5"
            >未填写数值则表示不限制领取人数</span
          >
        </el-form-item>
        <el-form-item label="任务目标：" prop="taskTarget">
          <el-input
            v-model.number="ruleForm.taskTarget"
            placeholder="请输入任务完成的总数量"
            style="width: 40%"
          >
            <template slot="append">个</template>
          </el-input>
          <span style="margin-left: 30px; color: #b5b5b5"
            >未填写数值则表示不限制目标数</span
          >
        </el-form-item>

        <el-form-item label="任务单价：" prop="unitPrice">
          <el-input
            v-model="ruleForm.unitPrice"
            placeholder="请输入任务的单个奖励金额"
            style="width: 40%"
            @input="
              ruleForm.unitPrice = asynchronousValidation(ruleForm.unitPrice)
            "
          >
            <template slot="append">元</template>
          </el-input>
          +
          <el-input
            v-model="ruleForm.unitIntegral"
            placeholder="请输入任务的单个奖励米粒"
            style="width: 20%"
            @input="
              ruleForm.unitIntegral = asynchronousValidation(
                ruleForm.unitIntegral
              )
            "
          >
            <template slot="append">米粒</template>
          </el-input>
        </el-form-item>
        <el-form-item label="任务预算：" prop="budget">
          <el-input
            v-model="ruleForm.budget"
            placeholder="请输入任务预算"
            style="width: 40%"
            @input="ruleForm.budget = asynchronousValidation(ruleForm.budget)"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-alert
          title="任务周期及地域"
          type="info"
          class="el-alert"
          :closable="false"
        ></el-alert>
        <el-form-item label="合作周期：" prop="cycle">
          <el-input
            v-model="ruleForm.cycle"
            placeholder="请输入任务合作周期"
            style="width: 40%"
          >
            <template slot="append">天</template>
          </el-input>
        </el-form-item>
        <el-form-item label="区域要求：" prop="locationCode">
          <el-cascader
            ref="cascader"
            v-model="ruleForm.locationCode"
            :props="locationNameList"
            placeholder="请选择省/市/县区"
            clearable
            style="width: 40%"
            @change="handleChange"
          ></el-cascader>
          <!-- 
            :show-all-levels="false" -->
        </el-form-item>
        <el-form-item label="详细地址：">
          <div class="search-search">
            <el-autocomplete
              v-model="ruleForm.address"
              style="width: 40%"
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
          </div>
        </el-form-item>
        <!-- 地图 -->
        <el-form-item>
          <baidu-map
            class="map"
            :center="
              ruleForm.locationName ? 'ruleForm.locationName' : '长沙市天心区'
            "
            :zoom="14"
            :scroll-wheel-zoom="true"
            @ready="onReady"
          />
        </el-form-item>
        <el-form-item label="指定人群：" prop="applyUser">
          <el-select
            v-model="ruleForm.applyUser"
            placeholder="请选择指定人群"
            style="width: 40%"
            :disabled="isEdit"
          >
            <div v-for="item in getGroupArr" :key="item.dictValue">
              <el-option
                :label="item.dictName"
                :value="item.dictValue"
                :disabled="
                  item.dictValue === 'partner' ||
                  item.dictValue === 'union_member'
                "
              ></el-option>
            </div>
          </el-select>
        </el-form-item>
        <!-- 关联公会 -->
        <div class="relation-Union" v-if="ruleForm.applyUser === 'union'">
          <div class="relation-label">关联公会数</div>
          <div class="relation-input" v-if="ruleForm.unionIds">
            {{ ruleForm.unionIds.length }}
          </div>
          <el-button
            type="primary"
            @click="add_relationGuild"
            :disabled="isEdit"
            >添加关联</el-button
          >
        </div>
        <!-- 关联公会弹框 -->
        <GulidRelation
          ref="guildRelation"
          :locationCode="this.ruleForm.locationCode"
          :unionIds="this.ruleForm.unionIds"
          @relationFunc="relationFunc"
        ></GulidRelation>
        <el-alert
          title="任务结果节点信息（最多9个步骤）"
          type="info"
          class="el-alert"
          :closable="false"
        >
          <el-button
            v-if="!isEdit && ruleForm.typeCode != 'abc_store'"
            size="mini"
            class="el-alert-right"
            @click="addNodes"
            >添加节点信息</el-button
          >
        </el-alert>
        <el-table
          v-if="!nodeIsShow"
          :data="ruleForm.resultNodes"
          border
          style="width: 100%; margin-bottom: 20px"
        >
          <el-table-column type="index" label="序号" width="50">
          </el-table-column>
          <el-table-column label="节点名称" width="200">
            <template slot-scope="scope">
              <el-form-item
                :prop="`resultNodes[${scope.$index}].nodeName`"
                :rules="rules.nodeName"
              >
                <el-input
                  v-model="scope.row.nodeName"
                  placeholder="请输入节点名称"
                  :disabled="ruleForm.typeCode == 'abc_store' || isEdit"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="说明描叙" width="200">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.nodeDesc"
                :rows="3"
                type="textarea"
                placeholder="请输入说明描叙"
                :disabled="ruleForm.typeCode == 'abc_store' || isEdit"
              />
            </template>
          </el-table-column>
          <el-table-column label="是否为结算点" width="150">
            <template slot-scope="scope">
              <el-form-item
                placeholder="请选择是否为结算点"
                :prop="`resultNodes[${scope.$index}].isSettlement`"
                :rules="rules.isSettlement"
              >
                <el-radio-group
                  v-model="scope.row.isSettlement"
                  :disabled="ruleForm.typeCode == 'abc_store' || isEdit"
                >
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="是否需要审核" width="150">
            <template slot-scope="scope">
              <el-form-item
                placeholder="请选择是否需要审核"
                :prop="`resultNodes[${scope.$index}].needAudit`"
                :rules="rules.needAudit"
              >
                <el-radio-group
                  v-model="scope.row.needAudit"
                  :disabled="ruleForm.typeCode == 'abc_store' || isEdit"
                >
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="上传链接类型"
            v-if="ruleForm.typeCode === 'abc_store' || isEdit"
            :key="Math.random()"
          >
            <template slot-scope="scope">
              <span>{{
                scope.row.linkTypeName ? scope.row.linkTypeName : "--"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="上传链接"
            width="150"
            v-if="ruleForm.typeCode === 'abc_store' || isEdit"
            :key="Math.random()"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.linkUrl ? scope.row.linkUrl : "--" }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="可上传图片张数" width="150">
            <template slot-scope="scope">
              <el-form-item
                :prop="`resultNodes[${scope.$index}].needImageCount`"
                :rules="rules.needImageCount"
              >
                <el-input
                  v-model.number="scope.row.needImageCount"
                  placeholder="请输入可上传张数"
                  :disabled="ruleForm.typeCode == 'abc_store' || isEdit"
                  @change="countChange(scope.$index)"
                />
              </el-form-item>
            </template>
          </el-table-column> -->
          <el-table-column label="可上传图片最小张数" width="150">
            <template slot-scope="scope">
              <el-form-item
                :prop="`resultNodes[${scope.$index}].needImageCountMin`"
                :rules="rules.needImageCountMin"
              >
                <el-input
                  v-model.number="scope.row.needImageCountMin"
                  placeholder="请输入可上传张数"
                  :disabled="ruleForm.typeCode == 'abc_store' || isEdit"
                  @input="countChange(scope.$index)"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="可上传图片最大张数" width="150">
            <template slot-scope="scope">
              <el-form-item
                :prop="`resultNodes[${scope.$index}].needImageCountMax`"
                :rules="rules.needImageCountMax"
              >
                <el-input
                  v-model.number="scope.row.needImageCountMax"
                  placeholder="请输入可上传张数"
                  :disabled="ruleForm.typeCode == 'abc_store' || isEdit"
                  @input="countChange1(scope.$index)"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="说明示例图" width="600">
            <template
              slot-scope="scope"
              v-if="scope.row.needImageCountMax > scope.row.needImageCountMin"
            >
              <upload-file
                :ref="'nodeImgs' + scope.$index"
                v-model="scope.row.egImage"
                :value="scope.row.egImage"
                :limit="
                  scope.row.needImageCountMax
                    ? scope.row.needImageCountMax * 1
                    : 0
                "
                :disabled="ruleForm.typeCode == 'abc_store' || isEdit"
              />
            </template>
          </el-table-column>
          <el-table-column
            v-if="ruleForm.typeCode != 'abc_store'"
            label="操作"
            width="80"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.$index != '0'"
                type="danger"
                @click="delNodes(scope.row, scope.$index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-alert
          title="任务步骤（文字说明为必填项）"
          type="info"
          class="el-alert"
          :closable="false"
        >
          <el-button size="mini" class="el-alert-right" @click="onIncrease"
            >添加任务步骤</el-button
          >
        </el-alert>
        <el-table
          v-if="!formLoading"
          :data="tableData"
          border
          style="width: 100%; margin-bottom: 20px"
        >
          <el-table-column type="index" label="序号" width="50">
          </el-table-column>
          <el-table-column label="步骤标题" width="200">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.stepTitle"
                placeholder="请输入步骤标题"
              />
            </template>
          </el-table-column>
          <el-table-column label="步骤描叙" width="300">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.stepDesc"
                :rows="3"
                type="textarea"
                placeholder="请输入步骤描叙"
              />
            </template>
          </el-table-column>
          <el-table-column label="网站链接" width="300">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.stepLink"
                :rows="3"
                type="textarea"
                placeholder="请输入网站链接"
              />
            </template>
          </el-table-column>
          <el-table-column label="上传图片（最多3张）" width="600">
            <template slot-scope="scope">
              <upload-file
                :ref="'upload' + scope.$index"
                v-model="scope.row.resUrls"
                :value="scope.row.resUrls"
                type="content"
                :limit="3"
                :multiple="true"
                :auto-upload="false"
                type-name="task"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" fixed="right">
            <template slot-scope="scope">
              <el-button
                v-if="scope.$index != '0'"
                size="mini"
                type="danger"
                @click="handleDelete(scope.row, scope.$index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <template v-if="ruleForm.typeCode == 55122">
          <el-alert
            title="其他要求"
            type="info"
            class="el-alert"
            :closable="false"
          />

          <el-form-item label="任务结果要求：" prop="taskResultDesc">
            <el-input
              v-model="ruleForm.taskResultDesc"
              type="textarea"
              :rows="2"
              maxlength="50"
              show-word-limit
              placeholder="请描述提交任务结果的要求"
            />
          </el-form-item>
          <el-form-item label="任务结果图片参考：" prop="taskResultDescResUrls">
            <upload-file
              ref="uploadExplain"
              v-model="ruleForm.taskResultDescResUrls"
              type="content"
              :limit="3"
              :multiple="true"
              :auto-upload="false"
              type-name="task"
            />
            <span style="margin-left: 30px; color: #b5b5b5">
              请上传结果图片参考，最多上传3张图片
            </span>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button @click="resetForm">取消</el-button>
          <el-button
            type="primary"
            :disabled="loading"
            :loading="loading"
            @click="submitForm('ruleForm')"
          >
            确定
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-scrollbar>
</template>

<script>
import GulidRelation from "../components/GulidRelation";
// 引入地区查询接口
import { getAreaNationwideTree } from "@/api/area";
import { getTaskTypeAll } from "@/api/task/type";
import {
  addTask,
  upTask,
  getTaskById,
  getSuretyType,
  getGroupType,
  getNodeResult,
} from "@/api/task/list";

import UploadFile from "@/components/Upload-File/upload";

import { mapGetters } from "vuex";

import { findTag } from "@/util/deltag";

export default {
  components: {
    UploadFile,
    GulidRelation,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    // var countRule = (rule, value, callback) => {
    // var handle = typeof (value * 1);
    // var type = isNaN(value * 1) ? false : handle;
    // console.log(value, value * 1, handle);
    // if ((!value && value != 0) || value === "") {
    //   callback(new Error("请输入可上传图片张数"));
    // } else if (type !== "number" || value > 9) {
    //   callback(new Error("输入的数值需要小于9哦"));
    // } else {
    //   callback();
    // }
    // };
    return {
      sellerId: "",
      loading: false,
      radio: "",
      BMap: null,
      map: null,
      mk: "",
      ruleForm: {
        // 任务周期
        cycle: undefined,
        // 经纬度
        lat: 0,
        lng: 0,
        // 所属地域
        location: undefined,
        locationCode: undefined,
        // 领取该任务的最大人数
        personNum: undefined,
        // 任务说明
        taskDesc: undefined,
        // 任务名称
        taskName: undefined,
        // 任务目标(个)
        taskTarget: undefined,
        // 任务类型编码
        typeCode: undefined,
        // 任务单价(元)
        unitPrice: undefined,
        // 任务米粒
        unitIntegral: undefined,
        // 任务预算
        budget: undefined,
        // 指定人群
        applyUser: undefined,
        // 任务步骤信息
        taskSteps: [],

        //关联公会ID
        unionIds: [],
        // 任务结果节点信息
        resultNodes: [
          {
            // 是否是结算点
            isSettlement: true,
            // 是否需要审核
            needAudit: true,
            // 图片张数
            // needImageCount: "",
            needImageCountMax: "",
            needImageCountMin: "",
            // 说明描叙
            nodeDesc: "",
            // 节点名称
            nodeName: "",
            // 节点排序
            nodeSort: "",
            // 说明示例图列表
            egImage: [],
          },
        ],
        // 创客实名要求 false-不需要、true-需要
        realAuth: false,
        cancelReceivePeriod: null,
        cancelReceiveType: "unlimited",
        // (unlimited:不限制; period_time:超时放弃)
        taskResultDesc: undefined,
        taskResultDescResUrls: [],
        // 初始渠道价
        initialPrice: undefined,
        // 任务保证金金额
        suretyAmount: undefined,
        // 任务保证金类型
        suretyType: undefined,
      },
      bondTypeArr: [],
      // 用户群体类型
      getGroupArr: [],
      rules: {
        taskName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          {
            min: 3,
            max: 30,
            message: "长度在 3 到 30 个字符",
            trigger: "blur",
          },
        ],
        taskDesc: [
          { required: true, message: "请填写任务说明", trigger: "blur" },
        ],
        typeCode: [
          { required: true, message: "请选择任务类型", trigger: "change" },
        ],
        suretyType: [
          { required: true, message: "请选择保证金类型", trigger: "change" },
        ],
        suretyAmount: [
          { required: true, message: "请填写保证金金额", trigger: "change" },
        ],
        locationCode: [
          { required: true, message: "请选择区域", trigger: "change" },
        ],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
        personNum: [
          {
            required: true,
            message: "请输入任务最大领取人数",
            trigger: "blur",
          },
        ],
        taskTarget: [
          { required: true, message: "请输入任务目标", trigger: "blur" },
        ],
        unitPrice: [
          { required: true, message: "请输入任务单价", trigger: "blur" },
        ],
        budget: [
          { required: true, message: "请输入任务预算", trigger: "blur" },
        ],
        cycle: [
          { required: true, message: "请填写合作周期", trigger: "change" },
        ],
        taskResultDesc: [
          {
            required: true,
            message: "请填写任务上传结果说明",
            trigger: "change",
          },
        ],
        realAuth: [{ required: true, message: "请选择", trigger: "change" }],
        cancelReceiveType: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        nodeName: [
          {
            required: true,
            message: "请输入节点名称",
            trigger: ["blur", "change"],
          },
        ],
        isSettlement: [
          {
            required: true,
            message: "请选择是否为结算点",
            trigger: "change",
          },
        ],
        needAudit: [
          {
            required: true,
            message: "请选择是否需要审核",
            trigger: "change",
          },
        ],
        // needImageCount: [
        //   {
        //     required: true,
        //     validator: countRule,
        //     trigger: ["blur", "change"],
        //   },
        // ],
      },
      taskTypeAll: [],
      searchRecords:
        JSON.parse(window.sessionStorage.getItem("mewooo-mobile-records")) ||
        [],
      // 省市区联动
      locationNameList: {
        checkStrictly: true,
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          const parentId = !node.value ? "-1" : node.value;
          setTimeout(() => {
            getAreaNationwideTree({
              parentId: parentId,
              lazy: true,
              includeZhCode: true,
            }).then((res) => {
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
      tableData: [
        {
          stepDesc: "",
          stepTitle: "",
          stepLink: "",
          resUrls: [],
        },
      ],
      formLoading: false,
      // 节点表格显示
      nodeIsShow: false,
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  created() {
    this.initTaskTypeAll();
    this._getSuretyType();
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id;
      this.$nextTick(() => {
        this.sellerId = id;
        this.getTaskDetail(id);
      });
    }
  },
  methods: {
    // 地图初始化回调
    onReady({ BMap, map }) {
      this.BMap = BMap;
      this.map = map;
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
      this.ruleForm.address = item.title;
      this.ruleForm.lat = item.point.lat;
      this.ruleForm.lng = item.point.lng;
      this.map.clearOverlays();
      this.mk = new this.BMap.Marker(item.point);
      this.map.addOverlay(this.mk);
      this.map.panTo(item.point);
    },
    // 获取保证金缴纳类型
    _getSuretyType() {
      const _this = this;
      getSuretyType().then((res) => {
        _this.bondTypeArr = res.data.data;
      });
      getGroupType().then((res) => {
        this.getGroupArr = res.data.data;
      });
    },
    // 非金额数据进行过滤
    asynchronousValidation(e) {
      e = e.match(/^\d*(\.?\d{0,2})/g)[0] || null;
      return e;
    },
    async submitForm(formName) {
      const _this = this;
      _this.loading = true;
      // 判断节点图片张数
      let resultNodes = _this.ruleForm.resultNodes;
      for (let i in resultNodes) {
        if (
          resultNodes[i].needImageCountMax < resultNodes[i].needImageCountMin
        ) {
          _this.$message.warning("节点最大上传图片张数需大于最小上传张数");
          _this.loading = false;
          return;
        }
      }
      // 判断
      if (this.ruleForm.applyUser !== "union") {
        if (this.ruleForm.cancelReceiveType === "period_time") {
          if (!this.ruleForm.cancelReceivePeriod) {
            _this.$message.warning("请填写超时时间");
            return;
          }
        } else {
          this.ruleForm.cancelReceivePeriod = null;
        }
      } else {
        this.ruleForm.cancelReceivePeriod = null;
        this.ruleForm.cancelReceiveType = null;
      }
      await this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.ruleForm.taskSteps = [];
          _this
            ._initCycleStep()
            .then(() => {
              if (_this.sellerId) {
                _this.handleEdit();
              } else {
                _this.handleAdd();
              }
            })
            .catch(() => {
              _this.loading = false;
              return false;
            });
        } else {
          _this.loading = false;
          return false;
        }
      });
    },

    // 循环获取步骤信息
    async _initCycleStep() {
      const _this = this;
      for (let index = 0, len = _this.tableData.length; index < len; index++) {
        const element = _this.tableData[index];
        // const upload = 'upload' + index
        // const uploadParams = this.$refs[upload].imgURL
        // console.log(element, element)
        // uploadParams.forEach((item, indexs) => {
        //   element.resUrls[indexs] = item
        //   console.log(upload, item)
        // })
        _this.ruleForm.resultNodes.forEach((item, idx) => {
          item.nodeSort = idx + 1;
        });
        _this.ruleForm.taskSteps.push(element);
        if (
          element.stepDesc ||
          element.stepLink ||
          element.stepTitle ||
          element.resUrls.length > 0
        ) {
          _this.loading = false;
        } else {
          _this.loading = false;
          _this.$message.warning("步骤必须填写至少一项");
        }
      }
    },

    // 查询详情
    getTaskDetail(id) {
      this.formLoading = this.nodeIsShow = true;
      getTaskById(id).then((res) => {
        this.ruleForm = res.data.data;
        delete this.ruleForm.typeName;
        const latLngs = res.data.data.location;
        this.ruleForm.locationCode = latLngs.split(",").map(Number);
        this.ruleForm.taskTarget =
          this.ruleForm.taskTarget === 0 ? undefined : this.ruleForm.taskTarget;
        this.ruleForm.personNum =
          this.ruleForm.personNum === 0 ? undefined : this.ruleForm.personNum;
        // this.$refs.uploadExplain.loadImg(this.ruleForm.taskResultDescResUrls)
        this.tableData = this.ruleForm.taskSteps;
        this.$nextTick(() => {
          // 图片回显处理
          this.tableData.forEach((item, index) => {
            const upload = "upload" + index;
            this.$refs[upload].loadImg(item.resUrls);
          });
          this.ruleForm.resultNodes.forEach((ritem, ridx) => {
            if (ritem.needImageCountMax > ritem.needImageCountMin) {
              this.$refs["nodeImgs" + ridx].loadImg(ritem.egImage);
            }
          });
        });
        this.formLoading = this.nodeIsShow = false;
      });
    },
    relationFunc(data) {
      this.ruleForm.unionIds = data;
    },
    // 新增
    async handleAdd() {
      const _this = this;
      addTask(_this.ruleForm)
        .then(() => {
          _this.loading = false;
          this.$message.success("添加成功");
          _this.resetForm();
        })
        .catch(() => {
          _this.loading = false;
        });
    },
    // 省市区选择事件
    handleChange() {
      if (this.ruleForm.locationCode) {
        this.ruleForm.location = this.ruleForm.locationCode.join();
      }
    },
    // 修改
    async handleEdit() {
      const _this = this;
      upTask(this.ruleForm)
        .then(() => {
          _this.loading = false;
          this.$message.success("修改成功");
          _this.resetForm();
        })
        .catch(() => {
          _this.loading = false;
        });
    },
    resetForm() {
      // this.$refs.ruleForm.resetFields();
      this.ruleForm = {
        cycle: undefined,
        location: undefined,
        locationCode: undefined,
        personNum: undefined,
        taskDesc: undefined,
        taskName: undefined,
        taskTarget: undefined,
        typeCode: undefined,
        unitPrice: undefined,
        // 任务预算
        budget: undefined,
        cancelReceivePeriod: null,
        cancelReceiveType: null,
        // (unlimited:不限制; period_time:超时放弃)
        // 指定人群
        applyUser: undefined,
        taskSteps: [],
        realAuth: false,
        taskResultDesc: undefined,
        taskResultDescResUrls: [],
      };
      this.tableData = [
        {
          stepDesc: "",
          stepTitle: "",
          stepLink: "",
          resUrls: [],
        },
      ];
      let value = this.$route.fullPath;

      let { tag } = findTag(value);

      this.$store.commit("DEL_TAG", tag);
      this.$router.go(-1);
    },

    // 查询任务类型
    initTaskTypeAll() {
      getTaskTypeAll()
        .then((resp) => {
          const page = resp.data.data;
          this.taskTypeAll = page;
        })
        .catch(() => {});
    },
    // 添加任务步骤
    onIncrease() {
      const item = {
        stepDesc: "",
        stepTitle: "",
        stepLink: "",
        resUrls: [],
      };
      this.tableData.push(item);
    },
    // 移除任务步骤
    handleDelete(row, index) {
      this.tableData.splice(index, 1);
    },
    // 添加节点信息
    addNodes() {
      if (this.ruleForm.resultNodes.length < 9) {
        const item = {
          // 是否是结算点
          isSettlement: true,
          // 是否需要审核
          needAudit: true,
          // 图片张数
          // needImageCount: "",
          needImageCountMax: "",
          needImageCountMin: "",
          // 说明描叙
          nodeDesc: "",
          // 节点名称
          nodeName: "",
          // 节点排序
          nodeSort: "",
          // 说明示例图列表
          egImage: [],
        };
        this.ruleForm.resultNodes.push(item);
      }
    },
    // 移除节点信息
    delNodes(row, index) {
      this.ruleForm.resultNodes.splice(index, 1);
      if (this.ruleForm.resultNodes.length < 2) {
        this.ruleForm.resultNodes[0].isSettlement = true;
        this.ruleForm.resultNodes[0].needAudit = true;
      }
    },
    // 可上传图片最小张数变化
    countChange(idx) {
      let needImageCountMin = this.ruleForm.resultNodes[idx].needImageCountMin;
      let needImageCountMax = this.ruleForm.resultNodes[idx].needImageCountMax;
      if (!needImageCountMin) {
        this.ruleForm.resultNodes[idx].needImageCountMin = 0;
        return;
      }
      if (needImageCountMin && needImageCountMin < 2) {
        this.$message.warning("上传图片最小张数不能小于2张");
        return;
      }
      console.debug("needImageCountMin", needImageCountMin, needImageCountMax);
      if (needImageCountMin > needImageCountMax && needImageCountMax) {
        this.$message.warning("上传图片最小张数不能大于最大张数");
        return;
      }
      this.ruleForm.resultNodes[idx].egImage = [];
      // this.$refs["nodeImgs" + idx].loadImg([]);
    },
    // 可上传图片最大张数变化
    countChange1(idx) {
      let needImageCountMax = this.ruleForm.resultNodes[idx].needImageCountMax;
      let needImageCountMin = this.ruleForm.resultNodes[idx].needImageCountMin;
      if (!needImageCountMax) {
        this.ruleForm.resultNodes[idx].needImageCountMax = 0;
        return;
      }
      if (needImageCountMax && needImageCountMax < 2) {
        this.$message.warning("上传图片最小张数不能小于2张");
        return;
      }
      console.debug("进来了", needImageCountMin > needImageCountMax);
      if (needImageCountMin > needImageCountMax) {
        this.$message.warning("上传图片最小张数不能大于最大张数");
        return;
      }
      if (needImageCountMin > needImageCountMax && needImageCountMin) {
        this.$message.warning("上传图片最大张数不能小于最小张数");
        return;
      }
      this.ruleForm.resultNodes[idx].egImage = [];
      // this.$refs["nodeImgs" + idx].loadImg([]);
    },
    // 任务类型更变
    typeChange(val) {
      if (val == "abc_store") {
        this.nodeIsShow = true;
        getNodeResult(val).then((res) => {
          if (res) {
            res.data.data.forEach((item) => {
              item.needImageCountMax = item.needImageCountMax
                ? item.needImageCountMax
                : 0;
              item.needImageCountMin = item.needImageCountMin
                ? item.needImageCountMin
                : 0;
            });
            this.ruleForm.resultNodes = res.data.data;
            console.debug(
              "this.ruleForm.resultNodes",
              this.ruleForm.resultNodes
            );
          }
          this.nodeIsShow = false;
          this.$nextTick(() => {
            this.ruleForm.resultNodes.forEach((citem, cidx) => {
              if (Array.isArray(citem.egImage) && citem.egImage.length > 0) {
                this.$refs["nodeImgs" + cidx].loadImg(citem.egImage);
                console.log(citem, cidx);
              }
            });
          });
        });
      } else {
        this.ruleForm.resultNodes = [];
      }
    },
    // 关联公会
    add_relationGuild() {
      console.debug("address", this.ruleForm.address, this.ruleForm);
      if (!this.ruleForm.locationCode) {
        this.$message.warning("请选择区域");
        return;
      }
      this.$refs.guildRelation.open();
    },
  },
};
</script>

<style scoped lang="scss">
.tem-container {
  background-color: white;
  margin: 10px 20px;
  padding: 30px;
}
.el-alert {
  margin-bottom: 20px;
}

.el-alert-right {
  position: absolute;
  top: 7px;
  right: 15px;
}

.bond-raido {
  display: flex;
  flex-direction: column;
  .bond-raido-single {
    display: inline-flex;
  }
}
.bond-raido label {
  margin-bottom: 5px;
  line-height: 30px;
}
.map {
  width: 70%;
  height: 300px;
  background-color: #000;
}
::v-deep .el-table__cell .el-form-item {
  // margin: 0;
  .el-form-item__content {
    margin: 0 !important;
  }
}
.relation-Union {
  background-color: #f2f2f2;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  width: 100%;
  // margin-left: 100px;
  box-sizing: border-box;
  padding: 10px 0px;
}
.relation-label {
  font-size: 12px;
  margin-left: 10px;
  margin-right: 20px;
}
.relation-input {
  margin-right: 10px;
  font-size: 12px;
}
</style>
