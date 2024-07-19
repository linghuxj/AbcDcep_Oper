<template>
  <div class="statistical">
    <div class="statistical-item">
      <div class="statistical-item-div">任务目标</div>
      <div class="statistical-item-div">
        <div>任务总目标数</div>
        <div>
          {{ fromData.taskTarget?fromData.taskTarget:'--' }}
        </div>
      </div>
      <div class="statistical-item-div">
        <div>累计完成任务目标数</div>
        <div>
          {{ fromData.completeNum?fromData.completeNum:'--' }}
        </div>
      </div>
    </div>
    <div class="statistical-item">
      <div class="statistical-item-div">任务领取</div>
      <div class="statistical-item-div">
        <div>可领取总人数</div>
        <div>{{ fromData.personNum?fromData.personNum:'--' }}</div>
      </div>
      <div class="statistical-item-div">
        <div>已领人数</div>
        <div>{{ fromData.receiveNum?fromData.receiveNum:'--' }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { reqTaskStatisticsById } from '@/api/task/list'
export default {
  name: 'TaskDetailsStatistical',
  data() {
    return {
      fromData: {}
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.$nextTick(() => {
      this.getList(id)
    })
  },
  methods: {
    getList(id) {
      reqTaskStatisticsById(id).then(resp => {
        const page = resp.data.data
        this.fromData = page
        
      }).catch(() => {
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.statistical {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  flex-direction: column;
}
.statistical-item {
  display: flex;
  align-items: center;
  width: 50%;
  height: 50px;
  margin-top: 20px;
  margin-bottom: 30px;
  .statistical-item-div {
    width: 200px;
  }
  .statistical-item:nth-of-type(1) {
    display: flex;
    flex-direction: column;
    height: 50px;
    justify-content: center;
    color: #000000;
    font-weight: bold;
  }
  .statistical-item-div:not(:nth-of-type(1)) {
    display: flex;
    flex-direction: column;
    height: 50px;
    justify-content: space-between;
    color: #838383;
  }
}
.statistical-item-item {
  margin: 5px 0px;
  div {
    color: #797979;
  }
}
</style>
