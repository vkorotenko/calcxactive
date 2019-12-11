<template>
    <Dropdown :class-name="'tp-class'" :close-on-click="true">
        <template slot="btn">
            <span v-html="btn" style="margin-right: auto;"></span>
        </template>
        <template slot="body">
            <ul>
                <li v-for="item in items" v-bind:key="item.id" @click="onSelectItem(item.id)">
                    <span v-html="item.name" />
                </li>
            </ul>
        </template>
    </Dropdown>
</template>
<script>
    import Dropdown from 'bp-vuejs-dropdown';
    import { String } from 'core-js';
    export default {
        name: 'typecell',
        components: { Dropdown },
        props: {
            items: Array,
            value: String
        },
        mounted() {
            if (this.value) {
                let res = this.items.filter(value => value.id == this.value);
                if (res)
                    this.btn = res[0].name;
            } else {
                this.bth = this.items[0].name;
            }            
        },
        methods: {
            onSelectItem: function (id) {
                const sel = this.items.find(x => x.id === id);
                this.btn = sel.name;
                this.$emit('type-changed', id);
            }
        },
        data: function () {
            return {
                btn: this.items[0].name
            };
        }

    };
</script>
<style>

    .tp-class-bp__btn {
        background: white;
    }

    .bp-dropdown__btn {
        border: solid 0px gray;
    }

    .tp-class-bp__btn--active {
        background: #fff;
    }

    .tp-class-bp__body {
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