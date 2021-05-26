
export default {
  // functional:true 表示该组件是纯函数组件
  // 会进行检查，只能用 props 而不能使用组件内部的 state
  functional: true,
  props: ['row', 'col'],
  // h 作为 createElement 的别名
  render (h, { props: { row, col }}) {
    return row[col.prop]
  }
}
