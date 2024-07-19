<template>
  <div class="main-content">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-form-item v-if="!isEdit">
        <el-checkbox v-model="ruleForm.syncOfficialStore"
          >同步到平台自营</el-checkbox
        >
      </el-form-item>

      <el-form-item label="商品类型：" prop="cateId" :rules="rules.cateId">
        <el-cascader
          v-model="ruleForm.cateId"
          :options="cateTreeAll"
          :props="{ checkStrictly: false, value: 'cateId', label: 'cateName' }"
          style="width: 300px"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item
        label="商品名称："
        prop="productName"
        :rules="rules.productName"
      >
        <el-input
          v-model="ruleForm.productName"
          style="width: 300px"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品图：" prop="images" :rules="rules.images">
        <upload-wrap
          ref="uploadImage"
          v-model="ruleForm.images"
          type="content"
          :limit="9"
          :multiple="true"
          :auto-upload="false"
          type-name="image"
        />
      </el-form-item>
      <el-form-item label="品牌名称：" prop="brandId" :rules="rules.brandId">
        <el-select
          v-model="ruleForm.brandId"
          placeholder="请选择商品品牌"
          style="width: 300px"
        >
          <el-option
            v-for="(item, index) in brandAll"
            :key="index"
            :label="item.brandName"
            :value="item.brandId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="商品条码编号："
        prop="productCode"
        :rules="rules.productCode"
      >
        <el-input
          v-model="ruleForm.productCode"
          style="width: 300px"
          maxlength="13"
          placeholder="请输入商品条码编号"
        ></el-input>
      </el-form-item>
      <el-form-item label="产品参数：" required>
        <el-card shadow="never" :body-style="{ padding: '10px' }">
          <div
            v-for="(item, index) in ruleForm.paramsList"
            :key="index"
            class="specs-item"
          >
            <el-form ref="domainForm" :model="item" :rules="domains">
              <el-form-item
                label="参数名"
                prop="paramsName"
                :rules="rules.paramsName"
              >
                <el-input
                  v-model="item.paramsName"
                  style="width: 300px"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="参数值"
                prop="paramsValue"
                :rules="rules.paramsValue"
              >
                <el-input
                  v-model="item.paramsValue"
                  style="width: 300px"
                ></el-input>
              </el-form-item>
              <i
                class="icon el-icon-circle-close spec-deleted"
                @click="delParameter(index)"
              ></i>
            </el-form>
          </div>
          <div v-if="specList.length < 10">
            <el-button @click="addParameter">添加参数项目</el-button>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="商品规格：">
        <!-- 统一默认设置 -->
        <el-card shadow="never" :body-style="{ padding: '10px' }">
          <div
            v-for="(item, index) in specList"
            :key="index"
            class="specs-item"
          >
            <el-form-item label="规格名：" prop="specId">
              <el-select
                v-model="item.specId"
                :disabled="isEdit"
                filterable
                placeholder="请选择"
                @change="addSpec($event, index)"
              >
                <el-option
                  v-for="spec in specAll"
                  :key="spec.specId"
                  :label="spec.specName"
                  :value="spec.specId"
                  :disabled="spec.status"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="规格值：">
              <el-tag
                v-for="(child, j) in item.values"
                :key="j"
                :closable="child.valueId ? false : true"
                style="margin-right: 10px"
                @close="delSpecValue(index, j)"
                >{{ child.specValue }}</el-tag
              >
              <el-input
                v-model="childItem[index]"
                style="width: 192px"
                placeholder="请输入规格值"
                @keyup.enter.native="addSpecTag(index)"
              >
                <el-button
                  slot="append"
                  type="primary"
                  @click="addSpecTag(index)"
                  >添加</el-button
                >
              </el-input>
            </el-form-item>
            <i
              v-if="!isEdit"
              class="icon el-icon-circle-close spec-deleted"
              @click="delSpecs(index)"
            />
          </div>

          <div v-if="specList.length < 5">
            <el-button v-if="!isEdit" @click="increaseSpecs"
              >添加规格值</el-button
            >
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="规格明细：">
        <el-card>
          <el-row class="" type="flex" :gutter="10">
            <el-col style="text-align: right">批量设置：</el-col>
            <el-col
              ><el-input
                v-model="defaultData.goodsCode"
                placeholder="请输入商品编号"
                size="mini"
              ></el-input
            ></el-col>
            <el-col>
              <el-input
                v-model="defaultData.costPrice"
                placeholder="请输入成本价"
                size="mini"
                @input="
                  defaultData.costPrice = asynchronousValidation(
                    defaultData.costPrice
                  )
                "
              >
              </el-input>
            </el-col>
            <el-col>
              <el-input
                v-model="defaultData.salePrice"
                placeholder="请输入商品售价"
                size="mini"
                @input="
                  defaultData.salePrice = asynchronousValidation(
                    defaultData.salePrice
                  )
                "
              >
              </el-input>
            </el-col>
            <el-col>
              <el-input
                v-model="defaultData.vipPrice"
                placeholder="请输入商品会员价"
                size="mini"
                @input="
                  defaultData.vipPrice = asynchronousValidation(
                    defaultData.vipPrice
                  )
                "
              >
              </el-input>
            </el-col>
            <el-col>
              <el-input
                v-model="defaultData.integral"
                placeholder="请输入商品米粒"
                size="mini"
                @input="
                  defaultData.integral = asynchronousValidation(
                    defaultData.integral
                  )
                "
              >
              </el-input>
            </el-col>
            <el-col
              ><el-button size="mini" type="primary" @click="uniteSet"
                >确定</el-button
              ></el-col
            >
          </el-row>
        </el-card>
        <el-table
          v-if="specTabelShow"
          :empty-text="$t('message.table_empty_text')"
          :data="productSpec"
          border
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          style="width: 100%"
          :row-style="{ height: '180px' }"
        >
          <el-table-column v-for="(item, index) in specList" :key="index">
            <template slot="header" slot-scope="scope">
              {{ getSpecName(index, scope.$index) }}
            </template>
            <template slot-scope="scope">
              <span>{{ getSpecAttr(index, scope.$index)['specValue'] }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header">
              <span style="color: rgb(245, 108, 108); margin-right: 5px"
                >*</span
              >
              <span>商品编号</span>
            </template>
            <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.goodsCode" placeholder="请输入" />
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" width="200">
            <template slot="header">
              <span style="color: rgb(245, 108, 108); margin-right: 5px"
                >*</span
              >
              <span>规格图片</span>
            </template>
            <template slot-scope="scope">
              <upload-wrap
                :ref="'upload' + scope.$index"
                v-model="scope.row.goodsImage"
                :limit="1"
              />
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header">
              <span style="color: rgb(245, 108, 108); margin-right: 5px"
                >*</span
              >
              <span>成本价（元）</span>
            </template>
            <template slot-scope="scope">
              <span>
                <el-input
                  v-model="scope.row.price.costPrice"
                  placeholder="请输入"
                  @input="
                    scope.row.price.costPrice = asynchronousValidation(
                      scope.row.price.costPrice
                    )
                  "
                />
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header">
              <span style="color: rgb(245, 108, 108); margin-right: 5px"
                >*</span
              >
              <span>商品售价（元）</span>
            </template>
            <template slot-scope="scope">
              <span>
                <el-input
                  v-model="scope.row.price.salePrice"
                  placeholder="请输入"
                  @input="
                    scope.row.price.salePrice = asynchronousValidation(
                      scope.row.price.salePrice
                    )
                  "
                />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="商品会员价（元）" align="center">
            <template slot-scope="scope">
              <span>
                <el-input
                  v-model="scope.row.price.vipPrice"
                  placeholder="请输入"
                  @input="
                    scope.row.price.vipPrice = asynchronousValidation(
                      scope.row.price.vipPrice
                    )
                  "
                />
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header">
              <span style="color: rgb(245, 108, 108); margin-right: 5px"
                >*</span
              >
              <span>商品米粒</span>
            </template>
            <template slot-scope="scope">
              <span>
                <el-input
                  v-model="scope.row.price.integral"
                  placeholder="请输入"
                  @input="
                    scope.row.price.integral = asynchronousValidation(
                      scope.row.price.integral
                    )
                  "
                />
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item
        label="商品详情："
        prop="detailImages"
        :rules="rules.detailImages"
      >
        <upload-wrap
          ref="uploadExplain"
          v-model="ruleForm.detailImages"
          type="content"
          :limit="9"
          :multiple="true"
          :auto-upload="false"
          type-name="image"
        />
      </el-form-item>
      <template v-if="isShow">
        <el-form-item label="限购：" prop="limitBuyNum">
          <span class="nav-item-label-left">每人限购</span>
          <el-input
            v-model.number="ruleForm.limitBuyNum"
            type="number"
            min="0"
            style="width: 120px"
          />
          <span class="nav-item-label-right">件</span>
          <span class="set-tip"
            >未填写限购数量，则系统默认不限制购买数量。</span
          >
        </el-form-item>
        <el-form-item label="起售：" prop="startSaleNum">
          <span class="nav-item-label-left">至少</span>
          <el-input
            v-model.number="ruleForm.startSaleNum"
            min="0"
            style="width: 120px"
          />
          <span class="nav-item-label-right">件起售</span>
          <span class="set-tip">未填写起售数量，则系统默认起售数量为1</span>
        </el-form-item>
        <el-form-item
          label="实付金额返米粒："
          prop="integralConf.amountBackType"
        >
          <el-radio-group
            v-model="ruleForm.integralConf.amountBackType"
            @change="paidBackFunction"
          >
            <el-radio label="fixed">
              <span class="nav-item-label-left">定额 购买返</span>
              <el-input
                v-model="integralConf.amountBackFixed"
                min="0.00"
                :disabled="ruleForm.integralConf.amountBackType !== 'fixed'"
                style="width: 200px"
                @input="
                  integralConf.amountBackFixed = asynchronousValidation(
                    integralConf.amountBackFixed
                  )
                "
                @blur="
                  ruleForm.integralConf.amountBackValue =
                    integralConf.amountBackFixed
                "
              >
                <span slot="suffix" class="el-input__icon">米粒</span>
              </el-input>
            </el-radio>
            <el-radio label="ratio">
              <span class="nav-item-label-left">比例 返商品售价的</span>
              <el-input
                v-model="integralConf.amountBackRatio"
                min="0.00"
                :disabled="ruleForm.integralConf.amountBackType !== 'ratio'"
                style="width: 200px"
                @input="
                  integralConf.amountBackRatio = asynchronousValidation(
                    integralConf.amountBackRatio
                  )
                "
                @blur="
                  ruleForm.integralConf.amountBackValue =
                    integralConf.amountBackRatio
                "
              >
                <span slot="suffix" class="el-input__icon">%</span>
              </el-input>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="实付米粒返米粒："
          prop="integralConf.integralBackType"
        >
          <el-radio-group
            v-model="ruleForm.integralConf.integralBackType"
            @change="integralBackFunction"
          >
            <el-radio label="fixed">
              <span class="nav-item-label-left">定额 购买返</span>
              <el-input
                v-model="integralConf.integralBackFixed"
                min="0.00"
                :disabled="ruleForm.integralConf.integralBackType !== 'fixed'"
                style="width: 200px"
                @input="
                  integralConf.integralBackFixed = asynchronousValidation(
                    integralConf.integralBackFixed
                  )
                "
                @blur="
                  ruleForm.integralConf.integralBackValue =
                    integralConf.integralBackFixed
                "
              >
                <span slot="suffix" class="el-input__icon">米粒</span>
              </el-input>
            </el-radio>
            <el-radio label="ratio">
              <span class="nav-item-label-left">比例 返商品售价的</span>
              <el-input
                v-model="integralConf.integralBackRatio"
                min="0.00"
                :disabled="ruleForm.integralConf.integralBackType !== 'ratio'"
                style="width: 200px"
                @input="
                  integralConf.integralBackRatio = asynchronousValidation(
                    integralConf.integralBackRatio
                  )
                "
                @blur="
                  ruleForm.integralConf.integralBackValue =
                    integralConf.integralBackRatio
                "
              >
                <span slot="suffix" class="el-input__icon">%</span>
              </el-input>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="会员返米粒规则：" prop="integralConf.vipBackType">
          <el-radio-group
            v-model="ruleForm.integralConf.vipBackType"
            @change="vipBackFunction"
          >
            <el-radio label="fixed">
              <span class="nav-item-label-left">定额 购买返</span>
              <el-input
                v-model="integralConf.vipBackFixed"
                min="0.00"
                :disabled="ruleForm.integralConf.vipBackType !== 'fixed'"
                style="width: 200px"
                @input="
                  integralConf.vipBackFixed = asynchronousValidation(
                    integralConf.vipBackFixed
                  )
                "
                @blur="
                  ruleForm.integralConf.vipBackValue = integralConf.vipBackFixed
                "
              >
                <span slot="suffix" class="el-input__icon">米粒</span>
              </el-input>
            </el-radio>
            <el-radio label="ratio">
              <span class="nav-item-label-left">比例 返商品售价的</span>
              <el-input
                v-model="integralConf.vipBackRatio"
                min="0.00"
                :disabled="ruleForm.integralConf.vipBackType !== 'ratio'"
                style="width: 200px"
                @input="
                  integralConf.vipBackRatio = asynchronousValidation(
                    integralConf.vipBackRatio
                  )
                "
                @blur="
                  ruleForm.integralConf.vipBackValue = integralConf.vipBackRatio
                "
              >
                <span slot="suffix" class="el-input__icon">%</span>
              </el-input>
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
      <el-form-item v-if="permissions.product_add">
        <el-button
          type="primary"
          :disabled="loading"
          :loading="loading"
          @click="submitForm('ruleForm')"
          >保存</el-button
        >
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { reqSpecCateById } from '@/api/product/specs'
import { reqBrandById } from '@/api/product/brand'
import { mapGetters } from 'vuex'
import { selectCateTree } from '@/api/product/classify'
import {
  upProduct,
  reqProductDetailById,
  editProduct
} from '@/api/product/wares'
import { findTag } from '@/util/deltag'

export default {
  name: 'SkuWrap',
  components: {
    UploadWrap: resolve => {
      return require(['@/components/Upload-File/upload.vue'], resolve)
    }
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    isProduct: {
      type: Boolean,
      default: false
    },
    // 从商品管理模块进入不显示
    isShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    var validateCode = (rule, value, callback) => {
      const reg = /^69\d{11}$/
      if (!reg.test(value)) {
        callback(new Error('商品条码编号以数字69开头，后面跟着11位数字！'))
      }
      // 商品条码编号最后一位
      const C0 = value.toString().charAt(value.length - 1)
      // 奇数位的数据
      let C1 = 0
      // 偶数位的数据
      let C2 = 0
      // 奇数位与偶数位的三倍和
      let C3 = 0

      for (let i = 0; i < value.length - 1; i++) {
        const element = value[i]
        if (i % 2 === 0) {
          C1 = Number(C1) + Number(element)
        } else {
          C2 = Number(C2) + Number(element)
        }
      }
      C3 = C1 + C2 * 3
      const d = C3.toString()
      const C4 = 10 - (d.charAt(d.length - 1) - 0)
      if (Number(C0) === Number(C4)) {
        callback()
      } else {
        callback(new Error('商品条码编号错误，请重新输入'))
      }
    }
    return {
      // 商品分类
      cateTreeAll: [],
      // 添加已有的规格子类输入框
      childItem: [],
      // 规格总览
      specList: [],
      // 规格缓存，用于规格名修改时移除规格明细中之前的规格谁项数据
      specsData: [],
      // 控制规格列表显示
      specTabelShow: true,
      // 规格列表
      productSpec: [],
      // 品牌
      brandAll: [],
      ruleForm: {
        syncOfficialStore: false,
        brandId: undefined,
        catePath: undefined,
        cateId: [],
        detailImages: [],
        goodsList: [],
        image: '',
        images: [],
        importantSpecValues: [
          {
            specId: undefined,
            specImg: '',
            specValue: '',
            valueId: undefined
          }
        ],
        integralConf: {
          amountBackType: '',
          amountBackValue: undefined,
          integralBackType: '',
          integralBackValue: undefined,
          vipBackType: '',
          vipBackValue: undefined
        },
        limitBuyNum: undefined,
        otherSpecValues: [
          {
            specId: undefined,
            specImg: '',
            specValue: '',
            valueId: undefined
          }
        ],
        paramsList: [
          {
            paramsId: undefined,
            paramsName: '',
            paramsValue: ''
          }
        ],
        productCode: '',
        productId: undefined,
        productName: '',
        startSaleNum: undefined
      },
      defaultData: {
        // 统一设置信息
        goodsCode: '', //商品编号
        costPrice: '', //成本价
        salePrice: '', // 商品销价
        vipPrice: '', //会员价
        integral: 0 // 商品米粒
      },
      // 全部规格
      specAll: [],
      integralConf: {
        amountBackFixed: undefined,
        amountBackRatio: undefined,
        integralBackFixed: undefined,
        integralBackRatio: undefined,
        vipBackFixed: undefined,
        vipBackRatio: undefined
      },
      loading: false,
      tableLoading: false,
      rules: {
        cateId: [
          { required: true, message: '请选择商品类型', trigger: 'change' }
        ],
        productName: [
          { required: true, message: '请输入商品名称', trigger: 'change' },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'change'
          }
        ],
        images: [
          { required: true, message: '商品图不为空', trigger: 'change' }
        ],

        brandId: [
          { required: true, message: '请选择品牌名称', trigger: 'change' }
        ],
        productCode: [
          { required: true, validator: validateCode, trigger: 'blur' }
        ],
        detailImages: [
          { required: true, message: '商品详情图片不能为空', trigger: 'change' }
        ]
      },
      domains: {
        paramsName: [
          { required: true, message: '参数名不为空', trigger: 'change' }
        ],
        paramsValue: [
          { required: true, message: '参数值不为空', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.getCateTree()
    this.getBrandAll()
    this.getSpecsAll()
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.getList(id)
    }
  },
  methods: {
    // 非金额数据进行过滤
    asynchronousValidation(e) {
      e = e.match(/^\d*(\.?\d{0,2})/g)[0] || null
      return e
    },
    // 根据id查询品牌
    getBrandAll() {
      const query = {
        cateId: null
      }
      reqBrandById(query).then(resp => {
        this.brandAll = resp.data.data
      })
    },
    // 根据id查询规格
    getSpecsAll() {
      const query = {
        cateId: null
      }
      reqSpecCateById(query).then(resp => {
        this.specAll = resp.data.data.saleSpecs
        for (let index = 0; index < this.specAll.length; index++) {
          const element = this.specAll[index]
          element.status = false
        }
      })
    },
    // 查询商品类目
    getCateTree() {
      selectCateTree().then(resp => {
        const nodes = resp.data.data
        for (let index = 0; index < nodes.length; index++) {
          const element = nodes[index]
          if (element.status === 'normal') {
            element.disabled = false
          } else {
            element.disabled = true
          }
          // 判定是否存在子类
          if (!element.children) {
            element.children = undefined
          } else {
            for (let i = 0; i < element.children.length; i++) {
              const ele = element.children[i]
              if (ele.status === 'normal') {
                ele.disabled = false
              } else {
                ele.disabled = true
              }
            }
          }
        }
        this.cateTreeAll = nodes
      })
    },
    // 添加商品参数项目,参数项最多十项
    addParameter() {
      if (this.ruleForm.paramsList.length < 10) {
        this.ruleForm.paramsList.push({
          paramsName: '',
          paramsValue: ''
        })
      }
    },
    // 商品类型选择值
    handleChange(val) {
      this.ruleForm.catePath = val.toString()
    },
    // 删除参数项目
    delParameter(index) {
      this.ruleForm.paramsList.splice(index, 1)
    },
    // 统一设置数据
    uniteSet() {
      // defaultData: { // 统一设置信息
      //   goodsCode: '', //商品编号
      //   costPrice: '', //成本价
      //   salePrice: '', // 商品销价
      //   vipPrice: '', //会员价
      //   integral: '' // 商品米粒
      // },
      if (this.productSpec.length === 0) {
        this.$message.warning('请先添加商品规格')
        return
      }
      this.productSpec.forEach((value, index) => {
        this.$set(
          this.productSpec[index],
          'goodsCode',
          this.defaultData.goodsCode
        )
        this.$set(
          this.productSpec[index].price,
          'costPrice',
          this.defaultData.costPrice
        )
        this.$set(
          this.productSpec[index].price,
          'salePrice',
          this.defaultData.salePrice
        )
        this.$set(
          this.productSpec[index].price,
          'vipPrice',
          this.defaultData.vipPrice
        )
        this.$set(
          this.productSpec[index].price,
          'integral',
          this.defaultData.integral
        )
      })
    },
    // 创建新的数据
    addData(val) {
      // const vm = this
      const product = {
        key: '',
        goodsCode: '',
        goodsId: undefined,
        goodsName:this.ruleForm.productName,
        goodsImage: '',
        uploadGoodsImg: '',
        price: {
          costPrice: '',
          currency: '',
          integral: 0,
          priceId: undefined,
          salePrice: '',
          stock: '',
          vipPrice: ''
        },
        saleSpecValues: []
      }
      if (this.specList.length < 2) {
        this.productSpec = []
      }
      // 添加新的规格的时候更新后缀
      this.productSpec.forEach((value, index) => {
        this.productSpec[
          index
        ].key = `${this.productSpec[index].key}_${val.specValue}`
        this.productSpec[index].saleSpecValues.push(val)
      })
      let count = this.countSum(0)
      // 判断当前的规格生成的条数和商品条数是否能对上
      if (count === this.productSpec.length) return
      // 如果有数据需要减1
      if (this.productSpec.length) {
        --count
      }
      // 设计上只有没有数据的时候才会走到这里
      for (let i = 0; i < count; i++) {
        this.productSpec.push({
          ...product,
          key: val.specValue,
          saleSpecValues: [val]
        })
      }
    },
    // 生成id列表
    createIdList(lst, index, list) {
      const idList = []
      if (index === list.length - 1) {
        // 最后一个，也有可能是唯一一个
        // 依次排列数据返回
        lst.forEach(value => {
          idList.push(value.specValue)
        })
      } else {
        // 不是最后一个
        // 取下一级数据
        lst.forEach(value => {
          const childList = this.createIdList(
            list[index + 1].values,
            index + 1,
            list
          )
          childList.forEach(ids => {
            idList.push(`${value.specValue}_${ids}`)
          })
        })
      }
      return idList
    },
    // 生成指定索引开始的id列表，包含自身
    getIndexIdList(key, val) {
      // 索引总数
      // id通过自身传递,不需要包含进数组
      const list = this.specList.slice(key + 1, this.specList.length)
      if (!list.length) {
        return [val]
      }
      let arr = []
      // 循环后面的列表
      arr = this.createIdList(list[0].values, 0, list)
      // 添加前置id
      arr.forEach((value, index) => {
        arr[index] = `${val}_${value.specValue}`
      })
      return arr
    },
    // 生成指定索引向上的id列表，不包含自身
    getBeforeIdList(key) {
      if (key === 0) {
        return []
      }
      const list = this.specList.slice(0, key)
      let arr = []
      // 循环后面的列表
      arr = this.createIdList(list[0].values, 0, list)
      // arr = this.createIdList(list[0], 0, list)
      return arr
    },
    // 更新数据 主规格增加
    updateData(index, val) {
      if (this.specList.length === 1) {
        this.productSpec.push({
          key: val.specValue,
          goodsCode: '',
          goodsId: undefined,
          goodsName:this.ruleForm.productName,
          goodsImage: '',
          uploadGoodsImg: '',
          price: {
            costPrice: '',
            currency: '',
            integral: 0,
            priceId: undefined,
            salePrice: '',
            stock: '',
            vipPrice: ''
          },
          saleSpecValues: [val]
        })
      } else {
        // 前置id列表
        const before = this.getBeforeIdList(index)
        // 后置id列表
        const after = this.getIndexIdList(index, val.specValue)
        // 新增的数据列表
        let allIdList = []
        if (before.length) {
          before.forEach(value => {
            after.forEach(value2 => {
              allIdList.push(`${value}_${value2}`)
            })
          })
        } else {
          allIdList = allIdList.concat(after)
        }
        // 获得数据增加间隔距离
        const space = this.countBeforeNum(index)
        if (before.length) {
          for (let i = 0; i < before.length; i++) {
            const list = allIdList.slice(
              i * after.length,
              (i + 1) * after.length
            )
            list.forEach((value, j) => {
              this.productSpec.splice(
                space + space * i + list.length * i + j,
                0,
                {
                  key: value,
                  goodsCode: '',
                  goodsId: undefined,
                  goodsName:this.ruleForm.productName,
                  goodsImage: '',
                  uploadGoodsImg: '',
                  price: {
                    costPrice: '',
                    currency: '',
                    integral: 0,
                    priceId: undefined,
                    salePrice: '',
                    stock: '',
                    vipPrice: ''
                  },
                  saleSpecValues: this.specSubitem(value)
                }
              )
            })
          }
        } else {
          const list = allIdList.slice(0, after.length)
          list.forEach(value => {
            this.productSpec.push({
              key: value,
              goodsCode: '',
              goodsId: undefined,
              goodsName:this.ruleForm.productName,
              goodsImage: '',
              uploadGoodsImg: '',
              price: {
                costPrice: '',
                currency: '',
                integral: 0,
                priceId: undefined,
                salePrice: '',
                stock: '',
                vipPrice: ''
              },
              saleSpecValues: this.specSubitem(value)
            })
          })
        }
      }
    },

    // 遍历自规格项
    specSubitem(val) {
      const array = val.split('_')
      const subitem = []
      for (let i = 0; i < array.length; i++) {
        const element = array[i]
        const child = {
          specId: this.specList[i].specId,
          specImg: undefined,
          specValue: element,
          valueId: undefined
        }
        subitem.push(child)
      }
      return subitem
    },
    // 判定缓存中是否存在该下标的数据
    subscriptDecision(index) {
      return new Promise(resolve => {
        if (!this.specsData[index]) {
          resolve(false)
        } else {
          const arr = this.specAll.filter(item => {
            if (this.specsData[index] === item.specId) {
              return item
            }
          })
          const array = arr[0].valueDefault.split(';')
          for (let j = array.length - 1; j >= 0; j--) {
            const element = array[j]
            // 如果list只有一个，则替换并删除父级规格，如果有多个则删除
            if (j > 0) {
              for (let i = 0; i < this.productSpec.length; i++) {
                const attr = this.productSpec[i].key.split('_')
                if (attr.includes(element)) {
                  this.productSpec.splice(i, 1)
                  --i
                }
              }
            } else {
              for (let i = 0; i < this.productSpec.length; i++) {
                const attr = this.productSpec[i].key.split('_')
                const listAttr = attr.filter(item => {
                  if (item !== element) {
                    return item
                  }
                })
                let newSku = ''
                listAttr.forEach((value, m) => {
                  if (m > 0) {
                    newSku = `${newSku}_${value}`
                  } else {
                    newSku = value
                  }
                })
                this.productSpec[i].key = newSku
                this.productSpec[i].saleSpecValues.splice(index, 1)
              }
            }
          }
          resolve(!!this.specsData[index])
        }
      })
    },
    // 选择规格名
    addSpec(val, index) {
      // 1、判定当前下标的规格是否存在
      this.subscriptDecision(index)
        .then(() => {
          return true
        })
        .then(() => {
          const arr = this.specAll.filter(item => {
            if (val === item.specId) {
              return item
            }
          })
          // 3、将当前规格添加到规格缓存中
          this.specList[index] = {
            specId: arr[0].specId,
            specName: arr[0].specName,
            values: []
          }
          this.specsData[index] = arr[0].specId

          this.specList[index] = {
            specId: arr[0].specId,
            specName: arr[0].specName,
            values: []
          }
          this.savaSpecStatus()
          // 添加子项
          this.saveSpecChild(index, arr[0].valueDefault)
        })
        .catch(e => {
          this.$notify({
            title: '保存失败',
            message: e.message,
            type: 'error'
          })
        })
    },
    savaSpecStatus() {
      this.specAll.forEach(item => {
        item.status = false
        this.specList.forEach(a => {
          if (a.specId === item.specId) {
            item.status = true
          }
        })
      })
    },
    // 计算子项
    saveSpecChild(index, val) {
      const array = val.split(';')
      for (let i = 0; i < array.length; i++) {
        const element = array[i]
        const child = {
          specId: this.specList[index].specId,
          specImg: undefined,
          specValue: element,
          valueId: undefined
        }
        this.specList[index].values.push(child)
        // this.specList[index].push(child)

        if (i === 0) {
          this.addData(child)
        } else {
          this.childItem[index] = ''
          this.updateData(index, child)
        }
      }
    },
    // 添加已有的规格的规格子类
    addSpecTag(index) {
      const info = this.specList[index]
      if (!info) {
        this.$message('规格值添加异常')
        return
      }
      const child = info.values.filter(
        o => o.specValue === this.childItem.value
      )
      if (child.length) {
        this.$message('请注意，已有该规格')
        return
      }
      const specChild = {
        specId: this.specList[index].specId,
        specImg: undefined,
        specValue: this.childItem[index],
        valueId: undefined
      }
      info.values.push(specChild)
      // info.push(specChild)
      this.childItem[index] = ''
      this.updateData(index, specChild)
    },
    // 计算属性的乘积
    countSum(index) {
      let num = 1
      this.specList.forEach((item, j) => {
        if (j >= index && item.values.length) {
          num *= item.values.length
        }
      })
      return num
    },
    // 计算指定位置同级的数据条数
    countBeforeNum(key) {
      let num = 1
      // 所有的乘积
      const allNum = this.countSum(key)
      if (this.specList[key].length === 1) {
        num = allNum
      } else {
        const list = this.specList[key].values
        num = (allNum / list.length) * (list.length - 1)
      }
      return num
    },
    // 根据传入的属性值，拿到相应规格名
    getSpecName(specIndex) {
      return this.specList[specIndex].specName
    },
    /*
      根据传入的属性值，拿到相应规格的属性
      @params
        specIndex 规格项目在 advancedSpecification 中的序号
        index 所有属性在遍历时的序号
      */
    getSpecAttr(specIndex, index) {
      // 获取当前规格项目下的属性值
      const currentValues = this.specList[specIndex].values
      let indexCopy
      // 判断是否是最后一个规格项目
      if (
        this.specList[specIndex + 1] &&
        this.specList[specIndex + 1].values.length
      ) {
        indexCopy = index / this.countSum(specIndex + 1)
      } else {
        indexCopy = index
      }
      const i = Math.floor(indexCopy % currentValues.length)
      if (i.toString() !== 'NaN') {
        return currentValues[i]
      } else {
        return {
          specValue: ''
        }
      }
    },

    // 添加规格项目
    increaseSpecs() {
      this.specList.push({
        specId: undefined,
        specName: undefined,
        values: []
      })
    },
    // 删除规格项目
    delSpecs(index) {
      const list = this.specList[index].values
      if(list.length>0){
        for (let j = list.length - 1; j >= 0; j--) {
          console.debug('index, j',index, j)
          this.delSpecValue(index, j)
        }
      }else{
        // 如果规格值未填写则直接删除
        if(!list.specValue)
        {
          this.specList.splice(index, 1)
        }
      }
      
      this.savaSpecStatus()
    },
    // 删除规格值
    delSpecValue(key, index) {
      const list = this.specList[key].values
      const id = `${list[index].specValue}`
      // 如果list只有一个，则替换并删除父级规格，如果有多个则删除
      if (list.length > 1) {
        for (let i = 0; i < this.productSpec.length; i++) {
          const attr = this.productSpec[i].key.split('_')
          if (attr.includes(id)) {
            this.productSpec.splice(i, 1)
            --i
          }
        }
        // 删除商品完成之后删除规格
        this.specList[key].values.splice(index, 1)
      } else {
        for (let i = 0; i < this.productSpec.length; i++) {
          const attr = this.productSpec[i].key.split('_')
          const listAttr = attr.filter(item => {
            if (item !== id) {
              return item
            }
          })
          let newSku = ''
          listAttr.forEach((value, j) => {
            if (j > 0) {
              newSku = `${newSku}_${value}`
            } else {
              newSku = value
            }
          })
          this.productSpec[i].key = newSku
          // this.productSpec[i].saleSpecValues = this.specSubitem(newSku)
          this.productSpec[i].saleSpecValues.splice(index, 1)
        }
        this.specList.splice(key, 1)
      }
      this.savaSpecStatus()
    },
    // 实付返米粒
    paidBackFunction(val) {
      if (val === 'fixed') {
        this.integralConf.amountBackFixed = 0
        this.integralConf.amountBackRatio = undefined
      } else if (val === 'ratio') {
        this.integralConf.amountBackFixed = undefined
        this.integralConf.amountBackRatio = 0
      }
    },

    // 实付米粒返米粒
    integralBackFunction(val) {
      if (val === 'fixed') {
        this.integralConf.integralBackFixed = 0
        this.integralConf.integralBackRatio = undefined
      } else if (val === 'ratio') {
        this.integralConf.integralBackFixed = undefined
        this.integralConf.integralBackRatio = 0
      }
    },
    // 会员返米粒
    vipBackFunction(val) {
      if (val === 'fixed') {
        this.integralConf.vipBackFixed = 0
        this.integralConf.vipBackRatio = undefined
      } else if (val === 'ratio') {
        this.integralConf.vipBackFixed = undefined
        this.integralConf.vipBackRatio = 0
      }
    },
    async submitForm(formName) {
      this.loading = true
      // 获取商品图
      const uploadImage = this.$refs.uploadImage.imgURL
      uploadImage.forEach((item, indexs) => {
        this.ruleForm.images[indexs] = item
        if (indexs === 0) {
          this.ruleForm.image = item
        }
      })
      // 获取商品详情图
      const uploadParams = this.$refs.uploadExplain.imgURL
      uploadParams.forEach((item, indexs) => {
        this.ruleForm.detailImages[indexs] = item
      })
      this.ruleForm.goodsList = []
      const uploadSpecIma = this.productSpec
      // 获取上传规格明细图片
      // for (let index = 0, len = uploadSpecIma.length; index < len; index++) {
      //   const element = uploadSpecIma[index]
      //   const upload = 'upload' + index
      //   const tableImages = this.$refs[upload].imgURL
      //   console.debug('tableImages[0]',tableImages[0])
      //   element.saleSpecValues.specImg = tableImages[0]
      //   element.goodsName = this.ruleForm.productName
      //   this.ruleForm.goodsList.push(element)
      // }
      uploadSpecIma.map((item,index)=>{
        item.saleSpecValues.map((item2,index2)=>{
          if(typeof item.goodsImage  ==='string'){
            item2.specImg=item.goodsImage
          }else{
            item2.specImg = item.goodsImage && item.goodsImage.length>0?item.goodsImage[0]:''
          }
        })
      })
      
      this.ruleForm.goodsList = uploadSpecIma
      const arr = this.ruleForm.paramsList
      for (let index = 0; index < arr.length; index++) {
        this.$refs.domainForm[index].validate(valid => {
          if (valid) {
            return true
          } else {
            this.loading = false
            return false
          }
        })
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this._editsubmit(this.ruleForm)
          } else {
            this._submit(this.ruleForm)
          }
        } else {
          this.loading = false
          return false
        }
      })
    },
    // 提交
    _submit(data) {
      const _this = this
      upProduct(data)
        .then(() => {
          _this.loading = false
          _this.$message.success('提交成功')
          _this.resetForm()
          setTimeout(() => {
            let value = this.$route.fullPath

            let { tag } = findTag(value)

            this.$store.commit('DEL_TAG', tag)
            _this.$router.go(-1)
          }, 100)
        })
        .catch(() => {
          _this.loading = false
        })
    },
    _editsubmit(data) {
      const _this = this
      console.debug('编辑',data)
      editProduct(data)
        .then(() => {
          _this.loading = false
          _this.$message.success('提交成功')
          _this.resetForm()
          setTimeout(() => {
            let value = this.$route.fullPath

            let { tag } = findTag(value)

            this.$store.commit('DEL_TAG', tag)
            _this.$router.go(-1)
          }, 100)
        })
        .catch(() => {
          _this.loading = false
        })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
      this.ruleForm = {
        syncOfficialStore: false,
        brandId: undefined,
        catePath: undefined,
        cateId: [],
        detailImages: [],
        goodsList: [],
        image: '',
        images: [],
        importantSpecValues: [
          {
            specId: undefined,
            specImg: '',
            specValue: '',
            valueId: undefined
          }
        ],
        integralConf: {
          amountBackType: '',
          amountBackValue: undefined,
          integralBackType: '',
          integralBackValue: undefined,
          vipBackType: '',
          vipBackValue: undefined
        },
        limitBuyNum: undefined,
        otherSpecValues: [
          {
            specId: undefined,
            specImg: '',
            specValue: '',
            valueId: undefined
          }
        ],
        paramsList: [
          {
            paramsId: undefined,
            paramsName: '',
            paramsValue: ''
          }
        ],
        productCode: '',
        productId: undefined,
        productName: '',
        startSaleNum: undefined
      }
    },
    // 查询详情
    getList(id) {
      reqProductDetailById(id).then(resp => {
        this.specTabelShow = false
        const page = resp.data.data

        if (this.isProduct) {
          page.syncOfficialStore = false
        }
        // 处理商品类型
        page.cateId = page.catePath.split(',').map(Number)
        const tableData = page.goodsList
        for (let index = 0; index < tableData.length; index++) {
          const element = tableData[index]
          element.key = ''
          for (let j = 0; j < element.saleSpecValues.length; j++) {
            const ele = element.saleSpecValues[j]
            element.key = element.key + '_' + ele.specValue
            if (j === 0) {
              element.goodsImage = ele.specImg
            }
          }
          element.key = this.trimChar(element.key, '_')
        }
        this.productSpec = tableData
        // 回显图片
        this.$refs.uploadImage.loadImg(page.images)
        this.$refs.uploadExplain.loadImg(page.detailImages)

        // 产品参数
        page.paramsList = page.params
        // 商品规格处理
        const specList = page.saleSpecsValues
        console.debug('page.saleSpecsValues',page.saleSpecsValue)
        specList.forEach(item => {
          this.specsData.push(item.specId)
        })
        this.specList = specList

        // 处理米粒回显
        if (page.integralConf) {
          if (page.integralConf.vipBackType === 'ratio') {
            this.integralConf.vipBackRatio = page.integralConf.vipBackValue
            this.integralConf.vipBackFixed = undefined
          } else if (page.integralConf.vipBackType === 'fixed') {
            this.integralConf.vipBackRatio = undefined
            this.integralConf.vipBackFixed = page.integralConf.vipBackValue
          }
          if (page.integralConf.amountBackType === 'fixed') {
            this.integralConf.amountBackFixed =
              page.integralConf.amountBackValue
            this.integralConf.amountBackRatio = undefined
          } else if (page.integralConf.amountBackType === 'ratio') {
            this.integralConf.amountBackFixed = undefined
            this.integralConf.amountBackRatio =
              page.integralConf.amountBackValue
          }
          if (page.integralConf.integralBackType === 'fixed') {
            this.integralConf.integralBackFixed =
              page.integralConf.integralBackValue
            this.integralConf.integralBackRatio = undefined
          } else if (page.integralConf.integralBackType === 'ratio') {
            this.integralConf.integralBackFixed = undefined
            this.integralConf.integralBackRatio =
              page.integralConf.integralBackValue
          }
        } else {
          page.integralConf = {
            amountBackType: '',
            amountBackValue: undefined,
            integralBackType: '',
            integralBackValue: undefined,
            vipBackType: '',
            vipBackValue: undefined
          }
        }
        this.$nextTick(() => {
          this.ruleForm = page
          // 规格明细图片回显
          setTimeout(() => {
            this.ruleForm.goodsList.forEach((item, idx) => {
              this.$refs['upload' + idx].loadImg(item.goodsImage)
              // if (
              //   Array.isArray(item.saleSpecValues) &&
              //   item.saleSpecValues.specImg
              // ) {
              //   this.$refs['upload' + idx].loadImg(item.saleSpecValues.specImg)
              // }
            })
          }, 200)
        })
        this.specTabelShow = true
      })
    },
    /**
     * 删除字符串首尾指定字符
     * @param Str 源字符
     * @param char 去除的指定字符
     * @param type 类型，右边或左边，为空是替换首尾
     * @returns {*}
     */
    trimChar(Str, char, type) {
      if (char) {
        if (type === 'left') {
          return Str.replace(new RegExp('^\\' + char + '+', 'g'), '')
        } else if (type === 'right') {
          return this.replace(new RegExp('\\' + char + '+$', 'g'), '')
        }
        return Str.replace(
          new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'),
          ''
        )
      }
      return Str.replace(/^\s+|\s+$/g, '')
    }
  }
}
</script>

<style lang="scss" scoped type="text/scss">
.specs-item {
  padding: 18px 0 1px;
  margin: 8px 10px;
  background-color: #f8f8f8;
  position: relative;
  .spec-deleted {
    position: absolute;
    right: 0;
    top: 0;
    display: none;
    cursor: pointer;
  }
  &:hover {
    .spec-deleted {
      display: inline;
    }
  }
}
.specs-but {
  margin-left: 35px;
  margin-bottom: 15px;
}
.nav-item-label-left {
  margin-right: 8px;
  font-size: 14px;
}
.nav-item-label-right {
  margin-left: 8px;
  font-size: 14px;
}
</style>
