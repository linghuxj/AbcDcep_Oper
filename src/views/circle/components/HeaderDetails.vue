<template>
  <div class="circle-details">
    <div class="task-details-nav">
      <div class="details-item-left">
        <div class="details-item-bg">
          <el-image
            style="width: 190px;height:130px"
            :src="form.image? form.image: './img/hiPro.png'">
          </el-image>
        </div>
        <div class="details-item-logo">
          <el-image
            style="width: 50px;height:50px"
            :src="form.image? form.image: './img/hiPro.png'">
          </el-image>
        </div>
      </div>
      <div class="details-item-right">
        <div class="item">
          <div>圈子名称XXXX</div>
          <div>
            <span>圈子分类：{{}}</span>
            <span>创建人：{{}}</span>
          </div>
          <div>圈子介绍：</div>
        </div>
        <div class="item">
          <div>圈子ID：232122522</div>
          <div>创建时间：</div>
        </div>
      </div>
    </div>
    <div class="task-details-eva">
      <div class="status_text">{{ detailsForm.statusName }}</div>
      <div class="status_square"></div>
    </div>
  </div>
</template>

<script>
import { getTaskById } from '@/api/task/list'
export default {
  name: 'CircleDetailsHeader',
  data() {
    return {
      activeNames: [],
      detailsForm: {
        bankNo: null,
        budget: null,
        company: null,
        createTime: '',
        cycle: null,
        dcWalletName: null,
        location: '',
        locationName: '',
        personNum: null,
        publisherMobile: '',
        publisherName: '',
        receiveNum: null,
        status: '',
        statusName: '',
        taskDesc: null,
        taskId: undefined,
        taskName: '',
        taskNo: '',
        taskTarget: undefined,
        typeId: undefined,
        typeName: ''
      }
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.$nextTick(() => {
      this.taskcode = id
      this.getTaskDetail(id)
    })
  },
  methods: {
    // 查询详情
    getTaskDetail(id) {
      getTaskById(id).then((res) => {
        this.detailsForm = res.data.data
        this.detailsForm.taskTarget =
          this.detailsForm.taskTarget === 0
            ? undefined
            : this.detailsForm.taskTarget
        this.detailsForm.personNum =
          this.detailsForm.personNum === 0
            ? undefined
            : this.detailsForm.personNum
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.circle-details {
  .circle-details-nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    align-items: center;
    .nav-item {
      font-size: 24px;
      font-weight: 600;
      flex: 3;
    }
    .nav-items {
      flex: 1;
      height: 30px;
      line-height: 30px;
      display: flex;
      justify-content: flex-end;
      .status_text {
        height: 30px;
        background-color: #1890ff;
        color: #fff;
        padding: 0px 15px 0px 20px;
      }
      .status_square {
        width: 0;
        height: 0;
        border-top: 15px solid transparent;
        border-left: 20px solid #1890ff;
        border-bottom: 15px solid transparent;
      }
    }
  }
  .circle-details-eva {
    .task-details-item {
      margin: 8px 0;
      display: flex;
      display: -webkit-flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: center;
      .details-item {
        flex: 1;
        flex-shrink: 1;
        flex-shrink: 1;
      }
    }
  }
}
</style>
