<template>
    <div v-if="visible" class="tooltip">
        <input v-model="query"
               placeholder="Полка Полка Стенка Стенка"
               @change="dtfail"
               :class="{ 'autocomplite-box': true, 'error-input': dtfail }">
        <span class="tooltiptext">
            Введите данные в виде: <br>AAA x AA x BBB x BB            
        </span>
    </div>
</template>
<script>
    export default {
        name: 'dtcell',
        props: {
            item: Object            
        },
        mounted() {
            if (this.item.msub) {
                let ms = this.item.msub;
                this.query = `${ms.s0}x${ms.s1}x${ms.p0}x${ms.p1}`
            }
        },
        methods: {
        },
        computed: {
            visible: function () {
                return this.item !== null && this.item.mtype == "DT";
            },
            dtfail: function () {
                let items = this.query.split('x')
                let ret = false;
                let r = {
                    s0: parseFloat(items[0]),
                    s1: parseFloat(items[1]),
                    p0: parseFloat(items[2]),
                    p1: parseFloat(items[3])
                }
                
                if (isNaN(r.s0) || isNaN(r.s1) || isNaN(r.p0) || isNaN(r.p1)) ret = true;
                else if (r.s0 <= r.s1) ret = true;
                else if (r.p0 <= r.p1) ret = true;
                else {                    
                    this.$emit('dt-changed', r);
                }
                return ret;
            }
        },
        data: function () {
            return {
                query: '',
                haserror: true
            }
        },

    };
</script>

<style>
    .error-input {
        border: 1px solid crimson;
        outline: none;
    }

    .help-span {
        display: none;
    }

    .error-input:hover {
        cursor: help !important;
        position: relative;
    }

        .error-input:hover ~ .help-span {
            border: #c0c0c0 1px dotted;
            padding: 5px 20px 5px 5px;
            display: block;
            z-index: 100;
            left: 0px;
            margin: 10px;
            width: 250px;
            position: fixed;
            top: 10px;
            text-decoration: none
        }
</style>