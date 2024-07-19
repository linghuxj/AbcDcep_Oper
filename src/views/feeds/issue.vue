<template>
  <div class="issueBox">
    <div class="issued-by" @click="handlePublishImage" v-if="permissions.note_image_add">
      <div class="characterContent">
        <img src="/img/icon_img.png" />
      </div>
      <div class="character">
        {{ $t("feed.issue.release_image") }}
      </div>
    </div>
    <div class="issued-by" @click="handlePublishVideo" v-if="permissions.note_video_add">
      <div class="characterContent">
        <img src="/img/icon_vedio.png" />
      </div>
      <div class="character">
        {{ $t("feed.issue.release_videdo") }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["permissions"])
  },
  data() {
    return {};
  },
  methods: {
    handlePublishImage() {
      this.$router.push({ path: "/feeds/issue/image" });
    },
    handlePublishVideo() {
      this.$router.push({ path: "/feeds/issue/video" });
    }
  }
};
</script>

<style lang="scss" scoped>
.issueBox {
  width: 100%;
  background-color: white;
  margin: 0 20px;
  height: 100%;
  padding: 30px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .issued-by {
    width: 300px;
    height: 400px;
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    cursor: pointer;

    .characterContent {
      img {
        margin: 35% 0;
      }
      text-align: center;
      width: 100%;
      height: 350px;
    }
    .character {
      width: 100%;
      height: 50px;
      background-color: rgb(101, 101, 172);
      color: white;
      text-align: center;
      line-height: 50px;
    }
  }
}
</style>
