<template>
  <basic-container>
    <el-form
      ref="ruleForm"
      :model="form"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-form-item label="商品类型：">
        {{ form.catePathName }}
      </el-form-item>
      <el-form-item label="商品名称：">
        {{ form.productName }}
      </el-form-item>
      <el-form-item label="商品图：">
        <div
          v-for="(fit, index) in form.images"
          :key="index"
          class="item-block"
        >
          <el-image
            style="width: 100px; height: 100px"
            :src="fit"
            fit="fill"
            :preview-src-list="form.images"
          ></el-image>
        </div>
      </el-form-item>
      <el-form-item label="品牌名称：">
        {{ form.brandName }}
      </el-form-item>
      <el-form-item label="商品条码编号：">
        {{ form.productCode }}
      </el-form-item>
      <el-form-item label="产品参数：">
        <div v-for="(item, index) in form.params" :key="index">
          {{ item.paramsName }}——{{ item.paramsValue }}
        </div>
      </el-form-item>
      <el-form-item label="商品规格：">
        <el-table :data="form.goodsList" border>
          <el-table-column
            v-for="(item, index) in tableData"
            :key="index"
            :label="item.propName"
            align="center"
            fixed="left"
          >
            <template slot-scope="scope">
              <span>{{
                scope.row.saleSpecValues[index]
                  ? scope.row.saleSpecValues[index].specValue
                  : ''
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="规格图片" align="center" width="140">
            <template slot-scope="scope">
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.goodsImage"
                fit="fill"
                :preview-src-list="[scope.row.goodsImage]"
              />
            </template>
          </el-table-column>
          <el-table-column label="成本价（元）" min-width="120" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.price.costPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="商品售价（元）"
            min-width="120"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.price.salePrice }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="商品会员价（元）"
            min-width="130"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.price.vipPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品米粒" min-width="100" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.price.integral }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="商品详情：">
        <div
          v-for="(fit, index) in form.detailImages"
          :key="index"
          class="item-block"
        >
          <el-image
            style="width: 100px; height: 100px"
            :src="fit"
            fit="fill"
            :preview-src-list="form.detailImages"
          ></el-image>
        </div>
      </el-form-item>
      <template v-if="isShow">
        <el-form-item label="限购：">
          每人限购<span class="item-label-tips">{{
            form.limitBuyNum ? form.limitBuyNum + '件' : '不限'
          }}</span>
        </el-form-item>
        <el-form-item label="起售：">
          至少<span class="item-label-tips">{{ form.startSaleNum }}</span
          >件起售
        </el-form-item>
        <el-form-item label="实付金额返米粒：">
          购买返<span class="item-label-tips">{{
            form.integralConf ? form.integralConf.amountBackValue : '--'
          }}</span
          >米粒
        </el-form-item>
        <el-form-item label="实付米粒返米粒：">
          购买返<span class="item-label-tips">{{
            form.integralConf ? form.integralConf.integralBackValue : '--'
          }}</span
          >米粒
        </el-form-item>
        <el-form-item label="会员返米粒规则：">
          返商品售价的<span class="item-label-tips">{{
            form.integralConf ? form.integralConf.vipBackValue : '--'
          }}</span>
        </el-form-item>
      </template>
      <div style="text-align: center">
        <el-button type="primary" @click="_close">关闭</el-button>
      </div>
    </el-form>
  </basic-container>
</template>

<script>
import { reqProductDetailById } from '@/api/product/wares'
import { findTag } from '@/util/deltag'

export default {
  name: 'WaresDetails',
  props: {
    // 从商品管理模块进入不显示
    isShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      form: {},
      tableData: []
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.$nextTick(() => {
      this.getList(id)
    })
  },
  methods: {
    // 查询列表
    getList(id) {
      reqProductDetailById(id).then(resp => {
        const page = resp.data.data
        this.tableData = []
        const tableList = page.goodsList
        for (let index = 0; index < tableList.length; index++) {
          const element = tableList[index]
          this.tableData = element.saleSpecValues.map((item, indexs) => {
            if (indexs === 0) {
              element.goodsImage = item.specImg
            }
            return {
              prop: indexs,
              propName: item.specName
            }
          })
        }
        page.goodsList = tableList
        this.form = page
      })
    },
    _close() {
      let value = this.$route.fullPath

      let { tag } = findTag(value)

      this.$store.commit('DEL_TAG', tag)
      this.$router.go(-1)
    }
    
  }
}
</script>
<style scoped lang="scss">
.item-block {
  margin: 0 10px;
  text-align: center;
  display: inline-block;
  box-sizing: border-box;
}
.item-label-tips {
  margin-left: 10px;
  margin-right: 10px;
}
</style>
