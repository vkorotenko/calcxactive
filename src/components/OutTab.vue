<template>
    <table id="outtab" style="display:none">
        <tr>
            <td class="exheader" colspan="9" align="center" valign="middle">Расчет объемов по нанесению огнезащитного состава {{paint.fullname}}</td>
        </tr>
        <tr>
            <td class="exsubheader" colspan="9" align="center" valign="middle">Обьект:</td>
        </tr>
        <tr>
            <td nowrap class='ths tb1' valign="baseline">Наименование элемента, профиля, наименование или марка металла ГОСТ, TV</td>
            <td class='ths tb2' valign="baseline">Номер или размер профиля, мм. </td>
            <td class='ths  tb2' valign="baseline">Предел огнестойкости элемента (R), мин.</td>
            <td class='ths tb2' valign="baseline">Приведенная толщина элемента, мм.</td>
            <td class='ths tb2' valign="baseline">Масса металла, т.</td>
            <td class='ths tb2' valign="baseline">Площадь покрываемой поверхности, м2</td>
            <td class='ths tb2' valign="baseline">Толщина огнезащитного покрытия "{{paint.name.toUpperCase()}}", мм.</td>
            <td class='ths tb2' valign="baseline">Расход "{{paint.name.toUpperCase()}}" кг/м2</td>
            <td class='ths tb2' valign="baseline">Общий расход "{{paint.name.toUpperCase()}}"  без учёта технологических потерь, кг.</td>
        </tr>
        <tr class="numbers">
            <td class="tb1">1</td>
            <td class="tb2">2</td>
            <td class="tb2">3</td>
            <td class="tb2">4</td>
            <td class="tb2">5</td>
            <td class="tb2">6</td>
            <td class="tb2">7</td>
            <td class="tb2">8</td>
            <td class="tb2">9</td>
        </tr>

        <!-- data repeater -->
        <tr class="ta-r" v-for="item in filtereditems" 
            v-bind:key="item.id"
            v-bind:item="item">
            <td class="tb11">
                <span v-html=" getName(item.mtype) " style="margin-right: auto;"></span>                
            </td>
            <td class="tb21">
                <template v-if="item.mtype !='DT'">
                    {{item.msub}}
                </template>
                <template v-else>
                    {{`${item.msub.s0} x ${item.msub.s1} x ${item.msub.p0} x ${item.msub.p1}`}}
                </template>

            </td>
            <td class="tb21" align=right>
                {{item.firestate}}
            </td>
            <td class="tb21" align=right>
                {{item.castthickness | safeNumber }}
            </td>
            <td class="tb21" align=right>
                {{item.mass | safeNumber }}
            </td>
            <td class="tb21" align=right>
                {{item.square1 | safeNumber }}
            </td>
            <td class="tb21" align=right>
                {{ item.thickness | safeNumber }}
            </td>
            <td class="tb21" align=right>
                {{ item.span | safeNumber }}
            </td>
            <td class="tb21" align=right>
                {{ item.totalspan | safeNumber }}
            </td>
        </tr>


        <!-- 1 st -->
        <tr class="" style="font-weight: bold;">
            <td class="tb11 tdr" rowspan="3" style="font-size: 14px; font-weight: bold;">Итого:</td>
            <td class="tb21 tdr" colspan="7">{{paint.name}}</td>
            <td class="tb21">{{ totalspan  | formatNumber}}</td>
        </tr>
        <tr class="">
            <td class="tb21" colspan="7"></td>
            <td class="tb21">&nbsp;</td>
        </tr>
        <tr class="" style="font-weight: bold;">
            <td class="tb21 tdr" colspan="7">{{paint.name}}</td>
            <td class="tb21"> {{ totalspan  | formatNumber}}</td>
        </tr>
        <tr class="" style="font-weight: bold;">
            <td class="tb11 tdr tdb" colspan="8">Итого с учетом технологических потерь 25% (запас на сварные швы, болтовые соединения, ребра жесткости и прочие факторы:</td>
            <td class="tb21 tdb"> {{totalspan25perc | formatNumber }} </td>
        </tr>
    </table>
</template>
<script>
    import { Array, Number } from 'core-js';    
    export default {
        name: 'outtable',
        props: {
            items: Array,
            totalspan: Number,
            totalspan25perc: Number,
            mattypes: Array,
            paint: Object
        },
        computed: {
            filtereditems: function () {
                return this.items.filter(value => value.mtype != 0)
            }
        },
        methods:
        {
            getName: function (id) {
                let res = this.mattypes.filter(value => value.id == id);
                if (res)
                    return res[0].name;
            }
        },        
        data: function () {
            return {
            };
        }
    };
</script>
<style type="text/css" csoped>

    #outtab > tr > td {
        text-align: center;
        font-size: 8px;
    }
    #outtab .ths{
        width: 28px;
    }

    #outtab {
        border-collapse: collapse;
    }

    .tdb {
        border: solid 1px gray;
    }

    .tb1 {
        border: solid 2px gray;
        border-left: solid 0px gray;
    }

    .tb2 {
        border: solid 2px gray;
    }

    .tb11 {
        border: solid 1px gray;
        border-left: solid 0px gray;
        border-right: solid 2px gray;
    }

    .tb21 {
        border: solid 1px gray;
        border-right: solid 2px gray;
    }

    .exheader {
        font-size: 12px;
        font-family: Georgia, 'Times New Roman', Times, serif;
        font-weight: bold;
        height: 1rem;
        border: solid 0px gray !important;
    }

        .exheader td {
            border: 0px solid gray;
        }

    .exsubheader {
        font-size: 10px;
        font-family: Georgia, 'Times New Roman', Times, serif;
        font-weight: bold;
        height: 2rem;
        border: solid 0px gray !important;
    }

        .exsubheader td {
            border: 0px solid gray;
        }


    .numbers > td {
        font-weight: bold;
    }

    .tdr {
        text-align: right !important;
    }

    .tdb {
        border-bottom: 2px solid gray;
    }

    .export-bar {
        width: 100%;
        text-align: right;
    }

        .export-bar button {
            margin-left: 5px;
        }

    @media print {
        .export-bar {
            display: none;
        }

        .help {
            display: none;
        }
    }
</style>