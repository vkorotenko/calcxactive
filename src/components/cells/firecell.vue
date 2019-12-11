<template>
    <Dropdown :class-name="'tp-class'" :close-on-click="true">
        <template slot="btn">
            <span v-html="btn" style="margin-right: auto;"></span>
        </template>
        <template slot="body">
            <ul>
                <li v-for="item in items" v-bind:key="item.id" @click="onSelectItem(item.id)">
                    <span v-html="item.name"></span>
                </li>
            </ul>
        </template>
    </Dropdown>
</template>
<script>
    import Dropdown from 'bp-vuejs-dropdown'
    import { Number } from 'core-js';
    import { isNumber } from 'util';
    export default {
        name: 'firecell',
        components: { Dropdown },
        props: {
            items: Array,
            selected: Number
        },
        mounted() {
            if (isNumber(this.selected)) {
                let res = this.items.filter(value => value.id == this.selected);
                if (res)
                    this.btn = res[0].name;
            } else {
                this.bth = this.items[0].name;
            }

        },
        methods: {
            onSelectItem: function (e) {
                const sel = this.items.find(x => x.id === e);
                this.btn = sel.name;
                this.$emit('fire-selected', e);
            }
        },
        data: function () {
            return {
                btn: ''
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
        padding: 0px;
        font-size: 10px;
    }

        .tp-class-bp__body ul {
            list-style: none;
            margin: 0 0 0 0;
            padding: 0px;
        }

        .tp-class-bp__body > ul > li {
            margin: 2px 2px 2px 2px;
            padding: 5px;
            padding: 5px;
            text-align: left;
            cursor: pointer;
            border: 1px solid transparent;
        }

            .tp-class-bp__body > ul > li:hover {
                border: 1px solid gray;
                padding: 5px;
                background-color: #ececec;                
            }

    @media print {
        .bp-dropdown__icon {
            display: none;
        }
    }
</style>