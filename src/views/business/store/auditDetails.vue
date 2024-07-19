<template>
  <div class="main-content" v-if="show">
    <aside-tip content="店铺基本信息" />
    <div>
      <el-form>
        <el-form-item label="店铺类型：">
          <span :style="detailsType == 'draft' ? 'color:red' : ''">{{
            storeMes.storeTypeName
          }}</span>
          <span v-if="detailsType == 'draft'"
            >({{ storeMes.store.storeTypeName }})</span
          >
        </el-form-item>
        <el-form-item label="店铺名称：">
          <span :style="detailsType == 'draft' ? 'color:red' : ''">
            {{ storeMes.storeName }}
          </span>
          <span v-if="detailsType == 'draft'">
            ({{ storeMes.store.storeName }})
          </span>
        </el-form-item>
        <el-form-item label="营业时间：">
          <span :style="detailsType == 'draft' ? 'color:red' : ''"
            >{{ storeMes.startTime }} -- {{ storeMes.endTime }}</span
          >
          <span v-if="detailsType == 'draft'"
            >({{ storeMes.store.startTime }} --
            {{ storeMes.store.endTime }})</span
          >
        </el-form-item>
        <el-form-item label="销售渠道：">{{
          storeMes.saleChannelName
        }}</el-form-item>
        <el-form-item label="店铺联系电话：">{{
          storeTel(storeMes)
        }}</el-form-item>
        <el-form-item label="营业执照：">{{
          storeMes.businessLicense ? storeMes.businessLicense : '--'
        }}</el-form-item>
        <el-form-item>{{
          storeMes.businessLicenseNo ? storeMes.businessLicenseNo : '--'
        }}</el-form-item>
        <el-form-item v-if="storeMes.businessLicenseImage">
          <el-image
            style="height: 200px"
            fit="scale-down"
            :src="storeMes.businessLicenseImage"
            :preview-src-list="[storeMes.businessLicenseImage]"
          ></el-image>
        </el-form-item>
         <el-form-item label="身份证正面：">
          <el-image
            style="height: 200px"
            fit="scale-down"
            :src="storeMes.cardFront"
            :preview-src-list="[storeMes.cardFront]"
          ></el-image>
        </el-form-item>
         <el-form-item label="身份证反面：">
          <el-image
            style="height: 200px"
            fit="scale-down"
            :src="storeMes.cardBack"
            :preview-src-list="[storeMes.cardBack]"
          ></el-image>
        </el-form-item>
        <el-form-item label="店铺地址："
          >{{ storeMes.locationName }}{{ storeMes.address }}</el-form-item
        >
        <el-form-item label="所属商圈：">{{
          storeMes.districtName ? storeMes.districtName : '--'
        }}</el-form-item>
        <el-form-item v-if="storeMes.storeImg" label="店铺图片：">
          <el-image
            v-for="(item, index) in storeMes.storeImg"
            :key="index"
            style="width: 100px; height: 100px; margin-right: 10px"
            :src="item"
            :preview-src-list="storeMes.storeImg"
          >
          </el-image>
        </el-form-item>
      </el-form>
    </div>
    <aside-tip content="店铺负责人信息" />
    <div class="person-infomation">
      <div>负责人姓名：{{ storeMes.fullName ? storeMes.fullName : ' --' }}</div>
      <div>负责人手机号：{{ storeMes.mobile ? storeMes.mobile : ' --' }}</div>
    </div>
    <aside-tip content="店铺登录账号" />
    <div class="person-infomation">
      <div>
        登录账号：{{ storeMes.loginMobile ? storeMes.loginMobile : '/' }}
      </div>
      <div>登录密码默认dp888888</div>
    </div>
    <aside-tip content="银行卡账户信息" />
    <div class="rmb-accountMes">
      <div
        v-for="(item, index) in storeMes.storeBankList"
        :key="index"
        class="rmb-accountMes-item"
      >
        <div class="content">
          <triangle-label :content="'账户' + changeNumToHan(index + 1)">
            <span slot="triangle-left" />
          </triangle-label>
          开户行信息：{{ item.openBank }}
        </div>
        <div>银行卡号：{{ item.walletNo }}</div>
      </div>
    </div>
    <aside-tip content="数字人民币收款账号信息" />
    <div class="rmb-accountMes">
      <div
        v-for="(item, index) in storeMes.storeAccountList"
        :key="index"
        class="rmb-accountMes-item"
      >
        <div class="content">
          <triangle-label :content="'账户' + changeNumToHan(index + 1)">
            <span slot="triangle-left" />
          </triangle-label>
          开户行信息：{{ item.openBank }}
        </div>
        <div>钱包编号：{{ item.walletNo }}</div>
      </div>
    </div>
    <div>
      <aside-tip content="审核结果" />
      <el-form ref="form" :model="form">
        <!-- <el-form-item label="销售渠道" prop="saleChannel">
          <el-checkbox-group v-model="form.saleChannel">
            <el-checkbox label="consume" >买单</el-checkbox>
            <el-checkbox label="offline" >到店自提</el-checkbox>
            <el-checkbox label="online" >网店</el-checkbox>
          </el-checkbox-group>
        </el-form-item> -->
        <el-form-item>
          <div class="audit">
            <div class="audit-title">审核结果：</div>
            <el-radio v-model="other.radio" label="normal">审核通过</el-radio>
            <el-radio v-model="other.radio" label="failed">审核不通过</el-radio>
          </div>
          <div v-if="other.radio === 'failed'">
            <div class="audit">
              <div class="audit-title">常用语：</div>
              <el-select
                v-model="other.select_reason"
                placeholder="请选择"
                :disabled="other.enter_reason"
              >
                <el-option
                  v-for="item in reasonArr"
                  :key="item.id"
                  :label="item.reason"
                  :value="item.reason"
                ></el-option>
              </el-select>
            </div>
            <textarea
              v-model="other.enter_reason"
              placeholder="请自定义审核不通过的原因"
              class="audit-textarea"
              :disabled="other.select_reason"
            >
            </textarea>
          </div>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button
          type="primary"
          :loading="interactive.loading"
          @click="to_submit()"
          >提交</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import AsideTip from '@/template/aside/index'
