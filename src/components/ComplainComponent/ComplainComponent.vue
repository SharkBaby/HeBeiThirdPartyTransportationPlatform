<template>
  <el-row class='complain-component'>
    <el-row class="Complain">
      <h3>{{complainItem.title}}</h3>
      <el-row class="complain_rate">
        <span class="complain">{{complainItem.reviewNumNo}}</span>/<span class="complains">{{complainItem.reviewNum}}</span>
      </el-row>
    </el-row>
  </el-row>
</template>

<style src="./complainComponent.css" type="text/css">
</style>

<script>
export default {
  name: "CompolainComponent",
  props: ['complainItem'],
  data() {
    return {
      
    };
  }
};
</script>
