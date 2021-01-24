import { Component, ElementRef, Input, OnChanges, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { BarChartOptions, DashboardSalesComparisionItem } from 'src/app/ex.model';
import * as d3 from 'd3';
import { MONTH_NAME } from 'src/app/ex.const';

@Component( {
    selector: 'app-bar-chart',
    templateUrl: './bar-chart.component.html'
} )
export class BarChartComponent implements OnChanges {
    @ViewChild( 'chartContainer', { static: true } ) chartContainerRef: ElementRef;
    @Input() data: DashboardSalesComparisionItem[];
    @Input() options: BarChartOptions;

    constructor( private _renderer: Renderer2 ) {
    }
    
    ngOnChanges( changes: SimpleChanges ): void {
        const el = this.chartContainerRef.nativeElement;

        if( el.children ) {
            for(let child of el.children) {
                this._renderer.removeChild( el, child );
            }
        };

        this._renderer.appendChild( el, this.drawChart( this.data, this.options ) );
    }

    private drawChart( data: DashboardSalesComparisionItem[], options: BarChartOptions ): HTMLElement {
        // hard code to get array of ordinals
        // refactor data model to clear this
        const ordinalData = [];

        for( const key in data[ 0 ] ) {
            if ( key !== 'month' )
                ordinalData.push( key );
        }

        const month = ( d: DashboardSalesComparisionItem ) => {
            return MONTH_NAME.find( m => m.value === d.month ).name;
        };

        const _data = ( d: DashboardSalesComparisionItem ) => {
            let result = [];
            for( const key in d ) {
                if( key !== 'month' ) {
                    result.push( {
                        name: key,
                        value: d[ key ]
                    } )
                }
            }
            return result;
        }

        const { width, height, backgroundColor, colors } = options;
        const { top, right, bottom, left } = options.margin;

        const innerWidth = width - left - right;
        const innerHeight = height - top - bottom;

        const div = document.createElement( 'div' );
        const chartContainer = d3.select(div);

        const svg = chartContainer.append( 'svg' )
            .attr( 'viewBox', `0 0 ${width} ${height}` )
            .style( 'background-color', backgroundColor )
            .style( 'padding', 0 )
            .style( 'margin', 0 )
            .style( 'border-radius', '8px' );

        const chart = svg.append( 'g' )
            .attr( 'transform', `translate( ${ left }, ${ top } )` );

        const columnColors = d3.scaleOrdinal()
            .domain( ordinalData )
            .range( colors );

        const xScale = d3.scaleBand()
            .domain( data.map( d => month( d ) ) )
            .range( [ 0, innerWidth ] )
            .padding( 0.1 );

        const xAxis = d3.axisBottom( xScale );

        const xG = chart.append( 'g' )
            .attr( 'class', 'x-group' )
            .attr( 'transform', `translate(0, ${innerHeight})`)
            .call( xAxis );

        const xSubScale = d3.scaleBand()   
            .domain( ordinalData.map( d => d ) )
            .range( [ 0, xScale.bandwidth() ] );

        const yScale = d3.scaleLinear()
            .domain( [ 0, d3.max( data, d => {
                const values = [ d.lastThreeYear, d.lastTwoYear, d.previousYear, d.currentYear ];
                return d3.max( values );
            } ) ] )
            .range( [ innerHeight, 0 ] )
            .nice();

        const yAxis = d3.axisLeft( yScale )
            .tickFormat( d3.formatPrefix( '.0', 1e3 ) );

        const yG = chart.append( 'g' )
            .attr( 'class', 'y-group' )
            .call( yAxis );

        const columns = chart.selectAll( '.columns' )
            .data(data)
            .enter()
            .append( 'g' )
            .attr( 'class', 'columns' )
            .attr( 'transform', d => `translate( ${ xScale( month ( d ) ) }, 0 )` )

        const column = columns.selectAll( '.column' )
            .data( d => _data( d ) )
            .enter()
            .append( 'rect' )
            .attr( 'class', 'column' )
            .attr( 'x', d => xSubScale( d.name ) )
            .attr( 'width', xSubScale.bandwidth() )
            .attr( 'height', d => innerHeight - yScale( d.value ) )
            .attr( 'transform', d => `translate( 0, ${ yScale( d.value ) } )`)
            .attr( 'fill', d => columnColors( d.name ).toString() )

        return div;
    }
}
