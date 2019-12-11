
import Vue from 'vue';
import Suggestions from 'v-suggestions';
import 'v-suggestions/dist/v-suggestions.css'; // you can import the stylesheets also (optional)

import Dropdown from 'bp-vuejs-dropdown';
import OgneTitanCalc from './OgneTitanCalc.vue';

Vue.config.productionTip = false;


// global
Vue.use(Dropdown);
Vue.component('suggestions', Suggestions);

Vue.filter('formatNumber',
  function (value) {
      if (!value) return '';
    if(typeof value === 'string') {
        value = parseFloat(value);
    }
    const options = {
      maximumFractionDigits: 4
    };
    return value.toLocaleString('ru', options);
  });
  Vue.filter('safeNumber',
  function (value) {
    if (!value) return '';      
    if(typeof value === 'string') {      
        value = parseFloat(value);
    }    
    const options = {
      maximumFractionDigits: 4
    };
    return value.toLocaleString('ru', options);
  });
  
  
new Vue({
  render: h => h(OgneTitanCalc),
}).$mount('#ognetitancalc');
