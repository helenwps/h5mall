<template>
    <button>
        <slot></slot>
    </button>
</template>

<script>
    export default {
        name:'QdmButton',
        data(){
            return {}
        }
    }
</script>

<style lang="scss" scoped>
    button{
        font-size: 14px;
    }
</style>
