import React from 'react';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';

const BarChart = React.forwardRef((props, ref) => {
    const { style, text, xAxisData, yAxisName, series } = props;

    return (
        <ReactEcharts
            ref={ref}
            style={style}
            option={
                {
                    color: ['gray'],
                    title: {
                        text,
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
                        nameLocation: 'end',
                        nameTextStyle: {
                            fontWeight: 'lighter',
                        },
                    },
                    dataZoom: [
                        {
                          type: 'inside',
                        },
                    ],
                    series,
                }
            }
        />
    );
});

BarChart.propTypes = {
    style: PropTypes.object,
    text: PropTypes.string,
    xAxisData: PropTypes.array,
    yAxisName: PropTypes.string,
    series: PropTypes.array,
};

BarChart.defaultProps = {
    style: null,
    text: '',
    xAxisData: [],
    yAxisName: '',
    series: [],
};

export default BarChart;
