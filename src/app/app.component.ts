import { Component } from '@angular/core';
import { SALE_COMPARISION, BAR_CHART_OPTIONS_DEFAULT } from './ex.const';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  barChartData = SALE_COMPARISION;
  options = BAR_CHART_OPTIONS_DEFAULT;

  handleChangeData(): void {
    this.barChartData = [
      ...this.barChartData,
      {month: 12, previousYear: 50000 * Math.random(), currentYear: 100000 * Math.random(), lastTwoYear: 200000 * Math.random(), lastThreeYear: 100000 * Math.random()},
    ]
  }
}
