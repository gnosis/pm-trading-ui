import React, { Component } from 'react'
import autobind from 'autobind-decorator'

import './marketGraph.less'

import {
  select,
  extent,
  mouse,
  bisector,
  line,
  area,
  stack,
  scaleTime,
  scaleLinear,
  scaleOrdinal,
  schemeCategory10,
  axisBottom,
  axisRight,
} from 'd3'

export default class MarketGraph extends Component {
  componentDidMount() {
    this.createChart()
  }

  componentDidUpdate() {
    this.createChart()
  }

  @autobind
  createChart() {
    const { data } = this.props
    const svg = select(this.svg)

    // TODO: resizable

    const containerWidth = parseInt(svg.style('width'), 10)
    const containerHeight = parseInt(svg.style('height'), 10)

    // console.log(containerWidth, containerHeight)

    const margin = { top: 20, right: 50, bottom: 20, left: 20 }
    const width = containerWidth - margin.left - margin.right
    const height = containerHeight - margin.top - margin.bottom

    svg
      .attr('preserveAspectRatio', 'xMinYMin meet')
    //  .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
    const chartTooltip = select(this.tooltip)

    const bisectDate = bisector(d => d.date).left
    const labels = Object.keys(data[0]).slice(1)

    const x = scaleTime().range([0, width])
    const y = scaleLinear().range([height, 0])
    const z = scaleOrdinal(schemeCategory10)

    x.domain(extent(data, d => d.date))
    y.domain([0, 1])
    z.domain(labels)

    const chartStack = stack()
    chartStack.keys(labels)
    const chartArea = area()
      .x(d => x(d.data.date))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]))
    const chartLine = line()
      .x(d => x(d.data.date))
      .y(d => y(d[1]))

    const g = svg
      .selectAll('g')
      .data([0])
      .enter().append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    svg
      .selectAll('linearGradient')
      .data(chartStack(data)).enter()
      .append('linearGradient')
          .attr('id', d => d.key)
          .attr('gradientUnits', 'userSpaceOnUse')
          .attr('x1', 0)
          .attr('y1', 0)
          .attr('x2', 0)
          .attr('y2', y(0))
        .selectAll('stop')
          .data(d => [
            { offset: '0%', color: z(d.key), stopOpacity: '0.8' },
            { offset: '50%', color: z(d.key), stopOpacity: '0.5' },
            { offset: '100%', color: 'black', stopOpacity: '0.3' },
          ])
        .enter()
        .append('stop')
          .attr('offset', d => d.offset)
          .attr('stop-color', d => d.color)
          .attr('stop-opacity', d => d.stopOpacity)

    // x axis
    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${height})`)
      .call(
        axisBottom(x)
          .ticks(5)
          .tickSizeInner(-height),
      )

    // y axis
    g.append('g')
      .attr('class', 'axis axis--y')
      .attr('transform', `translate(${width}, 0)`)
      .call(axisRight(y).ticks(width / 100, '%'))

    // layer for each key
    const layer = g
      .selectAll('.layer')
      .data(chartStack(data))
      .enter().append('g')
        .attr('class', 'layer')

    // area chart
    const areaLayer = layer
      .append('path')
      .attr('class', 'area')
      .style('fill', d => `url(#${d.key})`)
      .style('stroke', 'none')
      .attr('d', chartArea)

    const areaCurveLayer = layer
      .append('path')
      .attr('class', 'curve')
      .style('stroke', d => z(d.key))
      .style('fill', 'none')
      .attr('d', chartLine)


    // tooltip stuff
    areaLayer
      .on('mouseover', () => {
        layer.select('.marketGraph__tooltipLine').style('opacity', 1)
        chartTooltip.style('display', 'block')
      })
      .on('mouseout', () => {
        layer.select('.marketGraph__tooltipLine').style('opacity', 0)
        chartTooltip.style('display', 'none')
      })
      .on('mousemove', (curData) => {
        const mousePos = mouse(layer.node())
        const mousePosText = mouse(svg.node())
        const mouseDate = x.invert(mousePos[0])
        const dataIndex = bisectDate(data, mouseDate)
        const d = curData[dataIndex]
        layer.select('.marketGraph__tooltipLine')
          .attr('transform', `translate(${x(d.data.date)}, 0)`)

        chartTooltip
          .style('top', `${mousePosText[1]}px`)
          .style('left', `${mousePosText[0]}px`)
          .html(() => Object.keys(d.data).slice(1).map(key => `${key}: ${(d.data[key] * 100).toFixed(2)}%`).join('<br />'))
      })

    // set tooltip line
    layer
      .append('path')
      .attr('class', 'marketGraph__tooltipLine')
      .attr('d', `M 0, 0 V ${height}`)
  }

  render() {
    return (
      <div className="marketGraph">
        <div className="marketGraph__tooltip" ref={(node) => { this.tooltip = node }} />
        <svg className="marketGraph__svg" ref={(node) => { this.svg = node }} width="500" height="500" />
      </div>
    )
  }
}
