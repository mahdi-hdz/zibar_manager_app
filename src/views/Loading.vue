<template>
<svg style="margin:auto;display:block;" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
<g><circle cx="73.801" cy="68.263" :fill="color" r="3">
  <animateTransform attributeName="transform" type="rotate" calcMode="spline" values="0 50 50;360 50 50" times="0;1" keySplines="0.5 0 0.5 1" repeatCount="indefinite" dur="1.8867924528301885s" begin="0s"></animateTransform>
</circle><circle cx="68.263" cy="73.801" :fill="color" r="3">
  <animateTransform attributeName="transform" type="rotate" calcMode="spline" values="0 50 50;360 50 50" times="0;1" keySplines="0.5 0 0.5 1" repeatCount="indefinite" dur="1.8867924528301885s" begin="-0.062s"></animateTransform>
</circle><circle cx="61.481" cy="77.716" :fill="color" r="3">
  <animateTransform attributeName="transform" type="rotate" calcMode="spline" values="0 50 50;360 50 50" times="0;1" keySplines="0.5 0 0.5 1" repeatCount="indefinite" dur="1.8867924528301885s" begin="-0.125s"></animateTransform>
</circle><circle cx="53.916" cy="79.743" :fill="color" r="3">
  <animateTransform attributeName="transform" type="rotate" calcMode="spline" values="0 50 50;360 50 50" times="0;1" keySplines="0.5 0 0.5 1" repeatCount="indefinite" dur="1.8867924528301885s" begin="-0.187s"></animateTransform>
</circle><circle cx="46.084" cy="79.743" :fill="color" r="3">
  <animateTransform attributeName="transform" type="rotate" calcMode="spline" values="0 50 50;360 50 50" times="0;1" keySplines="0.5 0 0.5 1" repeatCount="indefinite" dur="1.8867924528301885s" begin="-0.25s"></animateTransform>
</circle><circle cx="38.519" cy="77.716" :fill="color" r="3">
  <animateTransform attributeName="transform" type="rotate" calcMode="spline" values="0 50 50;360 50 50" times="0;1" keySplines="0.5 0 0.5 1" repeatCount="indefinite" dur="1.8867924528301885s" begin="-0.312s"></animateTransform>
</circle><circle cx="31.737" cy="73.801" :fill="color" r="3">
  <animateTransform attributeName="transform" type="rotate" calcMode="spline" values="0 50 50;360 50 50" times="0;1" keySplines="0.5 0 0.5 1" repeatCount="indefinite" dur="1.8867924528301885s" begin="-0.375s"></animateTransform>
</circle><circle cx="26.199" cy="68.263" r="3" :fill="color">
  <animateTransform attributeName="transform" type="rotate" calcMode="spline" values="0 50 50;360 50 50" times="0;1" keySplines="0.5 0 0.5 1" repeatCount="indefinite" dur="1.8867924528301885s" begin="-0.437s"></animateTransform>
</circle><animateTransform attributeName="transform" type="rotate" calcMode="spline" values="0 50 50;0 50 50" times="0;1" keySplines="0.5 0 0.5 1" repeatCount="indefinite" dur="1.8867924528301885s"></animateTransform></g>
</svg>
</template>

<script>
  export default{
    props: ['color'],
    setup(props) {
      let color = props.color
      return {color}
    }
  }
</script>