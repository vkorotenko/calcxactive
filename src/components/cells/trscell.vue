<template>
  <div v-if="visible" class="tooltip">
    <input      
     class="ti"
      :class="elclass"
      v-model="query"      
      placeholder="D x t Диаметр, толщина стенки "
      @keyup="keyup()"
    />
    <span class="tooltiptext">
      D x t Диаметр, толщина стенки 
    </span>
  </div>
</template>
<script>
export default {
  name: "trscell",
  props: {
    item: Object
  },
  mounted() {
    if (this.item.msub) {
      let ms = this.item.msub;
      this.query = `${ms.d}x${ms.h}`;
    }
  },
  methods: {
    keyup: function() {      
      let items = this.query.split("x");
      let ret = false;
      this.elclass = "error-input";
      let D = parseFloat(items[0]);
      let h = parseFloat(items[1]);
      
      window.console.log(isNaN(D) || isNaN(h));
      if (isNaN(D) || isNaN(h)) ret = true;
      else if (D < h * 2) ret = true;
      else {
        let r = { d: D, h: h };        
        this.elclass = "";
        this.$emit("trs-changed", r);
      }
      return ret;
    }
  },
  computed: {
    visible: function() {
      return this.item !== null && this.item.mtype == "TRS";
    }
  },
  data: function() {
    return {
      query: "",
      elclass: "",
      haserror: true
    };
  }
};
</script>

<style>
.error-input {
  border: 1px solid crimson;
  outline: none;
}

.tooltip {
  position: relative;
  width: 100%;
}
.tooltip input{
  text-align: right;  
}
.ti{
  width: calc(100% - 5px);
}

.tooltip  .tooltiptext {

  width: 240px;
  bottom: 150%;
  left: 50%;
  margin-left: -120px; 
  visibility: hidden;  
  background-color: #ff9800;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;    
  /* Fade in tooltip - takes 1 second to go from 0% to 100% opac: */
  opacity: 0;
  transition: opacity 0.6s;
}

.tooltip:hover  .tooltiptext {
  visibility: visible;
  opacity: 1;
}

.tooltip .tooltiptext::after {
  content: " ";
  position: absolute;
  top: 100%; /* At the bottom of the tooltip */
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #ff9800 transparent transparent transparent;
}
</style>
