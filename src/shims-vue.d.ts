// declare module '*.png' {
//   const value: string
//   export default value
// }

// src/shims-vue.d.ts
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
