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