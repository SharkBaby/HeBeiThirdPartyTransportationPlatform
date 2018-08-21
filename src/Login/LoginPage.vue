<template>
  <div class="login">
    <el-row class="mask">
    <login></login>
    </el-row>
  </div>
</template>
<style src="./loginPage.css" type="text/css"></style>
<script>
import Login from '@/components/Login/Login';
export default {
  name: 'LoginPage-Container',
  components: {
    Login
  }
}
</script>