import {
  findStore,
  findDraftStore,
  updateStoreStatus,
  updateStoreDraft
} from '@/api/store/store'
import { getReasonAll } from '@/api/reason'
import TriangleLabel from '@/template/triangleLabel/index'
export default {
  components: { AsideTip, TriangleLabel },
  data() {
    return {
      storeId: undefined,
      storeMes: {},
      reasonArr: [],
      interactive: {
        loading: false
      },
      other: {
        radio: 'normal',
        select_reason: undefined,
        enter_reason: undefined
      },
      paramter: {
        storeId: undefined,
        status: undefined,
        remark: undefined
      },
      form: {
        // saleChannel: []
      },
      parameter: {
        districtName: undefined
      },
      show: true,
      detailsType: ''
    }
  },
  created() {
    if (this.$route.query.storeId) {
      this.detailsType = ''
      this.storeId = this.$route.query.storeId
      this.getUserById()
    } else if (this.$route.query.draftId) {
      this.detailsType = 'draft'
      this.show = false
      findDraftStore(this.$route.query.draftId)
        .then(res => {
          const store = {
            ...res.data.data,
            districtName: res.data.data.store.districtName
          }
          store.storeImg = store.store.resList.map(item => {
            return item.resUrl
          })
          this.storeMes = { ...store.store, ...store }
          this.form.saleChannel = store.saleChannel.split(',')
        })
        .finally(() => {
          this.show = true
        })
    }
    this.getReasonList()
  },
  methods: {
    // 查询店铺信息
    getUserById() {
      findStore(this.storeId)
        .then(res => {
          const store = res.data.data
          console.debug('store.resList',store.resList)
          const storeImg = store.resList.map(item => {
            // return item.resUrl
            return item
          })
          store.storeImg = storeImg
          this.storeMes = store
          this.form.saleChannel = store.saleChannel.split(',')
        })
        .finally(() => {
          this.show = true
        })
    },
    // 获取审核不通过原因列表
    getReasonList() {
      // 类型(任务审核:task、店铺审核：store、订单取消：order_cancel、订单拒绝退款：order_refuse_refund)
      getReasonAll('store').then(res => {
        this.reasonArr = res.data.data
      })
    },
    // 去提交审核
    to_submit() {
      if (
        !this.other.enter_reason &&
        !this.other.select_reason &&
        this.other.radio === 'failed'
      ) {
        this.$message.warning('请选择或输入审核不通过原因')
        return
      }
      this.paramter = {
        storeId: this.storeId,
        status: this.other.radio,
        remark: this.other.select_reason
          ? this.other.select_reason
          : this.other.enter_reason
        // saleChannel: this.form.saleChannel.toString()
      }
      console.log(this.paramter, 'paramter')
      this.interactive.loading = true
      if (this.detailsType == 'draft') {
        delete this.paramter.storeId
        updateStoreDraft({
          ...this.paramter,
          draftId: this.$route.query.draftId
        })
          .then(() => {
            this.interactive.loading = false
            this.$message.success('提交成功')
            this.$router.go(-1)
          })
          .catch(() => {
            this.interactive.loading = false
          })
      } else {
        updateStoreStatus(this.paramter)
          .then(() => {
            this.interactive.loading = false
            this.$message.success('提交成功')
            this.$router.go(-1)
          })
          .catch(() => {
            this.interactive.loading = false
          })
      }
    },
    // 联系电话处理
    storeTel(val) {
      let tel
      if (val.contactTel && val.phone) {
        tel = val.contactTel + ' / ' + val.phone
      } else if (val.contactTel && !val.phone) {
        tel = val.contactTel
      } else if (!val.contactTel && val.phone) {
        tel = val.phone
      } else {
        tel = '--'
      }
      return tel
    },
    // 将数字转汉字显示
    changeNumToHan(num) {
      const arr1 = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
      var arr2 = ['', '十', '百', '千', '万', '十', '百', '千', '亿'] //可继续追加更高位转换值
      if (!num || isNaN(num)) {
        return '零'
      }
      var english = num.toString().split('')
      var result = ''
      for (var i = 0; i < english.length; i++) {
        var des_i = english.length - 1 - i //倒序排列设值
        result = arr2[i] + result
        var arr1_index = english[des_i]
        result = arr1[arr1_index] + result
      }
      //将【零千、零百】换成【零】 【十零】换成【十】
      result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十')
      //合并中间多个零为一个零
      result = result.replace(/零+/g, '零')
      //将【零亿】换成【亿】【零万】换成【万】
      result = result.replace(/零亿/g, '亿').replace(/零万/g, '万')
      //将【亿万】换成【亿】
      result = result.replace(/亿万/g, '亿')
      //移除末尾的零
      result = result.replace(/零+$/, '')
      //将【零一十】换成【零十】
      //result = result.replace(/零一十/g, '零十');//貌似正规读法是零一十
      //将【一十】换成【十】
      result = result.replace(/^一十/g, '十')
      return result
    }
  }
}
</script>
<style lang="scss" scoped>
.main-content {
  font-size: 14px;
  color: #606266;
}
.aside {
  background-color: #ccc;
}
.person-infomation {
  display: flex;
  margin: 10px;
}
.person-infomation div {
  margin-left: 50px;
  margin-right: 150px;
}
.rmb-accountMes {
  display: flex;
  flex-direction: column;
}
.rmb-accountMes-item {
  display: flex;
  margin: 10px;
  & > div {
    flex: 1;
    line-height: 28px;
  }
  .content {
    display: inline-block;
    height: 28px;
    div {
      display: inline-block;
      vertical-align: middle;
      height: 28px;
    }
  }
}
.rmb-accountMes-item span {
  color: #fff;
  background-color: #02a7f0;
  padding: 0px;
  margin-right: 10px;
}
.audit {
  display: flex;
  margin-top: 10px;
}
.audit-title {
  width: 100px;
  text-align: right;
}
.audit-textarea {
  width: 300px;
  height: 50px;
  margin-left: 100px;
  margin-top: 10px;
}
</style>
