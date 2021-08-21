<template>
  <div id="app" class="app-router">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
    export default {
        provide(){
          return {
              reload:this.reload
          }  
        },
        data(){
            return {
                isRouterAlive:true
            }
        },
        methods:{
            reload(){
                this.isRouterAlive = false;
                this.$nextTick(()=>{
                    this.isRouterAlive = true;
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    // @import '../../assets/css/common.css';
</style>
