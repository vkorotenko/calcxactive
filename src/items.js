var counter = 1;

/**
 * Результаты вычислений толщины и прочих параметров
 * @param {any} ptm - Приведенная толщина металла
 * @param {any} op - Обогреваемый периметр
 * @param {any} pp1 - Площадь поверхности / 1м
 * @param {any} ppt - Площадь поверхности / 1 т
 */
function calculated(ptm, op, pp1, ppt) {
  return {
    ptm: ptm,
    op: op,
    pp1: pp1,
    ppt: ppt,
    fire: []
  };
}

function createItem(items) {
  if (items != undefined) counter = Math.max(...items.map(o => o.id), 1) + 1;

  return {
    /**
     * Идентификатор
     */
    id: counter++,
    /**
     * Категория
     */
    mtype: 0,
    /**
     * Тип профиля
     */
    msub: "",
    /**
     * Пожароустойчивость
     */
    firestate: 45,
    /**
     * Приведенная толщина металла
     */
    castthickness: null,
    /**
     * Масса
     */
    mass: 1,
    square1: null,
    issquare: false,
    /**
     * Площадь покрываемой поверхности
     */
    square: null,
    /**
     * Толщина огнезащитного покрытия ,мм.
     */
    thickness: null,
    /**
     * Расход  кг/м2
     */
    span: null,
    /**
     * Общий расход  без учёта технологических потерь, кг.
     */
    totalspan: null
  };
}

export default {
  createItem: createItem,
  load: load1,
  calcval: calcval
};

var alpha;
var beta;
var coptm_1;
var coptm_2;
var ptm;
var o;
var yi;
var r;
var qy = "";

var ek;
var ppt;
var eu;
var coptm;
var k = 0;
var qe = 0;
var qq = 0;
var wy = 0;

var qk = new Array(45, 60, 90, 120);

import firestateLm from "./firestate/LM/";
import firestateRm from "./firestate/RM";

var s2 = firestateLm.s2_1;
var w = {};

function tnad(num) {
  return Math.round(num * 100) / 100;
}

function tnadt(num) {
  return Math.round(num * 1000) / 1000;
}

