<template>
  <div class="avue-top">
    <div class="top-bar__left">
      <div
        v-if="showCollapse"
        :class="[{ 'avue-breadcrumb--active': isCollapse }]"
        class="avue-breadcrumb"
      >
        <i class="icon-navicon" @click="setCollapse" />
      </div>
    </div>
    <div class="top-bar__title">
      <div v-if="showMenu" class="top-bar__item top-bar__item--show">
        <top-menu />
      </div>
    </div>
    <div class="top-bar__right">
      <el-tooltip
        v-if="showColor"
        effect="dark"
        :content="$t('message.theme_color')"
        placement="bottom"
      >
        <div class="top-bar__item">
          <top-color />
        </div>
      </el-tooltip>
      <el-tooltip
        v-if="showDebug"
        :content="logsFlag ? '没有错误日志' : `${logsLen}条错误日志`"
        effect="dark"
        placement="bottom"
      >
        <div class="top-bar__item">
          <top-logs />
        </div>
      </el-tooltip>
      <el-tooltip
        v-if="showLock"
        effect="dark"
        :content="$t('message.lock')"
        placement="bottom"
      >
        <div class="top-bar__item">
          <top-lock />
        </div>
      </el-tooltip>
      <el-tooltip
        v-if="showTheme"
        effect="dark"
        :content="$t('message.feture_theme')"
        placement="bottom"
      >
        <div class="top-bar__item top-bar__item--show">
          <top-theme />
        </div>
      </el-tooltip>
      <el-tooltip
        v-if="showFullScren"
        :content="
          isFullScren
            ? $t('message.exit_full_screen')
            : $t('message.full_screen')
        "
        effect="dark"
        placement="bottom"
      >
        <div class="top-bar__item">
          <i
            :class="isFullScren ? 'icon-zuixiaohua' : 'icon-quanpingzuidahua'"
            @click="handleScreen"
          />
        </div>
      </el-tooltip>
      <el-tooltip
        v-if="userInfo.avatar"
        effect="dark"
        :content="$t('message.user_avatar')"
        placement="bottom"
      >
        <img id="thumbnail" :src="userInfo.avatar" class="top-bar__img" />
      </el-tooltip>
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ userInfo.username }}
          <i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item divided>
            <router-link to="/">{{ $t('message.home') }}</router-link>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <router-link to="/info/index">{{
              $t('message.user_info')
            }}</router-link>
          </el-dropdown-item>
          <!-- <el-dropdown-item
            divided
            @click.native="$refs.seting.open()"
          >{{ $t('message.setting') }}
          </el-dropdown-item> -->
          <el-dropdown-item divided @click.native="logout"
            >{{ $t('message.logout') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <top-setting ref="seting" />
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
// import { fullscreenToggel, handleImg, listenfullscreen } from '@/util/util'
import { fullscreenToggel, listenfullscreen } from '@/util/util'
import topLock from './top-lock'
import topMenu from './top-menu'
import topTheme from './top-theme'
import topLogs from './top-logs'
import topColor from './top-color'
import topSetting from './top-setting'

export default {
  name: 'Top',
  components: {
    topLock,
    topMenu,
    topTheme,
    topLogs,
    topColor,
    topSetting
  },
  filters: {},
  data() {
    return {}
  },
  computed: {
    ...mapState({
      showDebug: state => state.common.showDebug,
      showTheme: state => state.common.showTheme,
      showLock: state => state.common.showLock,
      showFullScren: state => state.common.showFullScren,
      showCollapse: state => state.common.showCollapse,
      showMenu: state => state.common.showMenu,
      showColor: state => state.common.showColor
    }),
    ...mapGetters([
      'userInfo',
      'isFullScren',
      'tagWel',
      'tagList',
      'isCollapse',
      'tag',
      'logsLen',
      'logsFlag'
    ])
  },
  created() {
    // handleImg(this.userInfo.avatar, "thumbnail");
  },
  mounted() {
    listenfullscreen(this.setScreen)
  },
  methods: {
    handleScreen() {
      fullscreenToggel()
    },
    setCollapse() {
      this.$store.commit('SET_COLLAPSE')
    },
    setScreen() {
      this.$store.commit('SET_FULLSCREN')
    },
    logout() {
      this.$confirm(
        this.$t('message.is_exit_system'),
        this.$t('message.tips'),
        {
          confirmButtonText: this.$t('message.confirm'),
          cancelButtonText: this.$t('message.cancel'),
          type: 'warning'
        }
      ).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          this.$router.push({ path: '/login' })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
