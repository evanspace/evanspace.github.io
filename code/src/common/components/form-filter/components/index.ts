import text from './text.vue'
import number from './number.vue'
import select from './select.vue'
import cascader from './cascader.vue'
import checkbox from './checkbox.vue'
import radio from './radio.vue'
import color from './color.vue'
import rate from './rate.vue'
import tSwitch from './switch.vue'
import slider from './slider.vue'
import date from './date.vue'
import file from './file.vue'
import tree from './tree.vue'
import time from './time.vue'

export default {
  text,
  password: text,
  textarea: text,

  select,
  number,
  cascader,
  checkbox,
  radio,
  color,
  rate,
  switch: tSwitch,
  slider,
  date,
  file,
  tree,
  time,
}