<template>
  <div class="tooltip">
    <suggestions
      v-model="query"
      v-if="visible"
      class="tooltip"
      :options="options"
      :onItemSelected="onItemSelected"
      :onInputChange="onItemChange"
    >
    </suggestions>
    <span class="tooltiptext"
      >Начните ввод типоразмера, будут выведены первые 10 значений из
      справочника</span
    >
  </div>
</template>
<script type="text/javascript">
export default {
  name: "autocomplite",
  props: {
    items: Array,
    item: Object
  },
  mounted() {
    if (this.item.msub) {
      this.query = this.item.msub;
    }
  },
  methods: {
    onItemChange(query) {
      if (query.trim().length === 0) {
        return false;
      }
      let qlc = query.toLowerCase();
      return this.items
        .filter(item => {
          if (item == 0 || item == 1 || item == 2) return false;
          return item.toLowerCase().includes(qlc);
        })
        .slice(0, 10);
    },
    onItemSelected(item) {
      this.item.msub = item;
      this.selectedItem = item;
      this.query = item;
      this.$emit("profil-changed");
    }
  },
  computed: {
    visible: function() {
      return this.items !== null && this.item.mtype != "DT";
    }
  },
  data: function() {
    return {
      query: "",
      sitems: this.items,
      selectedItem: null,
      options: {
        debounce: 200,
        placeholder: "Название профиля",
        inputClass: "autocomplite-box"
      }
    };
  }
};
</script>

<style>
.autocomplite-box {
  text-align: right;
  position: relative;
  /*font-size: 8px;*/
  padding: 2px;
  width: calc(100% - 8px);
}

@media print {
  .autocomplite-box {
    border: solid 0px gray;
  }
}
</style>
