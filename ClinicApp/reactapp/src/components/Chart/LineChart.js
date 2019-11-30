import React from 'react';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';

const LineChart = React.forwardRef((props, ref) => {
    const { style, title, yAxisName, xAxisData, series } = props;

    return (
        <ReactEcharts
            ref={ref}
            style={style}
            option={
                {
                    color: ['gray'],
                    title: {
                        text: title,
                        left: 'left',
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'none',
                        },
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true,
                    },
                    xAxis: {
                        type: 'category',
                        data: xAxisData,
                        axisTick: {
                            alignWithLabel: true,
                        },
                        nameTextStyle: {
                            fontWeight: 'lighter',
                        },
                    },
                    yAxis: {
                        type: 'value',
                        name: yAxisName,
                        nameLocation: 'middle',
                        nameTextStyle: {
                            fontWeight: 'lighter',
                            padding: 30,
                            fontSize: 14,
                        },
                    },
                    series
                }
            }
        />
    );
});

LineChart.propTypes = {
    style: PropTypes.object,
    title: PropTypes.string,
    yAxisName: PropTypes.string,
    xAxisData: PropTypes.array,
    series: PropTypes.array,
};

LineChart.defaultProps = {
    style: null,
    title: '',
    yAxisName: '',
    xAxisData: [],
    series: [],
};

export default LineChart;