function calcval(paintid, u) {
  if (paintid == "LM") s2 = firestateLm.s2_1;
  if (paintid == "RM") s2 = firestateRm.s2_1;
  
  var qg = 0;
  var calcres;
  {
    o = 0;
    switch (qy) {
      case "DT":
        wy = u.p1;
        qe = u.s0;
        k = u.s0 + u.s1 + u.p1;
        qq = u.s1;
        o = o + u.s0;
        o = o + u.s0;
        o = o + k + u.s0 - wy;
        o = o + k + u.s0 - wy;

        qg = qe * qq * 2 + (k - qq - qq) * wy;
        break;
      case "TR":
        if (w[u]) k = parseFloat(w[u].D);
        o = k * Math.PI;
        break;
      case "TRS":
        k = parseFloat(u.d);
        o = k * Math.PI;
        break;
      case "19903-2015":
        o = 5 * 6;
        break;
      case "8240-97":
        if (w[u]) {
          let b = parseFloat(w[u].b);
          let h = parseFloat(w[u].h);
          let s = parseFloat(w[u].s);
          o = 2 * h + 4 * b - 2 * s;
        }
        break;

      case "57837-2017":
      case "20-93":
      case "26020-83":
      case "8239-89":
      case "19425-74":
        if (u) {
          try {
            let b = parseFloat(w[u].b);
            let s = parseFloat(w[u].s);
            let h = parseFloat(w[u].h);
            let R = parseFloat(w[u].R);

            o = 2 * h + 4 * b - 2 * s;
            o = o - 4 * R;
            o = o + Math.PI * R;
            o = o.toFixed(3);
          } catch (e) {
            window.console.log(e);
          }
        }
        break;
      case "8278-83":
        {
          let h = parseFloat(w[u].h);
          let b = parseFloat(w[u].b);
          let t = parseFloat(w[u].t);
          let R = parseFloat(w[u].R);

          o = 2 * h + 4 * b - 2 * t;
          o = o - 4 * (R + t);
          o = o - 4 * R;
          o = o + Math.PI * (R + t);
          o = o + Math.PI * R;
        }
        break;
      case "8509-93":
        {
          let h = parseFloat(w[u].h);
          let b = parseFloat(w[u].b);
          o = 2 * b + 2 * h;
        }

        break;
      case "30245-2003":
        if (u) {
          let h = parseFloat(w[u].h);
          let b = parseFloat(w[u].b);
          o = 2 * b + 2 * h;
          break;
        }
      //default:
    }
    if (o > 0.0001) {
      if (typeof w[u] == "undefined") {
        ptm = qg / o;
        if (qy === "19903-2015") {
          ptm = u / 2;
        }
        if (qy == "TRS") {
          let Dm = u.d;
          let tm = u.h;
          let dm = Dm - tm * 2;
          let Sm = (Math.PI / 4) * (Dm * Dm - dm * dm);
          ptm = (Sm * 100) / o / 100;
        }
      } else {
        if (qy == "TR") {
          var d = w[u].D - w[u].t * 2;
          var S = (Math.PI / 4) * (w[u].D * w[u].D - d * d);
          ptm = (S * 100) / o / 100;
        } else {
          ptm = (parseFloat(w[u].S) * 100) / o;
        }
      }
      eu = o / 1000;
      if (typeof w[u] == "undefined") {
        ppt = (1000 / ((qg / 1000) * 7.85)) * eu;
        if (qy === "19903-2015") ppt = getsquarefromheigth(u);
        if (qy == "TRS") ppt = eu * (1000 / getmasstrs(u.d, u.h));
      } else {
        if (qy == "TR") {
          ppt = eu * (1000 / w[u].m);
        } else {
          ppt = (1000 / w[u].m) * eu;
        }
      }

      calcres = calculated(ptm, o, eu, ppt);

      var optm = ptm;
      ptm = parseInt(ptm * 5 + 0.125);
      if (ptm > 36) {
        ptm = 36;
      }
      if (ptm < 0) {
        ptm = 0;
      }

      for (var f in qk) {
        var t = (r = yi = ek = "-");
        var time;

        optm = tnad(optm);
        time = qk[f];
        if (optm > s2[time].f) {
          coptm = optm * 1 > s2[time].l * 1 ? s2[time].l : optm;
          if (!s2[time][coptm]) {
            alpha = Math.round(((coptm * 10) % 2) * 10) / 100;
            coptm_1 = tnad(coptm - alpha);
            coptm_2 = tnad(coptm - alpha + 0.2);
            beta = tnad(s2[time][coptm_1][0] - s2[time][coptm_2][0]);
            t = tnadt(s2[time][coptm_1][0] - tnadt((beta * alpha) / 0.2));
            r = tnadt(s2[time][coptm_1][1] - tnadt((beta * alpha) / 0.2));
          } else {
            t = s2[time][coptm][0];
            r = s2[time][coptm][1];
          }
          yi = (r * eu).toFixed(3);
          ek = (r * ppt).toFixed(3);
          r = r.toFixed(3);
        }

        calcres.fire.push({ t: t, r: r, ek: ek, yi: yi });
      }
    }
  }
  return calcres;
}

function getsquare(d, h) {
  var dv = d - h * 2;
  var dn = d;
  return Math.PI * ((dn * dn - dv * dv) / 4);
}
function getmasstrs(d, h) {
  return (getsquare(d, h) * 1000 * 7.85) / 1000000;
}

/**
 * Получение площади поверхности в метрах квадратных
 * @param {any} h - толщина в миллиметрах
 */
function getsquarefromheigth(h) {
  return 254.777 / h;
}

import data8278 from "./typos/data8278";
import data57837 from "./typos/data57837";
import d2093 from "./typos/data2093";
import d26020 from "./typos/data26020";
import d8239 from "./typos/data8239";
import d19425 from "./typos/data19425";
import d8240 from "./typos/data8240";
import datatr from "./typos/datatr";
import data8509 from "./typos/data8509";
import data30245 from "./typos/data30245";

function load1(ye) {
  qy = ye;
  switch (qy) {
    case "57837-2017":
      w = data57837;
      break;
    case "20-93":
      w = d2093;
      break;
    case "26020-83":
      w = d26020;
      break;
    case "8239-89":
      w = d8239;
      break;
    case "19425-74":
      w = d19425;
      break;
    case "8240-97":
      w = d8240;
      break;
    case "TR":
      w = datatr;
      break;
    case "8278-83":
      w = data8278.w;
      break;
    case "8509-93":
      w = data8509;
      break;
    case "30245-2003":
      w = data30245;
      break;
    default:
      w = {};
  }

  return w;
}
