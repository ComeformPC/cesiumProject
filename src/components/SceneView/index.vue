<template>
  <el-popover></el-popover>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      options: [
        {
          value: "sceneview",
          label: "场景浏览",
          children: [
            {
              value: "zoomIn",
              label: "放大"
            },
            {
              value: "zoomOut",
              label: "缩小"
            }
          ]
        }
      ]
    };
  }
});
</script>
<style lang="scss" scoped>
</style>