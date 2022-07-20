<template>

  <Bar :chart-data="chartData" :chart-options="chartOption"/>

</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
name: 'BarChart',
components: { Bar },
props: ['chartData'],
setup(props){

    // let label = []
    let data = []
    for (let i = 0; i < props.chartData['telegram'].length; i++) {
      data.push({'x': props.chartData['telegram'][i][0], 'y': parseInt(props.chartData['telegram'][i][1])})
      // label.push(props.chartData[i][0])
    }
    let data2 = []
    for (let i = 0; i < props.chartData['site'].length; i++) {
      data2.push({'x': props.chartData['site'][i][0], 'y': parseInt(props.chartData['site'][i][1])})
      // label.push(props.chartData[i][0])
    }

      return{
        chartData: {
        // labels: label,
        datasets: [
          {
            label: 'بازدید تلگرام',
            backgroundColor: 'rgb(0, 136, 204)',
            data: data,
            // borderWidth: 10,
            barPercentage: .6,
             maxBarThickness: 85,
            },
          {
            label: 'بازدید سایت',
            backgroundColor: 'rgb(69,185,66)',
            data: data2,
            // borderWidth: 10,
            barPercentage: .6,
             maxBarThickness: 85,
            }
          ],
        },
        chartOption: {
          scales: {
            y: {
              stacked: true,
              // suggestedMax: Math.max.apply(Math, data) + Math.max.apply(Math, data)/10,
              ticks: {
                precision: 0
              }
            },
            x: {
              stacked: true
            }
          }
        }
      }
  }
}
</script>

<style>

</style>