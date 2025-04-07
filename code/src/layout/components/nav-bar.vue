<template>
  <div class="navbar">
    <!-- 切换按钮 -->
    <hamburger
      v-if="sidebar.hasToggleBtn"
      class="hamburger-container"
      :is-active="sidebar.opened"
      @toggleClick="toggleSideBar"
    />

    <div class="center-menu">
      <!-- 面包屑 -->
      <breadcrumb v-if="navbar.hasBreadcrumb" class="breadcrumb-container" />

      <!-- 模块 -->
      <top-module v-if="hasModule" />
    </div>

    <!-- 右边用户菜单 -->
    <div class="right-menu">
      <!-- 下拉企业列表 -->
      <transition name="el-zoom-in-center" v-if="userStore.showProject">
        <div class="project-select">
          <el-select
            v-model="projectId"
            v-if="!route.meta?.noProject"
            filterable
            placeholder="请选择"
            @change="onChangeProject"
          >
            <el-option
              v-for="item in projects"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id"
            ></el-option>
          </el-select>
        </div>
      </transition>

      <!-- 皮肤 -->
      <div class="right-menu-item skin" v-if="hasSkin">
        <el-switch
          v-model="skin"
          inline-prompt
          active-value="dark"
          inactive-value="light"
          :active-icon="Moon"
          :inactive-icon="Sunny"
          style="--el-switch-on-color: #0960bd; --el-switch-off-color: #ff6600"
          @change="changeSkin"
        />
      </div>

      <!-- 语言 -->
      <div class="right-menu-item language" v-if="hasI18n">
        <el-dropdown>
          <span class="trigger">
            <svg-icon name="language"></svg-icon>
            <!-- <el-icon class="el-icon--right"><arrow-down /></el-icon> -->
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="item in langs"
                :key="item.key"
                :disabled="item.key == locale"
                @click="changeLanguage(item)"
                >{{ item.title }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <!-- 用户快捷操作菜单 -->
      <div class="use-oper right-menu-item">
        <template v-if="showAvatar">
          <el-avatar v-if="userInfo.avatar" :src="userInfo.avatar" :size="24" />
          <el-avatar v-else :icon="Avatar" :size="24" />
        </template>
        <el-dropdown size="small" trigger="click" popper-class="user-dropdown">
          <span class="username">
            {{ userInfo.name }}( {{ userInfo.account }} )
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :icon="House" @click="onRouteTo(linkMap.home)">{{
                $t('user.home')
              }}</el-dropdown-item>
              <el-dropdown-item
                v-if="userStore.changePassword"
                :icon="Lock"
                @click="onRouteTo(linkMap.password)"
                >{{ $t('user.changePwd') }}</el-dropdown-item
              >
              <el-dropdown-item divided :icon="SwitchButton" @click="onRouteTo(linkMap.logout)">
                <span>{{ $t('user.logout') }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, Moon, Sunny, House, Lock, Avatar, SwitchButton } from '@element-plus/icons-vue'
import topModule from './top-module/index.vue'
import hamburger from './top-module/hamburger.vue'
import breadcrumb from './top-module/breadcrumb.vue'

import { useAppStore, useUserStore } from '@/stores'
import { langs } from '@/locales'

import { useI18n } from 'vue-i18n'
const { t: $t } = useI18n()

defineComponent({
  ArrowDown,
  Moon,
  Sunny,
  House,
  Lock,
  Avatar,
  SwitchButton
})

const appStore = useAppStore()
const userStore = useUserStore()
const skin = ref(appStore.skin)
const sidebar: any = computed(() => appStore.sidebar)
const hasModule: any = computed(() => appStore.module.show)
const navbar: any = computed(() => appStore.navbar)
const userInfo: any = computed(() => userStore.userInfo)
const showAvatar = computed(() => userStore.showAvatar)

const locale = computed(() => appStore.language)
const hasI18n = computed(() => appStore.i18n)
const hasSkin = computed(() => appStore.toggleSkin)

const toggleSideBar = () => {
  appStore.toggleSideBar()
}

const projectId = ref(userStore.projectId)
const projects = computed(() => userStore.projects)

const onChangeProject = e => {
  userStore.updateProjectId(e)
}

const changeSkin = (e: any) => {
  appStore.updateSkin(e)
}

const changeLanguage = (e: any) => {
  appStore.updateLangeuage(e.key)
}

const router = useRouter()
const route = useRoute()

import { base } from '@/router/utils'
const linkMap = {
  home: '/home',
  password: '/changepwd',
  logout: 'LOGOUT'
}
const onRouteTo = (path: string) => {
  if (path === 'LOGOUT') {
    logout()
  } else {
    router.push(`${base}${path}`)
  }
}
const logout = async () => {
  await userStore.logout()
  router.push(`${base}/login?redirect=${route.fullPath}`)
}
</script>

<style lang="scss">
.navbar {
  height: var(--header-nav-height);
  display: flex;
  overflow: hidden;
  position: relative;
  // box-shadow: var(--el-box-shadow-lighter);
  border-bottom: 1px solid var(--el-border-color);

  .hamburger-container {
    float: left;
    height: 100%;
    cursor: pointer;
    transition: background 0.3s;
    line-height: 60px;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .center-menu {
    flex-grow: 1;
    overflow-y: hidden;
    overflow-x: auto;

    // 滚动条整体样式
    &::-webkit-scrollbar {
      height: var(--scroll-width); // 高宽分别对应横竖滚动条的尺寸
    }
  }
  .right-menu {
    height: 100%;
    display: flex;
    white-space: nowrap;
    align-items: center;
    .project-select {
      height: 100%;
      display: flex;
      line-height: 1;
      align-items: center;
    }
    .el-select {
      width: 160px;
      .el-input__wrapper {
        --el-input-border-radius: 12px;
      }
      .el-input__inner {
        --el-input-text-color: #606266;
        --el-input-inner-height: 24px;
      }
    }
    &:focus {
      outline: none;
    }
    .right-menu-item {
      margin: 0 5px;
      padding: 0 3px;
      // vertical-align: text-bottom;
    }
    .language {
      height: 100%;
      display: flex;
      align-items: center;
      .el-dropdown {
        vertical-align: middle;
      }
      .trigger {
        cursor: pointer;
        &:focus-visible {
          outline: none;
        }
      }
    }
    .use-oper {
      position: relative;
      display: flex;
      position: relative;
      align-items: center;
      margin-right: 15px;
      text-transform: capitalize;
      .username {
        cursor: pointer;
        display: inline-block;
        padding: 0 5px;
        font-size: 14px;
        .el-icon {
          vertical-align: middle;
        }
      }
      .el-icon-caret-bottom {
        top: 24px;
        right: -20px;
        cursor: pointer;
        position: absolute;
        font-size: 16px;
      }
    }
  }
}
.user-dropdown {
  text-transform: capitalize;

  a {
    text-decoration: none;
  }
}
</style>
