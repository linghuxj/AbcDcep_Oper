export const funnel = data => {
  const p = {
    // tooltip: {
    //   trigger: 'item',
    //   formatter: '{b} : {c}%'
    // },
    series: [
      {
        type: 'funnel',
        left: '0%',
        bottom: 20,
        top: 10,
        width: '100%',
        min: 0,
        max: 100,
        minSize: '0%',
        maxSize: '80%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside',
          formatter: '{b}：{c}'
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          label: {
            fontSize: 20
          }
        },
        data: data
      }
    ]
  }
  return p
}

export const genderAge = genderData => {
  const option = {
    title: {
      text: '性别年龄分布',
      textStyle: {
        color: '#00F2F1',
        fontSize: 12
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['30%', '50%'],
        center: ['50%', '50%'],
        minAngle: 12,
        avoidLabelOverlap: false,
        labelLine: {
          length: 20
        },
        label: {
          formatter: '{b|{b}：}{c}{hr|}{per|{d}%}\n\n',
          borderWidth: 20,
          borderRadius: 4,
          rich: {
            a: {
              color: '#333',
              fontSize: 12,
              align: 'left'
            },
            b: {
              fontSize: 12,
              align: 'left'
            },
            c: {
              fontSize: 12,
              align: 'left'
            },
            per: {
              color: '#fff',
              backgroundColor: '#4C5058',
              padding: [3, 4],
              borderRadius: 4
            }
          }
        },
        emphasis: {
          position: 'left',
          show: true,
          textStyle: {
            fontSize: '14',
            fontWeight: 'bold'
          },
          length: 1
        },
        data: genderData
      }
    ]
  }
  return option
}

export const vistor = data => {
  const option = {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    title: {
      text: '每小时访问用户数',
      textStyle: {
        color: '#00F2F1',
        fontSize: 12
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        lineStyle: {
          color: '#57617B'
        }
      }
    },
    legend: {
      top: 20,
      icon: 'rect',
      itemWidth: 14,
      itemHeight: 5,
      itemGap: 13,
      right: '4%',
      textStyle: {
        fontSize: 12,
        color: '#F1F1F3'
      }
    },
    grid: {
      top: '2%',
      left: '2%',
      right: '2%',
      bottom: '2%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#57617B'
          }
        },
        data: [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
          23
        ]
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '(%)',
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#57617B'
          }
        },
        axisLabel: {
          margin: 10,
          fontSize: 14
        },
        splitLine: {
          lineStyle: {
            color: '#57617B'
          }
        }
      }
    ],
    series: [
      {
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        areaStyle: {
          color: 'rgba(0, 136, 212, 0.3)',
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowBlur: 10
        },
        itemStyle: {
          color: 'rgb(0,136,212)',
          borderColor: 'rgba(0,136,212,0.2)',
          borderWidth: 12
        },
        data: data
      }
    ]
  }
  return option
}

export const areaMap = data => {
  const option = {
    tooltip: {
      trigger: 'item',
      textStyle: {
        fontSize: 12,
        lineHeight: 22,
        color: '#9FF2FF'
      },
      backgroundColor: 'rgba(12, 0, 255, 0.4)',
      position: point => {
        // 固定在顶部
        return [point[0] + 50, point[1] - 20]
      },
      formatter: p => {
        let val = p.value
        if (window.isNaN(val)) {
          val = 0
        }
        const txtCon =
          '</div>' +
          '<div>用户总数：' +
          p.data.userNum +
          '<br />创客总数：' +
          p.data.distributorNum +
          '<br />商户总数：' +
          p.data.storeNum +
          '</div>'
        return txtCon
      }
    },
    visualMap: {
      min: 0,
      max: 10,
      show: false,
      seriesIndex: 0,
      // 颜色
      inRange: {
        color: ['rgba(41,166,206, .5)', 'rgba(69,117,245, .9)']
      }
    },
    series: [
      {
        name: '长沙市',
        type: 'map',
        mapType: 'CS',
        // 地图长度比
        aspectScale: 0.85,
        zoom: 1.2,
        itemStyle: {
          normal: {
            show: true,
            color: 'red',
            areaColor: 'rgba(19,54,162, .5)',
            borderColor: 'rgba(0,242,252,.3)',
            borderWidth: 1,
            shadowBlur: 7,
            shadowColor: '#00f2fc'
          },
          emphasis: {
            areaColor: '#4f7fff',
            borderColor: 'rgba(0,242,252,.6)',
            borderWidth: 2,
            shadowBlur: 10,
            shadowColor: '#00f2fc'
          }
        },
        layoutCenter: ['50%', '50%'],
        label: {
          show: false,
          position: 'insideRight',
          textStyle: {
            fontSize: 12,
            color: '#efefef'
          },
          emphasis: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        data: data
      }
    ]
  }
  return option
}
