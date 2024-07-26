
<script>
export default {
  props: {
    renderItem: Function
  },
  setup( props ) {
    // 返回渲染函数
    return () => props.renderItem()
  }
}
</script>