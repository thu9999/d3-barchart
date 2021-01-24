import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SALE_COMPARISION, MONTH_NAME } from './ex.const';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Format from 'd3-format';

import { Subscription } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import { DashboardSalesComparisionItem, DashboardSalesComparisionBestSummary } from './ex.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private _subscription: Subscription;
  mployees: any[] = [];

  employeeSelected: number = -1;
  data: DashboardSalesComparisionItem[] = [];
  bestSummary: DashboardSalesComparisionBestSummary;

  color: any;
  title = 'D3 Barchart with Angular 11';
  width: number;
  height: number;
  margin = { top: 20, right: 20, bottom: 30, left: 40 };
  svg: any;
  graph: any;
  tip: any;

  keys = ['lastThreeYear', 'lastTwoYear', 'previousYear', 'currentYear'];
  legend: any;
  currentYear = (new Date()).getFullYear();
  years: number[];
  div: any;
  x0: any;
  x1: any;
  y: any;
  yAxis: any;
  xAxis: any;

  constructor(private currencyPipe: CurrencyPipe) {
    this.width = 900 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
  }

  ngOnInit() {
    this.years = [this.currentYear - 3, this.currentYear - 2, this.currentYear - 1, this.currentYear];
    this.getData();
  }

  getData(employeeId: number = -1, change: boolean = false) {
    this.bestSummary = {total: 50000, monthYear: new Date()};

    this.data = JSON.parse(JSON.stringify(SALE_COMPARISION)).map((item: DashboardSalesComparisionItem) => {
      const exist = MONTH_NAME.find(month => month.value === item.month)
      if (exist) {
        item.month = exist.name
      }
      return item
    });

    this.color = d3Scale.scaleOrdinal()
      .range(["#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    if (change) {
      this.updateChart();
      return
    }
    this.initChart();
  }

  ngOnDestroy(): void {
    if (this._subscription) this._subscription.unsubscribe();
    if (this.svg) this.svg.remove();
  }

  initChart() {
    this.svg = d3.select('#barChart')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .style('padding-left', '20px')
      .attr('viewBox', '0 0 900 500');

    this.div = d3.select("#barChart").append("div")
      .attr("class", "tw-tooltip-d3")
      .style("opacity", 0);

    this.x0 = d3Scale.scaleBand()
      .domain(this.data.map(d => d['month']))
      .rangeRound([this.margin.left, this.width - this.margin.right])
      .paddingInner(0.1);

    this.x1 = d3Scale.scaleBand()
      .domain(this.keys)
      .rangeRound([0, this.x0.bandwidth()])
      .padding(0.05)

    this.y = d3Scale.scaleLinear()
      .domain([0, d3Array.max(this.data, d => d3Array.max(this.keys, key => (d[key])))]).nice()
      .rangeRound([this.height - this.margin.bottom, this.margin.top])

    this.xAxis = g => g
      .attr("class", "axis")
      .style("font-size", 12)
      .attr("transform", `translate(30, ${this.height - this.margin.bottom})`)
      .call(d3Axis.axisBottom(this.x0).tickSizeOuter(0))

    this.yAxis = g => g
      .attr("class", "axis")
      .style("font-size", 12)
      .attr("transform", `translate(${this.margin.left + 30},0)`)
      .call(d3Axis.axisLeft(this.y).tickFormat((d) => { return "$" + d3Format.format(",")(d) }))
      .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 5)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text('Max Sales'))

    this.graph = this.svg.append('g')
      .selectAll("g")
      .data(this.data)
      .join("g")
      .attr("transform", d => `translate(${this.x0(d['month']) + 30}, 0)`)
      .selectAll("rect")
      .data(d => this.keys.map(key => ({ key, value: d[key] })))
      .join("rect")
      .attr("x", d => this.x1(d.key))
      .attr("y", d => this.y(d.value || 0))
      .attr("width", this.x1.bandwidth())
      .attr("height", d => this.y(0) - this.y(d.value || 0))
      .attr("fill", d => this.color(d.key))
      .on("mouseover", (event, d) => {
        console.log(d);
        this.div.html(this.currencyPipe.transform(d.value))
          .style("left", (event.offsetX + 5) + "px")
          .style("opacity", .9)
          .style("top", (event.offsetY - 28) + "px");
      })
      .on("mouseout", (d) => {
        this.div.style("opacity", 0);
      });;

    let legend = svg => {
      svg.selectAll('rect')
        .data(this.years)
        .enter()
        .append("rect")
        .attr("x", (d, i) => {
          const xPost = this.legendXPosition(this.years, i, 10);
          return xPost;
        })
        .attr("y", -12)
        .attr("width", 30)
        .attr("height", 15)
        .style("fill", (d, i) => {
          const colorlegends = ["#6b486b", "#a05d56", "#d0743c", "#ff8c00"];
          return colorlegends[i];
        });

      svg.selectAll('text')
        .data(this.years)
        .enter()
        .append("text")
        .attr("x", (d, i) => this.legendXPositionText(this.years, i, 36, 10))
        .attr("y", -1)
        .text((d) => d);
    }

    const summary = svg => {
      svg.append("text")
        .attr("x", 2)
        .attr("y", this.y(this.y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Best Month:");

      svg.append("text")
        .attr("x", 90)
        .attr("y", this.y(this.y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text(this.currencyPipe.transform(this.bestSummary.total));
    }

    // add the background
    // this.svg.append("rect")
    // .attr("x", this.x0.bandwidth() / 2)
    // .attr("y", 0)
    // .attr("width", this.x0(this.x0.domain()[this.x0.domain().length - 1]) + this.x0.bandwidth() / 2)
    // .attr("height", this.height)
    // .attr("fill", "red")
    // .attr("opacity", 0.2)

    // add the X gridlines
    this.svg.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(30," + (this.height - this.margin.bottom) + ")")
      .call(this.make_x_gridlines()
        .tickSize(-this.height)
        .tickFormat("")
      )
      .call(g => g.selectAll("line").style("stroke", "#F3F4F6"));

    // add the Y gridlines
    this.svg.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(70, 0)")
      .call(this.make_y_gridlines()
        .tickSize(-(this.width))
        .tickFormat("")
      )
      .call(g => g.selectAll("line").style("stroke", "#F3F4F6"));

    this.svg.append("g")
      .call(this.xAxis);

    this.svg.append("g")
      .call(this.yAxis);

    this.svg.append("g")
      .attr("class", "legend")
      .attr("height", 100)
      .attr("width", 100)
      .attr('transform', 'translate(' + (this.margin.left + 10) + ',' + (this.height + 25) + ')')
      .call(legend);

    this.svg.append("g")
      .attr("class", "summary")
      .attr("height", 100)
      .attr("width", 100)
      .attr('transform', 'translate(' + (this.width - 220) + ',' + (this.height - 10) + ')')
      .call(summary);
  }

  updateChart() {
    this.y.domain([0, d3Array.max(this.data, d => d3Array.max(this.keys, key => (d[key])))]).nice()
      .rangeRound([this.height - this.margin.bottom, this.margin.top]);

    // const rects = d3.select("#barChart svg").selectAll("rect").data(this.data);
    // rects.enter().append("rect");
    // rects.exit().remove();
  }

  make_x_gridlines() {
    return d3Axis.axisBottom(this.x0)
      .ticks(10)
  }

  // gridlines in y axis function
  make_y_gridlines() {
    return d3Axis.axisLeft(this.y)
      .ticks(10)
  }

  legendXPositionText(data, position, textOffset, avgFontWidth) {
    return this.legendXPosition(data, position, avgFontWidth) + textOffset;
  }

  legendXPosition(data, position, avgFontWidth) {
    if (position == 0) {
      return 0;
    } else {
      let xPostiion = 0;
      for (let i = 0; i < position; i++) {
        xPostiion += (data.length * avgFontWidth + 40);
      }
      return xPostiion;
    }
  }

  cleanChart() {
    d3.select('#barChart').exit().remove();
  }

  onEmployeeChange(employeeId: any) {
    this.getData(parseInt(employeeId), true);
  }
}
