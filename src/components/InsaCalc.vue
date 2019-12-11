<template>
  <div class="calc">
    <div class="box">
      <select class="paint_select" @change="onChangePaint" v-model="cyrpaint">
        <option
          v-for="paint in paintType"
          v-bind:key="paint.id"
          :value="paint.id"
          >{{ paint.name }}</option
        >
      </select>
    </div>
    <table class="extbl" id="resultTable">
      <tr>
        <td class="exheader" colspan="9" align="center">
          Расчет объемов по нанесению огнезащитного состава
          {{ selectedpaint.fullname.toUpperCase() }}
        </td>
      </tr>
      <tr>
        <td class="exsubheader" colspan="9" align="center">Обьект:</td>
      </tr>
      <tr>
        <td nowrap class="ths tb1">
          Наименование элемента, профиля, наименование или марка металла ГОСТ,
          TV
        </td>
        <td class="ths tb2">
          Номер или размер профиля,
          <br />мм.
        </td>
        <td class="ths tb2">
          Предел огнестойкости элемента (R),
          <br />мин.
        </td>
        <td class="ths tb2">
          Приведенная толщина элемента,
          <br />мм.
        </td>
        <td class="ths tb2">
          Масса металла,
          <br />т.
        </td>
        <td class="ths tb2">
          Площадь покрываемой поверхности,
          <br />м2
        </td>
        <td class="ths tb2">
          Толщина огнезащитного покрытия "{{
            selectedpaint.name.toUpperCase()
          }}", <br />мм.
        </td>
        <td class="ths tb2">
          Расход "{{ selectedpaint.name.toUpperCase() }}" <br />кг/м2
        </td>
        <td class="ths tb2">
          Общий расход "{{ selectedpaint.name.toUpperCase() }}" <br />без учёта
          технологических потерь, <br />кг.
        </td>
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
      <Rowitem
        v-for="item in items"
        :v-if="visible"
        v-bind:key="item.id"
        v-bind:item="item"
        @type-changed="onTypeChanged"
        v-bind:mattypes="mattypes"
        v-bind:limitfire="limitfire"
        v-bind:paintid="selectedpaint.id"
      />
      <!-- 1 st -->
      <tr class style="font-weight: bold;">
        <td
          class="tb11 tdr"
          rowspan="3"
          style="font-size: 14px; font-weight: bold;"
        >
          Итого:
        </td>
        <td class="tb21 tdr" colspan="7">{{ selectedpaint.name }}</td>
        <td class="tb21">{{ totalspan | formatNumber }}</td>
      </tr>
      <tr class>
        <td class="tb21" colspan="7"></td>
        <td class="tb21">&nbsp;</td>
      </tr>
      <tr class style="font-weight: bold;">
        <td class="tb21 tdr" colspan="7">{{ selectedpaint.name }}</td>
        <td class="tb21">{{ totalspan | formatNumber }}</td>
      </tr>
      <tr class style="font-weight: bold;">
        <td class="tb11 tdr tdb" colspan="8">
          Итого с учетом технологических потерь 25% (запас на сварные швы,
          болтовые соединения, ребра жесткости и прочие факторы:
        </td>
        <td class="tb21 tdb">{{ totalspan25perc | formatNumber }}</td>
      </tr>
    </table>

    <br />
    <div class="export-bar">
      <button @click="saveData">Сохранить</button>
      <input
        type="file"
        value="Загрузить"
        id="file"
        ref="myFiles"
        class="custom-file-input inputfile"
        @change="restoreItems"
      />
      <label for="file">Выберите файл</label>
      <button @click="exportToExcel">Экспортировать</button>
    </div>
    <div class="help">
      <h2>Помощь по использованию программы</h2>
      Данная программа предназначена для автоматического расчета расхода
      защитного покрытия <b>{{ selectedpaint.name }}</b> и экспорта данных в
      формат электронной таблицы Excel.
      <ul>
        <li>
          Для начала расчета выберите в столбце "Наименование элемента, профиля,
          наименование или марка металла ГОСТ, TV" необходимый тип профиля.
        </li>
        <li>
          В столбце "Номер или размер профиля,мм." выберите необходимый размер,
          в случае предопределенных гостом размером будет выведен выпадающий
          список, ограниченный 10 наименованиями, продолжайте вводить если не
          видите нужного вам профиля.
        </li>
        <li>
          В столбце "Масса металла" введите суммарную массу изделий. Система
          автоматически пересчитает все значения
        </li>
        <li>
          В столбце "Предел огнестойкости элемента (R)" введите нужную
          огнестойкость. Система автоматически пересчитает все значения.
        </li>
        <li>
          При необходимости ввода обьема в площади изделия щелкните по столбцу
          "Площадь покрываемой поверхности" и введите нужное значение. Система
          автоматически пересчитает все значения.
        </li>
        <li>
          Завершив ввод, нажмите кнопку "Экспортировать" система предложит
          выбрать имя файла и сохранит файл в формате эксель.
        </li>
        <li>
          Так-же выбрав пункт "выберите тип профиля, вы можете удалить лишнюю
          строку."
        </li>
        <li>
          Так-же завершив ввод, вы можете нажать кнопку "Сохранить" система
          предложит выбрать имя файла и сохранит файл во внутреннем формате, что
          позволит в будущем не повторять ввод значений снова.
        </li>
        <li>
          Если вам нужно загрузить предыдущий расчет, нажмите кнопку "Выберите
          файл", после выбора файла система загрузит сохраненный файл и заполнит
          данные.
        </li>
      </ul>

      <p>
        Внимание: экспортированные данные в формате эксель не содержат формул и
        не пересчитываются автоматически!!!
      </p>
    </div>

    <OutTab
      :items="items"
      :totalspan="totalspan"
      :mattypes="mattypes"
      :paint="selectedpaint"
      :totalspan25perc="totalspan25perc"
    />
  </div>
</template>
<script>
import Rowitem from "./rowitem.vue";
import Items from "@/items.js";
import OutTab from "./OutTab.vue";
import FileSaver from "file-saver";

const mattypes = [
  { id: 0, name: "Выберите тип профиля" },
  {
    id: "20-93",
    name: "<b>Двутавры с параллельными гранями полок</b> по СТО АСЧМ 20-93"
  },
  {
    id: "26020-83",
    name: "<b>Двутавры с параллельными гранями полок</b> по ГОСТ 26020-83"
  },
  {
    id: "8239-89",
    name: "<b>Двутавры с параллельными гранями полок</b> по ГОСТ 8239-89"
  },
  {
    id: "19425-74",
    name: "<b>Двутавры с параллельными гранями полок</b> по ГОСТ 19425-74"
  },
  {
    id: "57837-2017",
    name: "<b>Двутавры с параллельными гранями полок</b> по ГОСТ 57837-2017"
  },
  { id: "DT", name: "<b>Двутавр </b> СВАРНОЙ по размерам" },
  {
    id: "8240-97",
    name:
      "<b>Швеллеры стальные горячекатанные</b> по ГОСТ 8240-97 С255 ГОСТ 27772-2015"
  },
  {
    id: "8278-83",
    name: "<b>Швеллеры стальные горячекатанные</b> по ГОСТ 8278-83"
  },
  {
    id: "8509-93",
    name:
      "<b>Сталь прокатная угловая равнополочная</b> по ГОСТ 8509-93, С255 ГОСТ 27772-2015"
  },
  { id: "TR", name: "<b>Трубы</b> по Вст3пс6 ГОСТ 380-2005" },
  { id: "TRS", name: "<b>Трубы</b> по размерам" },
  {
    id: "30245-2003",
    name:
      "<b>Профили стальные гнутые замкнутые сварные квадратные и прямоугольные для строительных конструкций</b> ГОСТ 30245-2003, С255 ГОСТ 27772-2015"
  },
  {
    id: "19903-2015",
    name:
      "<b>Прокат листовой горячекатаный</b> по ГОСТ 19903-2015, С255 ГОСТ 27772-2015"
  }
];

const limitfire = [
  { id: 45, name: "R45 (45 минут)" },
  { id: 60, name: "R60 (60 минут)" },
  { id: 90, name: "R90 (90 минут)" },
  { id: 120, name: "R120 (120 минут)" }
];

const paintType = [
  {
    id: "LM",
    name: "Огнетитан LM",
    fullname: '"ОГНЕТИТАН LM" (ТУ 2310-009-3495485-2016)'
  },
  {
    id: "RM",
    name: "Огнетитан RM",
    fullname: '"ОГНЕТИТАН RM" (ТУ 2310-002-03495485-2016)'
  }
];

function downloadFile(fileName, body) {
  var uri = "data:application/json;base64,";

  function base64(s) {
    return window.btoa(unescape(encodeURIComponent(s)));
  }
  function downloadURI(uri, fileName) {
    var link = document.createElement("a");
    var doc = prompt("Выберите имя файла для сохранения", fileName);
    window.console.log(doc);
    if (doc != null) {
      link.download = doc;
      link.href = uri;
      window.console.log(uri);
      FileSaver.saveAs(uri, doc);
    }
  }
  var resuri = uri + base64(body);
  downloadURI(resuri, fileName);
}
var tableToExcel = (function() {
  var uri = "data:application/vnd.ms-excel;base64,",
    template =
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>',
    base64 = function(s) {
      return window.btoa(unescape(encodeURIComponent(s)));
    },
    format = function(s, c) {
      return s.replace(/{(\w+)}/g, function(m, p) {
        return c[p];
      });
    },
    downloadURI = function(uri, name) {
      var link = document.createElement("a");
      link.download = name;
      link.href = uri;
      FileSaver.saveAs(uri, name);
    };

  return function(table, name, fileName) {
    if (!table.nodeType) table = document.getElementById(table);
    var ctx = { worksheet: name || "Worksheet", table: table.innerHTML };
    var resuri = uri + base64(format(template, ctx));
    downloadURI(resuri, fileName);
  };
})();

export default {
  name: "InsaCalc",
  props: {},
  components: {
    Rowitem,
    OutTab
  },
  methods: {
    onTypeChanged: function(/*id*/) {
      this.cleanUpData();
    },
    cleanUpData: function() {
      let outitem = [];
      this.items.forEach(value => {
        const mtype = value.mtype;
        if (mtype !== 0) {
          outitem.push(value);
        }
      });

      this.visible = false;

      if (outitem[outitem.length - 1].mtype !== 0) {
        outitem.push(Items.createItem(this.items));
      }
      this.items = [];
      outitem.forEach(value => {
        this.items.push(value);
      });
      if (this.items.length === 0)
        this.items.push(Items.createItem(this.items));

      this.$nextTick().then(() => {
        this.visible = true;
      });
    },
    saveData: function() {
      const tostr = this.items;
      const data = JSON.stringify(tostr);
      let date = new Date();
      const filename = `${date.getFullYear()}_${date.getMonth()}_${date.getDay()}_order.json`;
      downloadFile(filename, data);
    },
    exportToExcel: function() {
      var name = this.selectedpaint.name.toString();
      var doc = prompt(
        "Имя файла для экспорта в эксель",
        `Расчет огнезащиты ${name}.xls`
      );
      if (doc != null) {
        tableToExcel("outtab", "расчет материала", doc);
      }
    },
    restoreItems: function() {
      this.files = this.$refs.myFiles.files;
      var first = this.$refs.myFiles.files[0];
      var self = this;
      if (first) {
        let reader = new FileReader();
        reader.readAsText(first, "UTF-8");
        reader.onload = function(evt) {
          let items = JSON.parse(evt.target.result);
          self.items = [];
          self.$nextTick().then(() => {
            items.forEach(elem => {
              let newitem = Items.createItem(self.items);

              // заполняем значения по одному что бы вызывались вычисления в нужном порядке
              newitem.mtype = elem.mtype;
              newitem.firestate = elem.firestate;
              newitem.msub = elem.msub;
              newitem.castthickness = elem.castthickness;
              newitem.mass = elem.mass;
              self.items.push(elem);
            });
          });
        };
        reader.onerror = function(/*evt*/) {
          // todo: add messages for fail in restore
        };
      }
    },
    onChangePaint: function(/*event*/) {
      this.selectedpaint = paintType.find(x => x.id === this.cyrpaint);
    }
  },
  mounted() {
    this.items.push(Items.createItem(this.items));
  },
  computed: {
    totalspan25perc: function() {
      return this.totalspan * 1.25;
    },
    totalspan: function() {
      let initialValue = 0;
      let sum = this.items.reduce(
        (accumulator, currentValue) => accumulator + currentValue.totalspan,
        initialValue
      );
      return sum;
    }
  },
  data: function() {
    return {
      mattypes: mattypes,
      limitfire: limitfire,
      visible: true,
      paintType: paintType,
      cyrpaint: paintType[0].id,
      selectedpaint: paintType[0],
      items: [],
      files: []
    };
  }
};
</script>
<style type="text/css">
.extbl > tr > td {
  text-align: center;
  /*font-size: 8px;*/
}

.extbl {
  width: 100%;
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
  /*font-size: 12px;*/
  font-family: Georgia, "Times New Roman", Times, serif;
  font-weight: bold;
  height: 1rem;
  border: solid 0px gray !important;
}

.exheader td {
  border: 0px solid gray;
}

.exsubheader {
  /*font-size: 10px;*/
  font-family: Georgia, "Times New Roman", Times, serif;
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
.paint_select {
  margin-left: auto;
  display: block;
  border: 1px solid lightgray;
  padding: 6px;
}
.box {
  position: absolute;
  top: 6px;
  right: 7px;
}

.box select {
  background-color: #ff9800;
  color: white;
  padding: 12px;
  width: 250px;
  border: none;
  font-size: 20px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  -webkit-appearance: button;
  appearance: button;
  outline: none;
}

.box::before {
  content: "v";
  font-family: FontAwesome;
  position: absolute;
  top: 0;
  right: 0;
  width: 20%;
  height: 100%;
  text-align: center;
  font-size: 28px;
  line-height: 45px;
  color: rgba(255, 255, 255, 1);
  background-color: rgba(255, 255, 255, 0.1);
  pointer-events: none;
}

.box:hover::before {
  color: rgba(255, 255, 255, 0.6);
  background-color: rgba(255, 255, 255, 0.2);
}

.box select option {
  padding: 30px;
}
.inputfile {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
.inputfile + label {
  
  margin-top: 1px;
  margin-left: 5px;
  border: 1px solid #aaa;
  background-color: white;
  border-radius: 2px;
  padding: 5px;
  display: inline-block;
}

.inputfile:focus + label,
.inputfile + label:hover {
  background-color: lightgray;
  box-shadow: 4px 4px 4px 0px rgba(184, 182, 182, 0.7);
}

button {
  margin-left: 5px;
  border: 1px solid #aaa;
  background-color: white;
  border-radius: 2px;
  padding: 6px;
}

button:hover {
  background-color: lightgray;
  box-shadow: 4px 4px 4px 0px rgba(184, 182, 182, 0.7);
}

@media print {
  .export-bar {
    display: none;
  }

  .help {
    display: none;
  }
  .box {
    display: none;
  }
}
</style>
