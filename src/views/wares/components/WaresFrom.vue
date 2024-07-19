<template>
  <basic-container>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-form-item v-if="!isProduct">
        <el-checkbox v-model="ruleForm.syncOfficialStore">同步到平台自营</el-checkbox>
      </el-form-item>
    
      <el-form-item label="商品类型：" prop="cateId">
        <el-cascader
          v-model="ruleForm.cateId"
          :options="cateTreeAll"
          :props="{ checkStrictly: true,value: 'cateId',label:'cateName'}"
          style="width: 300px"
          @change="handleChange"></el-cascader>
      </el-form-item>
      <el-form-item label="商品名称：" prop="productName">
        <el-input
          v-model="ruleForm.productName"
          style="width: 300px"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品图：" prop="images">
        <upload-file
          ref="uploadImage"
          v-model="ruleForm.images"
          type="content"
          :limit="9"
          :multiple="true"
          :auto-upload="false"
          type-name="iamge"
        />
      </el-form-item>
      <el-form-item label="品牌名称：" prop="brandId">
        <el-select v-model="ruleForm.brandId" placeholder="请选择商品品牌" style="width: 300px">
          <el-option
            v-for="(item, index) in brandAll"
            :key="index"
            :label="item.brandName"
            :value="item.brandId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品条码编号：" prop="productCode">
        <el-input
          v-model="ruleForm.productCode"
          style="width: 300px"
          maxlength="13"
          placeholder="请输入商品条码编号"
        ></el-input>
      </el-form-item>
      <el-form-item label="产品参数：" required>
        <div class="specs-nav">
          <div
            v-for="(item, index) in ruleForm.paramsList"
            :key="index"
            class="parameter-nav"
          >
            <el-form-item label="参数名">
              <el-input
                v-model="item.paramsName"
                style="width: 300px"
              ></el-input>
            </el-form-item>
            <el-form-item label="参数值">
              <el-input
                v-model="item.paramsValue"
                style="width: 300px"
              ></el-input>
            </el-form-item>
            <i
              class="icon el-icon-circle-close spec-deleted"
              @click="delParameter(index)"
            ></i>
          </div>
          <div class="specs-but">
            <el-button @click="addParameter">添加参数项目</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="商品规格：">
        <div class="specs-nav">
          <div
            v-for="(item, index) in specification"
            :key="index"
            class="specs-item"
          >
            <el-form-item label="规格名：">
              <el-select
                v-model="item.specId"
                filterable
                :disabled="isEdit"
                placeholder="请选择"
                @change="saveSpec($event, index)"
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
                v-for="(tag, j) in item.specValueArr"
                :key="j"
                closable
                style="margin-right: 10px"
                @close="delSpecTag(index, j)"
              >{{ tag }}</el-tag>
              <el-input
                v-model="item.inputValue"
                style="width: 220px"
                placeholder="多个规格值以'；'隔开"
                @keyup.native.enter="addSpecTag(item.inputValue,item)"
              >
                <el-button
                  slot="append"
                  type="primary"
                  @click="addSpecTag(item.inputValue,item)"
                >添加</el-button>
              </el-input>
            </el-form-item>
            <i
              v-if="!isEdit"
              class="icon el-icon-circle-close spec-deleted"
              @click="delSpec(index)"
            ></i>
          </div>
          <div v-if="!isEdit" class="specs-but">
            <el-button @click="addSpec">添加规格项目</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="规格明细：">
        <el-table
          v-loading="tableLoading"
          :empty-text="$t('message.table_empty_text')"
          :data="tableColumnList.tableData"
          border
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          style="width: 100%"
          :row-style="{height: '180px'}"
        >
          <el-table-column v-for="(item,index) in tableColumnList.tableHeaderList" :key="index" :label="item.propName" :property="item.prop" align="center" fixed="left">
            <template slot-scope="scope">
              <span>{{ scope.row.saleSpecValues[index].specValue }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header">
              <span style="color: rgb(245, 108, 108); margin-right: 5px;">*</span>
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
              <span style="color: rgb(245, 108, 108); margin-right: 5px;">*</span>
              <span>规格图片</span>
            </template>
            <template slot-scope="scope">
              <upload-file
                :ref="scope.row.uploadGoodsImg"
                v-model="scope.row.goodsImage"
                type="content"
                :limit="1"
                :multiple="true"
                :auto-upload="false"
                type-name="image"
              />
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header">
              <span style="color: rgb(245, 108, 108); margin-right: 5px;">*</span>
              <span>成本价（元）</span>
            </template>
            <template slot-scope="scope">
              <span>
                <el-input
                  v-model="scope.row.price.costPrice"
                  placeholder="请输入"
                  @input="scope.row.price.costPrice = asynchronousValidation(scope.row.price.costPrice)" />
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header">
              <span style="color: rgb(245, 108, 108); margin-right: 5px;">*</span>
              <span>商品售价（元）</span>
            </template>
            <template slot-scope="scope">
              <span>
                <el-input
                  v-model="scope.row.price.salePrice"
                  placeholder="请输入"
                  @input="scope.row.price.salePrice = asynchronousValidation(scope.row.price.salePrice)" />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="商品会员价（元）" align="center">
            <template slot-scope="scope">
              <span>
                <el-input
                  v-model="scope.row.price.vipPrice"
                  placeholder="请输入"
                  @input="scope.row.price.vipPrice = asynchronousValidation(scope.row.price.vipPrice)" />
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header">
              <span style="color: rgb(245, 108, 108); margin-right: 5px;">*</span>
              <span>商品米粒</span>
            </template>
            <template slot-scope="scope">
              <span>
                <el-input
                  v-model="scope.row.price.integral"
                  placeholder="请输入"
                  @input="scope.row.price.integral = asynchronousValidation(scope.row.price.integral)" />
              </span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="商品库存" align="center">
            <template slot-scope="scope">
              <span>
                <el-input v-model.number="scope.row.price.stock" placeholder="请输入" />
              </span>
            </template>
          </el-table-column> -->
        </el-table>
      </el-form-item>
      <el-form-item label="商品详情：" prop="detailImages">
        <upload-file
          ref="uploadExplain"
          v-model="ruleForm.detailImages"
          type="content"
          :limit="9"
          :multiple="true"
          :auto-upload="false"
          type-name="image"
        />
      </el-form-item>
      <el-form-item label="限购：" prop="limitBuyNum">
        <span class="nav-item-label-left">每人限购</span>
        <el-input
          v-model.number="ruleForm.limitBuyNum"
          type="number"
          min="0"
          style="width: 120px"
        />
        <span class="nav-item-label-right">件</span>
        <span class="set-tip">未填写限购数量，则系统默认不限制购买数量。</span>
      </el-form-item>
      <el-form-item label="起售：" prop="startSaleNum">
        <span class="nav-item-label-left">至少</span>
        <el-input v-model.number="ruleForm.startSaleNum" min="0" style="width: 120px" />
        <span class="nav-item-label-right">件起售</span>
        <span class="set-tip">未填写起售数量，则系统默认起售数量为1</span>
      </el-form-item>
      <el-form-item label="实付金额返米粒：">
        <el-radio-group v-model="ruleForm.integralConf.amountBackType" @change="paidBackFunction">
          <el-radio label="fixed">
            <span class="nav-item-label-left">定额 购买返</span>
            <el-input
              v-model="integralConf.amountBackFixed"
              min="0.00"
              :disabled="ruleForm.integralConf.amountBackType!=='fixed'"
              style="width: 200px;"
              @input="integralConf.amountBackFixed = asynchronousValidation(integralConf.amountBackFixed)"
              @blur="ruleForm.integralConf.amountBackValue = integralConf.amountBackFixed"
            >
              <span slot="suffix" class="el-input__icon">米粒</span>
            </el-input>
          </el-radio>
          <el-radio label="ratio">
            <span class="nav-item-label-left">比例 返商品售价的</span>
            <el-input
              v-model="integralConf.amountBackRatio"
              min="0.00"
              :disabled="ruleForm.integralConf.amountBackType!=='ratio'"
              style="width: 200px;"
              @input="integralConf.amountBackRatio = asynchronousValidation(integralConf.amountBackRatio)"
              @blur="ruleForm.integralConf.amountBackValue = integralConf.amountBackRatio"
            >
              <span slot="suffix" class="el-input__icon">%</span>
            </el-input>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="实付米粒返米粒：">
        <el-radio-group v-model="ruleForm.integralConf.integralBackType" @change="integralBackFunction">
          <el-radio label="fixed">
            <span class="nav-item-label-left">定额 购买返</span>
            <el-input
              v-model="integralConf.integralBackFixed"
              min="0.00"
              :disabled="ruleForm.integralConf.integralBackType!=='fixed'"
              style="width: 200px;"
              @input="integralConf.integralBackFixed = asynchronousValidation(integralConf.integralBackFixed)"
              @blur="ruleForm.integralConf.integralBackValue = integralConf.integralBackFixed"
            >
              <span slot="suffix" class="el-input__icon">米粒</span>
            </el-input>
          </el-radio>
          <el-radio label="ratio">
            <span class="nav-item-label-left">比例 返商品售价的</span>
            <el-input
              v-model="integralConf.integralBackRatio"
              min="0.00"
              :disabled="ruleForm.integralConf.integralBackType!=='ratio'"
              style="width: 200px;"
              @input="integralConf.integralBackRatio = asynchronousValidation(integralConf.integralBackRatio)"
              @blur="ruleForm.integralConf.integralBackValue = integralConf.integralBackRatio"
            >
              <span slot="suffix" class="el-input__icon">%</span>
            </el-input>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="会员返米粒规则：">
        <el-radio-group v-model="ruleForm.integralConf.vipBackType" @change="vipBackFunction">
          <el-radio label="fixed">
            <span class="nav-item-label-left">定额 购买返</span>
            <el-input
              v-model="integralConf.vipBackFixed"
              min="0.00"
              :disabled="ruleForm.integralConf.vipBackType!=='fixed'"
              style="width: 200px;"
              @input="integralConf.vipBackFixed = asynchronousValidation(integralConf.vipBackFixed)"
              @blur="ruleForm.integralConf.vipBackValue = integralConf.vipBackFixed"
            >
              <span slot="suffix" class="el-input__icon">米粒</span>
            </el-input>
          </el-radio>
          <el-radio label="ratio">
            <span class="nav-item-label-left">比例 返商品售价的</span>
            <el-input
              v-model="integralConf.vipBackRatio"
              min="0.00"
              :disabled="ruleForm.integralConf.vipBackType!=='ratio'"
              style="width: 200px;"
              @input="integralConf.vipBackRatio = asynchronousValidation(integralConf.vipBackRatio)"
              @blur="ruleForm.integralConf.vipBackValue = integralConf.vipBackRatio"
            >
              <span slot="suffix" class="el-input__icon">%</span>
            </el-input>
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="permissions.product_add">
        <el-button type="primary" :disabled="loading" :loading="loading" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex'
import UploadFile from '@/components/Upload-File/upload'
import { reqBrandById } from '@/api/product/brand'
import { reqSpecCateById } from '@/api/product/specs'
import { selectCateTree } from '@/api/product/classify'
import { deepClone } from '@/util/util'
import { upProduct, reqProductDetailById } from '@/api/product/wares'

export default {
  name: 'WaresFrom',
  components: {
    UploadFile
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    isProduct: {
      type: Boolean,
      default: false
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
      // 查询商品分类
      cateTreeAll: [],
      // 全部规格
      specAll: [],
      // 规格
      specification: [
        {
          specId: undefined,
          specValueArr: [],
          specValue: '',
          specName: '',
          valueId: undefined,
          inputValue: ''
        }
      ],

      // 品牌
      brandAll: [],
      ruleForm: {
        syncOfficialStore: false,
        brandId: undefined,
        catePath: undefined,
        cateId: [],
        detailImages: [],
        goodsList: [
          {
            goodsCode: undefined,
            goodsId: undefined,
            goodsName: '',
            price: {
              costPrice: undefined,
              currency: '',
              integral: undefined,
              priceId: undefined,
              salePrice: undefined,
              stock: undefined,
              vipPrice: undefined
            },
            saleSpecValues: [
              {
                specId: undefined,
                specImg: '',
                specValue: '',
                valueId: undefined
              }
            ]
          }
        ],
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
      loading: false,
      tableLoading: false,
      integralConf: {
        amountBackFixed: undefined,
        amountBackRatio: undefined,
        integralBackFixed: undefined,
        integralBackRatio: undefined,
        vipBackFixed: undefined,
        vipBackRatio: undefined
      },
      // 表单
      tableColumnList: {
        // 表头
        tableHeaderList: [],
        // 数据
        tableData: []
      },
      rules: {
        cateId: [
          { required: true, message: '请选择商品类型', trigger: 'change' }
        ],
        productName: [
          { required: true, message: '请输入商品名称', trigger: 'change' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' }
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
      }
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    // 计算规格
    calculateAttribute() {
      // 初始化
      const obj = {}
      this.specification.forEach((item) => {
        // 判断有没有输入规格名, 并将规格名和规格值以键值对存储
        if (item.specName) {
          //规格名:规格值     //'颜色':'尺寸'
          obj[item.specName] = item.specValueArr
        }
      })
      return obj
    }
  },
  watch: {
    // 监听规格数据
    calculateAttribute(newVal) {
      const cloneNewVal = JSON.parse(JSON.stringify(newVal))
      const attrName = [] //规格名数组
      const attrValue = [] //规格值数组
      for (const key in cloneNewVal) {
        attrName.push(key)
        attrValue.push(cloneNewVal[key])
      }
      // 表格内容数据（笛卡尔积算法）
      const finalArr = this.cartesianProductOf(...attrValue)
      const tableObj = {
        tableData: [],
        tableHeaderList: []
      }
      // 表格内容
      
      tableObj.tableData = finalArr.map((item, val) => {
        const obj = {
          key: '',
          goodsCode: '',
          goodsId: undefined,
          goodsName: '',
          goodsImage: '',
          uploadGoodsImg: 'uploadGoodsImg' + val,
          price: {
            costPrice: undefined,
            currency: '',
            integral: undefined,
            priceId: undefined,
            salePrice: undefined,
            stock: undefined,
            vipPrice: undefined
          },
          saleSpecValues: []
        }
        for (let j = 0; j < this.specification.length; j++) {
          obj.saleSpecValues[j] = deepClone(this.specification[j])
          obj.key = item.join('')
          for (let i = 0; i < item.length; i++) {
            obj[attrName[i]] = item[i]
            if (this.specification[j].specName === attrName[i]) {
              obj.saleSpecValues[j].specValue = item[i]
            }
          }
        }

        return obj
      })
      
      // 开始进行表格数据调整，新增行/删除行等操作
      const data = tableObj.tableData
      const originData = this.tableColumnList.tableData
      const newData = []
      for (let i = 0; i < data.length; i++) {
        // 遍历现有和原有的所有行，进行对比，确定是否存在原有的行
        const rowData = data[i] // 现有行
        let includeRow = false
        for (let j = 0; j < originData.length; j++) {
          const originRowData = originData[j]
          if (originRowData && originRowData.key === rowData.key) {
            newData[i] = deepClone(originRowData)
            includeRow = true
          }
        }
        if (!includeRow) {
          newData[i] = deepClone(rowData)
        }
      }
      
      this.tableColumnList.tableData = newData //表格内容数据

      // 表头
      const skuTableArr = Object.keys(newVal)
      tableObj.tableHeaderList = skuTableArr.map((item) => {
        return {
          prop: item,
          propName: item
        }
      })
      this.tableColumnList.tableHeaderList = tableObj.tableHeaderList // 表头
    }
  },
  created() {
    this.$nextTick(() => {
      this.getCateTree()
      this.getBrandAll()
      this.getSpecsAll()
      if (this.isEdit) {
        const id = this.$route.params && this.$route.params.id
        this.getList(id)
      }
    })
  },
  methods: {
    // 非金额数据进行过滤
    asynchronousValidation(e) {
      e = (e.match(/^\d*(\.?\d{0,2})/g)[0]) || null
      return e
    },
    // 非数字且非正整数过滤
    asynchronousValidationIntegral(e) {
      e = e.replace(/[^\.\d]/g, '')
      e = e.replace('.', '')
      return e
    },
    // 查询详情
    getList(id) {
      reqProductDetailById(id).then(resp => {
        const page = resp.data.data
        this.ruleForm = page
        if (this.isProduct) {
          this.ruleForm.syncOfficialStore = false
        }
        // 处理商品类型
        this.ruleForm.cateId = page.catePath.split(',').map(Number)
        const tableData = page.goodsList
        for (let index = 0; index < tableData.length; index++) {
          const element = tableData[index]
          element.key = ''
          // 定义 "uploadGoodsImage"+ index 用于区分新增商品规格时表格中图片无法对应得问题
          element.uploadGoodsImg = 'uploadGoodsImage' + index
          for (let j = 0; j < element.saleSpecValues.length; j++) {
            const ele = element.saleSpecValues[j]
            element.key += ele.specValue
            if (j === 0) {
              element.goodsImage = ele.specImg
            }
          }
        }
        
        this.tableColumnList.tableData = tableData
        
        // 上传图片
        this.$refs.uploadImage.uploadImg(this.ruleForm.images)
        this.$refs.uploadExplain.uploadImg(this.ruleForm.detailImages)
        // 产品参数
        this.ruleForm.paramsList = page.params
        // 商品规格处理
        const specList = page.saleSpecsValues
        this.specification = []
        specList.forEach((item) => {
          const object = {
            specId: item.specId,
            specValueArr: this.findChildren(item.values),
            specValue: '',
            specName: item.specName,
            valueId: item.valueId,
            inputValue: ''
          }
          this.specification.push(object)
        })
        // 处理米粒回显
        if (this.ruleForm.integralConf.vipBackType === 'ratio') {
          this.integralConf.vipBackRatio = this.ruleForm.integralConf.vipBackValue
          this.integralConf.vipBackFixed = undefined
        } else if (this.ruleForm.integralConf.vipBackType === 'fixed') {
          this.integralConf.vipBackRatio = undefined
          this.integralConf.vipBackFixed = this.ruleForm.integralConf.vipBackValue
        }
        if (this.ruleForm.integralConf.amountBackType === 'fixed') {
          this.integralConf.amountBackFixed = this.ruleForm.integralConf.amountBackValue
          this.integralConf.amountBackRatio = undefined
        } else if (this.ruleForm.integralConf.amountBackType === 'ratio') {
          this.integralConf.amountBackFixed = undefined
          this.integralConf.amountBackRatio = this.ruleForm.integralConf.amountBackValue
        }
        if (this.ruleForm.integralConf.integralBackType === 'fixed') {
          this.integralConf.integralBackFixed = this.ruleForm.integralConf.integralBackValue
          this.integralConf.integralBackRatio = undefined
        } else if (this.ruleForm.integralConf.integralBackType === 'ratio') {
          this.integralConf.integralBackFixed = undefined
          this.integralConf.integralBackRatio = this.ruleForm.integralConf.integralBackValue
        }
        
      }).catch(e => {
        
      })
    },
    // 
    findChildren(list) {
      const arr = []
      list.forEach((item) => {
        arr.push(item.specValue)
      })
      return [...new Set(arr)]
    },
    // 查询商品类目
    getCateTree() {
      selectCateTree().then((resp) => {
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
        .catch((e) => {})
    },
    // 商品类型选择值
    handleChange(val) {
      this.ruleForm.catePath = val.toString()
    },
    // 根据id查询品牌
    getBrandAll() {
      const query = {
        cateId: null
      }
      reqBrandById(query)
        .then((resp) => {
          this.brandAll = resp.data.data
        })
        .catch((e) => {})
    },
    // 根据id查询规格
    getSpecsAll() {
      const query = {
        cateId: null
      }
      reqSpecCateById(query)
        .then((resp) => {
          this.specAll = resp.data.data.saleSpecs
          for (let index = 0; index < this.specAll.length; index++) {
            const element = this.specAll[index]
            element.status = false
          }
        })
        .catch((e) => {})
    },
    async submitForm(formName) {
      const _this = this
      _this.loading = true

      // 商品图
      await _this.$refs.uploadImage.getUploadParams()
      // 上传图片拿到imageURL
      const uploadImage = this.$refs.uploadImage.uploadParams
      uploadImage.forEach((item, indexs) => {
        this.ruleForm.images[indexs] = item.imageURL
        if (indexs === 0) {
          this.ruleForm.image = item.imageURL
        }
      })
      // 商品详情图
      await _this.$refs.uploadExplain.getUploadParams()
      // 上传图片拿到imageURL
      const uploadParams = this.$refs.uploadExplain.uploadParams
      uploadParams.forEach((item, indexs) => {
        this.ruleForm.detailImages[indexs] = item.imageURL
      })
      _this.ruleForm.goodsList = []
      const uploadSpecIma = _this.tableColumnList.tableData
      // 上传规格明细图片
      // console.log('refs==>', _this.$refs)
      for (let index = 0, len = uploadSpecIma.length; index < len; index++) {
        const element = uploadSpecIma[index]
        const upload = element.uploadGoodsImg
        await _this.$refs[upload].getUploadParams()
        const tableImages = this.$refs[upload].uploadParams
        tableImages.forEach((item, indexs) => {
          element.saleSpecValues[indexs].specImg = item.imageURL
        })
        element.goodsName = _this.ruleForm.productName
        _this.ruleForm.goodsList.push(element)
      }
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this._submit(_this.ruleForm)
        } else {
          _this.loading = false
          return false
        }
      })
    },
    // 提交
    _submit(data) {
      const _this = this
      upProduct(data).then((res) => {
        _this.loading = false
        _this.$message.success('提交成功')
        _this.tableColumnList.tableData.forEach((item, index) => {
          const upload = item.uploadGoodsImg
          // 清除缓存图片
          _this.$refs[upload].clearFiles()
        })
        _this.$refs.uploadImage.clearFiles()
        _this.$refs.uploadExplain.clearFiles()
        _this.resetForm()
        setTimeout(() => {
          _this.$router.go(-1)
        }, 100)
      }).catch(() => {
        _this.loading = false
      })

    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
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

    // 删除参数项目
    delParameter(index) {
      this.ruleForm.paramsList.splice(index, 1)
    },

    // 添加规格项目
    addSpec() {
      if (this.specification.length < 5) {
        this.specification.push({
          specId: undefined,
          specValueArr: [],
          specValue: '',
          specName: '',
          valueId: undefined,
          inputValue: ''
        })
      }
    },
    // 选择规格名
    saveSpec(val, index) {
      const arr = this.specAll.filter((item) => {
        if (val === item.specId) {
          item.status = true
          return item
        } else {
          item.status = false
        }
      })

      // 此处存在问题，使用push()会使this.specification一直变大，不能用push
      this.specification[index].specValueArr = arr[0].valueDefault.split(';')
      this.specification[index].specName = arr[0].specName
      this.specification[index].specId = arr[0].specId
      this.specification[index].valueId = arr[0].valueId
      this.specification[index].inputValue = arr[0].inputValue
    },

    // 删除规格项目
    delSpec(index) {
      this.specification.splice(index, 1)
    },
    // 添加规格属性
    addSpecTag(val, attr) {
      if (!val) {
        this.$message.error('名称不能为空，请注意填写')
        return
      }
      const arr = val.split(';') // 使用；分割成数组
      // 使用concat合并数组
      let newArr = attr.specValueArr.concat(arr)
      // 去重
      newArr = Array.from(new Set(newArr))
      attr.specValueArr = newArr

      attr.inputValue = ''
      
    },

    // 删除规格属性
    delSpecTag(index, num) {
      this.specification[index].specValueArr.splice(num, 1)
    },
    // 笛卡尔积算法
    cartesianProductOf(...args) {
      return args.reduce(
        (total, current) => {
          const ret = []
          total.forEach((a) => {
            current.forEach((b) => {
              ret.push(a.concat([b]))
            })
          })
          return ret
        },
        [[]]
      )
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
    }
  }
}
</script>

<style lang="scss" scoped>
.parameter-nav {
  display: flex;
  padding: 18px 0 1px;
  margin: 10px;
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
.specs-nav {
  border: 1px solid #eef1f6;
  .specs-item {
    padding: 18px 0 1px;
    margin: 10px;
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
}
.set-tip {
  margin: 10px 24px 20px;
  font-size: 14px;
  color: #c0c4cc;
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
