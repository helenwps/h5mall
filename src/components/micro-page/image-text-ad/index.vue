<template>
    <div class="module-content">
        <!--轮播 -->
        <carousel v-if="currentObj.styleType == 1 && nav.length > 0" :navList="nav" :childObj="currentObj"></carousel>
        <!--一行一个-->
        <one-lineone v-if="currentObj.styleType == 2 && nav.length > 0" :navList="nav" :childObj="currentObj"></one-lineone>
    </div>
</template>

<script>
    import carousel from './module/carousel.vue';
    import oneLineone from './module/oneLineone.vue';
    export default {
        components: {
            carousel,
            oneLineone,
        },
        data() {
            return {
                value: '',
                navIndex: '',
                currentObj: {
                    styleType: 1
                },
                nav: []
            }
        },
        props: ['parentObj'],
        created() {

            this.currentObj = JSON.parse(this.parentObj.params);
            this.nav = [];
            const self = this;
            this.currentObj.navList.forEach(function(item){
            	if(item.startTime && item.endTime && self.currentObj.styleType != 3 ){
            		var _start = self.getTimestamp(item.startTime);
            		var _end = self.getTimestamp(item.endTime);
            		if(_start <= 0 && _end > 0){
            			self.nav.push(item);
            		}
            	}else{
            		self.nav.push(item);
            	}
            });
        },
        methods: {
            getTimestamp(timer) {
                return (timer - new Date().getTime());
            },
        }
    }
</script>

<style lang="scss" scoped>
</style>
