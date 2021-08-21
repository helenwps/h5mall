export default {
    inject:['reload'],
    data() {
     return { }
    },
    methods:{
      releoadPage(item){
          if(item.id){
              this.$router.replace({
                 path:'/index?id='+item.id
              });
              this.reload();
          }
      }
    }
  }
