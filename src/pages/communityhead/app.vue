<template>
  <div id="app" class="app-router">
    <router-view/>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
    };
  },
  created() {
    
  },
  methods: {
    ...mapMutations(["setVerifyPageIn"]),
  },
}
</script>

<style lang="scss" scoped>
    @import '../../assets/css/common.css';
</style>
