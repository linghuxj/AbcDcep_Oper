<template>
<div class="header-mes">
  <div class="header">
    <div>
      <div class="statusName">{{ userMes.statusName }}</div>
      <div class="avatar"></div>
      <el-avatar
        v-if="userMes.user"
        :size="50"
        :src="userMes.user.avatar"
      ></el-avatar>
    </div>
    <div class="user-item">
      <div>用户姓名：{{ (userMes.user && userMes.user.fullName) || '/' }} 
        <span v-if="userMes.user && userMes.user.sex==='secret'">保密</span>
        <span v-else-if="userMes.user && userMes.user.sex=='Male'">男</span>
        <span v-else>女</span>
        <span class="RealName">{{ userMes.authStatus?'已实名':'未实名' }}</span>
      </div>
      <div>微信昵称：{{ (userMes.user && userMes.user.username) || '/' }}</div>
      <div>联系电话：{{ (userMes.user && userMes.user.mobile) || '/' }}</div>
      <div>账号余额：{{ userMes.totalBalance }}</div>
      <div>支付宝账号：
        {{ (userMes.aliAccount && userMes.aliAccount.accountId)|| '/' }}
        ({{ (userMes.aliAccount && userMes.aliAccount.accountName) || '/' }})
      </div>
      <el-button v-if="userMes.userLevel==='member' && permissions.distributor_level" @click="to_upgradeHead()">升级成为团长</el-button>
    </div>
    <div class="user-item">
      <div>创客ID：{{ (userMes.user && userMes.user.userId) || '/' }}</div>
      <div>审核方式：{{ userMes.auditTypeName || '/' }} </div>
      <div>来源：{{ userMes.sourceTypeName || '/' }}</div>
      <div>保证金：{{ userMes.taskSuretyAmount }}</div>
    </div>
    <div class="user-item">
      <div>开通时间：{{ userMes.createTime }}</div>
      <div>邀请人: {{ (userMes.inviteUser && userMes.inviteUser.username) || '/' }}</div>
      <div>邀请人手机号： {{ (userMes.inviteUser && userMes.inviteUser.mobile) || '/' }}</div>
      <div>微信openID： 
        {{ (userMes.wechatAccount && userMes.wechatAccount.accountId) ||'/' }}
        ({{ (userMes.wechatAccount && userMes.wechatAccount.accountName) || '/' }})
      </div>
      <div v-if="userMes.userRole && userMes.userRole!=='maker'">所属单位：{{ userMes.user && userMes.user.company|| '/' }} ({{ userMes.user && userMes.user.companyNo|| '/' }})</div>
      <!-- <div>录入人：{{ (userMes.user && userMes.user.inviteUser.username) || '/' }}</div>
        <div>录入人手机号码：{{ (userMes.user && userMes.user.inviteUser.mobile) || '/' }}</div> -->
    </div>
    <div class="user-item">
      <div>
        <el-tag>{{ userMes.userLevelName }}</el-tag>
      </div>
      <div v-if="userMes.mineLeader">
        <el-tag>{{ userMes.mineLeader }}</el-tag>
      </div>
      <div v-if="userMes.leader">
        <el-tag>{{ userMes.leader }}</el-tag>
      </div>
      <div></div>
    </div>
  </div>
  <!-- 个人技能 -->
    <el-collapse v-model="activeNames" @change="handleChange" class="personal">
      <el-collapse-item title="技能认证" name="1" >
        <div class="personal-introduce">
          <label>个人介绍：</label>
          <span>{{userMes.profile?userMes.profile:'暂无'}}</span>
        </div>
        <div class="personal-skill">
          <label>拥有技能：</label>
          <div class="personal-skill-item" v-if="userMes.userTags.length>0">
            <span  v-for="(item,index) in userMes.userTags" :key="index">{{item.tagName}}</span>
          </div>
          <div v-else>暂无</div>
        </div>
      </el-collapse-item>
    </el-collapse>
 </div> 
</template>
<script>
import { mapGetters } from 'vuex'
import { upLevelDistributor, findDistributorInfo } from '@/api/distribution/distribution'
export default {
  // props: {
  //   userMes: {
  //     type: Object,
  //     default: () => {}
  //   }
  // },
  data() {
    return {
      userId: null,
      userMes: {},
      activeNames:undefined,
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.userId = this.$route.params && this.$route.params.userId
    this.getUserDetail()
    // console.log('usermes', this.userMes)
  },
  methods: {
    //去升级为团长 
    to_upgradeHead() {
      this.$confirm('确定要升级为团队长吗?', '升级提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        upLevelDistributor(this.userId).then(() => {
          this.$message({
            type: 'success',
            message: '升级成功'
          })
          this.getUserDetail()
        })    
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })          
      })
    },
    // 创客详情
    getUserDetail() {
      findDistributorInfo(this.userId).then(res => {
        this.userMes = res.data.data
      })
    },
    handleChange(){},
  }
}
</script>
<style lang="scss" scoped>
  .header {
    display: flex;
    justify-content: space-between;
    margin: 10px 30px;
    padding: 10px 0px;
    .statusName{
      color: #FFF;
      background-color: #3399ff;
      text-align: center;
      margin-bottom: 10px;
      font-size: 12px;
      padding: 5px 0px;
    }
    .user-item{
        font-size: 13px;
        color: #333333;
        div{
          margin: 15px 0px;
        }
        .RealName {
          color: #FFF;
          background-color: #3399ff;
          text-align: center;
          padding: 5px;
          margin-left: 10px;
        }
    }
  }
  .personal{
    label{
      margin-right: 10px;
    }
    .personal-skill{
      display: flex;
      flex-direction: row;
    }
    .personal-skill-item{
      span{
        background-color: #E7CCFF;
        color: #8400FF;
        font-size: 14px;
        padding: 0px 10px;
        margin-right: 10px;
      }
    }
  }
</style>
 
