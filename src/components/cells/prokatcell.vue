<template>
    <Dropdown :class-name="'tp-class'" :close-on-click="true">
        <template slot="btn">
            <span v-html="btn" style="margin-right: auto;"></span>
        </template>
        <template slot="body">
            <ul>
                <li v-for="item in items" v-bind:key="item" @click="onSelectItem(item)">
                    <span v-html="item"></span>
                </li>
            </ul>
        </template>
    </Dropdown>
</template>
<script>
    var values = '1.5 2 2.5 3 4 5 6 7 8 10 12 14 16 18 20 22 25 30 32 35 36 40 45 50 60 80 90 100 120 140 150'.split(' ');
    import Dropdown from 'bp-vuejs-dropdown'
    import { Number } from 'core-js';
    export default {
        name: 'prokatcell',
        components: { Dropdown },
        props: {
            selected: Number,
            item: Object
        },
        mounted() {
            let start = this.items[0];
            this.btn = start;

            let res = this.items.filter(value => value == this.item.msub);
            if (res && res.length == 1)
                this.btn = res[0];            
        },
        methods: {
            onSelectItem: function (e) {
                const sel = this.items.find(x => x === e);
                this.btn = sel;
                this.$emit('procat-selected', e);
            }
        },
        data: function () {
            return {
                btn: '',
                items: values
            };
        }
    };
</script>
<style scoped>

    .tp-class-bp__btn {
        background: white;
        width: calc(100% - 11px);
    }

    .tp-class-bp__btn--active {
        background: #fff;
    }

    .tp-class-bp__body {
        width: 120px;
        padding: 5px;
        font-size: 10px;
    }

        .tp-class-bp__body ul {
            list-style: none;
            margin: 0 0 0 0;
            padding: 0;
        }

        .tp-class-bp__body > ul > li {
            margin: 2px 2px 2px 2px;
            padding: 2px;
            text-align: left;
            cursor: pointer;
        }

            .tp-class-bp__body > ul > li:hover {
                border: 1px solid gray;
                padding: 1px;
                background-color: #ececec;
            }

    @media print {
        .bp-dropdown__icon {
            display: none;
        }
    }
</style>
