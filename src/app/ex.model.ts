export interface DashboardSalesComparisionItem {
    month: number | string;
    currentYear?: number;
    previousYear?: number;
    lastTwoYear?: number;
    lastThreeYear?: number
}

export interface DashboardSalesComparisionBestSummary {
    monthYear: Date;
    total: number
}

export interface DashboardSalesComparision {
    items: DashboardSalesComparisionItem[];
    bestMonth: DashboardSalesComparisionBestSummary
}

export class BarChartOptions {
    width: number;
    height: number;
    margin: Margin;
    backgroundColor: string;
    colors: any;
}

export class Margin {
    top: number;
    right: number;
    bottom: number;
    left: number;
}