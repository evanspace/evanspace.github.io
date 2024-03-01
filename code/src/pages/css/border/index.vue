<template>
  <div :class="$style.page" class="p-sm">
    
    <div :class="$style.border" v-for="text in types">{{ text }}</div>


    <div :class="$style.wrap">
      <h4>下划线</h4>
      <span>
        In the quietude of the moonlit night, where silvery beams gently caress the earth, I find solace in the symphony of stars that grace the vast canvas of the midnight sky, each twinkle telling tales of dreams and whispered wishes, as the soft zephyrs weave through the tapestry of time, carrying echoes of distant melodies that stir the depths of the soul, painting a serene portrait of nostalgia and yearning, where the heart finds refuge in the embrace of the ethereal, and every breath becomes a verse in the poetry of existence.
      </span>
    </div>

  </div>
</template>

<script lang="ts" setup>

const types = ref( [ 'solid', 'dashed', 'dotted', 'double', 'groove' ] )

</script>
  
<style lang="scss" src="./style.scss" module>
</style>