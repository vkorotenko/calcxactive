<template>
  <tr class="ta-r">
    <td class="tb11">
      <TypeCell
        :items="mattypes"
        :value="item.mtype"
        @type-changed="onTypeChanged"
        class="type-cell"
      />
    </td>
    <td class="tb21">
      <DtCell
        :item="item"
        :items="profilitems"
        @dt-changed="onDtChanged"
        v-if="item.mtype == 'DT'"
      />
      <TrsCell
        :item="item"
        :items="profilitems"
        @trs-changed="onTrsChanged"
        v-if="item.mtype == 'TRS'"
      />
      <ProkatCell
        :item="item"
        @procat-selected="onProcatChanged"
        v-else-if="item.mtype == '19903-2015'"
      />
      <Autocomplite
        :item="item"
        :items="profilitems"
        @profil-changed="onProfilChanged"
        v-else
      />
    </td>
    <td class="tb21">
      <FireCell
        :items="limitfire"
        v-if="item.mtype != 0"
        :selected="item.firestate"
        @fire-selected="onFireChanged"
      />
    </td>
    <td class="tb21">
      {{ item.castthickness | formatNumber }}
    </td>
    <td class="tb21">
      <input
        v-model="item.mass"
        v-if="!item.issquare && item.mtype != 0"
        class="autocomplite-box"
        @change="massChange"
      />
      <span v-if="item.issquare" @click="item.issquare = !item.issquare">
        {{ item.mass }}
      </span>
    </td>
    <td class="tb21">
      <input
        v-model="item.square1"
        v-if="item.issquare"
        class="autocomplite-box"
        @change="squareTotalChange"
      />
      <span v-if="!item.issquare" @click="item.issquare = !item.issquare">
        {{ item.square1 }}
      </span>
    </td>
    <td class="tb21">
      {{ item.thickness }}
    </td>
    <td class="tb21">
      {{ item.span }}
    </td>
    <td class="tb21">
      {{ item.totalspan | formatNumber }}
    </td>
  </tr>
</template>
<script type="text/javascript">
import { Array } from "core-js";
import TypeCell from "./cells/typecell.vue";
import Items from "@/items.js";
import Autocomplite from "./cells/autocomplite.vue";
import DtCell from "./cells/dtcell.vue";
import TrsCell from "./cells/trscell.vue";
import FireCell from "./cells/firecell.vue";
import ProkatCell from "./cells/prokatcell.vue";

export default {
  name: "rowitem",
  props: {
    item: Object,
    mattypes: Array,
    limitfire: Array,
    paintid: String
  },
  mounted() {
    if (this.item.mtype != 0) {
      this.onTypeChanged(this.item.mtype);
    }
  },
  components: {
    TypeCell,
    FireCell,
    Autocomplite,
    DtCell,
    TrsCell,
    ProkatCell
  },
  computed: {},
  methods: {
    onTypeChanged: function(id) {
      this.item.mtype = id;
      const u = id.toString();
      let itm = Items.load(u);
      this.profilitems = Object.keys(itm);
      this.profitem = this.item;
      this.$emit("type-changed", id);
      this.checkCastTh();
    },
    onDtChanged: function(dt) {
      this.item.mtype = "DT";
      // example 2(100 x 10) + (100 x 10)
      let msub = dt;
      this.item.msub = msub;
      this.$emit("type-changed", dt);
      this.checkCastTh();
    },
    onTrsChanged: function(dts) {
      window.console.log('trs')
      window.console.log(dts)
      this.item.mtype = "TRS";
      let msub = dts;
      this.item.msub = msub;
      this.$emit("type-changed", dts);
      this.checkCastTh();
    },
    onProcatChanged: function(size) {
      this.item.mtype = "19903-2015";
      this.item.msub = size;
      this.$emit("type-changed", size);
      this.checkCastTh();
    },
    onFireChanged: function(id) {
      this.item.firestate = id;
      this.checkCastTh();
    },
    checkCastTh: function() {
      let it = this.item;
      Items.load(it.mtype);
      if (it.mtype !== 0 && it.msub) {
        let calcres = Items.calcval(this.paintid, it.msub);
        it.castthickness = calcres.ptm;
        it.square = calcres.ppt;

        if (it.firestate == 60) {
          this.setfirestate(it, calcres, 1);
        } else if (it.firestate == 90) {
          this.setfirestate(it, calcres, 2);
        } else if (it.firestate == 120) {
          this.setfirestate(it, calcres, 3);
        } else {
          this.setfirestate(it, calcres, 0);
        }
      }
    },
    setfirestate: function(it, calcres, num) {
      it.thickness = calcres.fire[num].t;
      it.span = calcres.fire[num].r;
      it.totalspan = calcres.fire[num].ek * it.mass;
    },
    onProfilChanged: function() {
      this.checkCastTh();
      this.massChange();
    },
    squareTotalChange: function() {
      let it = this.item;

      if (it.mtype !== 0 && it.msub && this.item.issquare) {
        let calcres = Items.calcval(this.paintid , it.msub);
        it.castthickness = calcres.ptm;
        it.square = calcres.ppt;
        it.mass = (1 / calcres.ppt) * it.square1;
      }
      this.checkCastTh();
    },
    massChange: function() {
      this.checkCastTh();

      if (this.item.mass && !this.item.issquare) {
        this.item.square1 = this.item.mass * this.item.square;
      }
    }
  },
  data: function() {
    return {
      profilitems: null
    };
  }
};
</script>
<style>
.ta-r td {
  text-align: right !important;
}

.type-cell {
  text-align: right;
  border: solid 0px gray;
}
</style>
