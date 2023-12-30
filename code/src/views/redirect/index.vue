<template>
  <div class="refresh">
    <div>
      <el-icon class="an an-spin"><Loading /></el-icon>
      <span class="text">refresh</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Loading } from '@element-plus/icons-vue'

defineComponent( {
  Loading,
} )

const router = useRouter()
const currRoute = router.currentRoute.value
const { params, query } = currRoute
const { path }: any = params
const to: any = {
  path: `/${ path.join( '/' ) }`,
  query
}
router.replace( to )
</script>
<style scoped>
.refresh {
  width: 100%;
  height: 100%;
  display: flex;
  font-size: 16px;
  align-items: center;
  justify-content: center;
}
.text {
  padding: 0 5px;
}
</style>
