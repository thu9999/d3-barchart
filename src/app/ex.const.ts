import { BarChartOptions, DashboardSalesComparisionItem } from "./ex.model"
import * as d3 from 'd3';
export const MONTH_NAME = [
    {
        name: 'Jan',
        value: 1
    },
    {
        name: 'Feb',
        value: 2
    },
    {
        name: 'Mar',
        value: 3
    },
    {
        name: 'Apr',
        value: 4
    },
    {
        name: 'May',
        value: 5
    },
    {
        name: 'Jun',
        value: 6
    },
    {
        name: 'Jul',
        value: 7
    },
    {
        name: 'Aug',
        value: 8
    },
    {
        name: 'Sep',
        value: 9
    },
    {
        name: 'Oct',
        value: 10
    },
    {
        name: 'Now',
        value: 11
    },
    {
        name: 'Dec',
        value: 12
    }
]

export const SALE_COMPARISION: DashboardSalesComparisionItem[] = [
    {month: 1, previousYear: 5000, currentYear: 10000, lastTwoYear: 20000, lastThreeYear: 30000},
    {month: 2, previousYear: 5000, currentYear: 10000, lastTwoYear: 20000, lastThreeYear: 30000},
    {month: 3, previousYear: 5000, currentYear: 10000, lastTwoYear: 20000, lastThreeYear: 30000},
    {month: 4, previousYear: 5000, currentYear: 10000, lastTwoYear: 20000, lastThreeYear: 30000},
    {month: 5, previousYear: 5000, currentYear: 10000, lastTwoYear: 20000, lastThreeYear: 30000},
    {month: 6, previousYear: 5000, currentYear: 10000, lastTwoYear: 20000, lastThreeYear: 30000},
    {month: 7, previousYear: 5000, lastTwoYear: 20000, lastThreeYear: 30000},
    {month: 8, previousYear: 5000, currentYear: 10000, lastTwoYear: 20000, lastThreeYear: 30000},
    {month: 9, previousYear: 5000, currentYear: 10000, lastTwoYear: 20000, lastThreeYear: 30000},
    {month: 10, previousYear: 5000, currentYear: 10000, lastTwoYear: 20000, lastThreeYear: 30000},
    {month: 11, previousYear: 5000, currentYear: 10000, lastTwoYear: 20000, lastThreeYear: 30000},
    {month: 12, previousYear: 5000, currentYear: 10000, lastTwoYear: 20000, lastThreeYear: 30000},
]

export const BAR_CHART_OPTIONS_DEFAULT: BarChartOptions = {
    width: 450,
    height: 250,
    margin: {
        top: 40,
        right: 40,
        bottom: 40,
        left: 40
    },
    backgroundColor: '#eeeeee',
    colors: d3.schemeSet3
}