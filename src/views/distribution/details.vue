<template>
  <!-- <member-details :is-edit="true" /> -->
  <div>
    <div class="main-content-top">
      <Detail-Mes :user-mes="userMes" />
    </div>
    <div class="main-content">  
      <Detail-Table :user-mes="userMes" />
    </div> 
  </div> 
</template>
<script>
import DetailMes from './components/DetailMes'
import DetailTable from './components/DetailTable'
import {
  findDistributorInfo
} from '@/api/distribution/distribution'
export default {
  name: 'EditForm',
  // components: { MemberDetails }
  components: { DetailMes, DetailTable },
  data() {
    return {
      userId: null,
      userMes: {}
    }
  },
  created() {
    this.userId = this.$route.params && this.$route.params.userId
    this.getUserDetail()
  },
  methods: {
    // 创客详情
    getUserDetail() {
      findDistributorInfo(this.userId).then(res => {
        this.userMes = res.data.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.main-content-top {
 background-color: #fff;
 padding: 0px 10px;
 margin: 10px 20px;
}
.main-content {
  background-color: #fff;
  padding: 0px 10px;
}
</style>

