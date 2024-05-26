// RenderForecastChart.jsx
import * as d3 from 'd3';

export function renderForecastChart(data, containerSelector) {
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(containerSelector)
        .append('svg')
        .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Convert string dates to date objects
    data.data_x_axis = data.data_x_axis.map(d => new Date(d));

    // X axis
    const x = d3.scaleTime()
        .domain(d3.extent(data.data_x_axis))
        .range([0, width]);
    svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x));
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .attr('text-anchor', 'middle')
        .text(data.x_axis);

    // Y axis
    const y = d3.scaleLinear()
        .domain([d3.min(data.data_y_axis_lower), d3.max(data.data_y_axis_upper)])
        .range([height, 0]);
    svg.append('g').call(d3.axisLeft(y));
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -40)
        .attr('text-anchor', 'middle')
        .text(data.y_axis);

    // Title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -5)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .text(data.graph_title);

    // Confidence Interval Area
    svg.append('path')
        .datum(data.data_x_axis.map((d, i) => ({ x: d, y0: data.data_y_axis_lower[i], y1: data.data_y_axis_upper[i] })))
        .attr('fill', '#FFE8C8')
        .attr('stroke', 'none')
        .attr('d', d3.area()
            .x(d => x(d.x))
            .y0(d => y(d.y0))
            .y1(d => y(d.y1))
        );

    // Line
    const line = d3.line()
        .x((d, i) => x(data.data_x_axis[i]))
        .y(d => y(d));
    svg.append('path')
        .datum(data.data_y_axis)
        .attr('fill', 'none')
        .attr('stroke', '#3b3010')
        .attr('stroke-width', 1.5)
        .attr('d', line);

    // Tooltip
    const bisect = d3.bisector(d => d).left; 

    const focus = svg
        .append('g')
        .append('circle')
        .style("fill", "none")
        .attr("stroke", "black")
        .attr('r', 8.5)
        .style("opacity", 0);

    svg.append('rect')
        .style('fill', 'none')
        .style('pointer-events', 'all')
        .attr('width', width)
        .attr('height', height)
        .on('mouseover', function() {
            focus.style("opacity", 1);
            d3.select("#tooltip").style("visibility", "visible");
        })
        .on('mousemove', function(event) {
            const [mx] = d3.pointer(event);
            const xValue = x.invert(mx);
            const i = bisect(data.data_x_axis, xValue, 1);
            const selectedData = {
                x: data.data_x_axis[i],
                y: data.data_y_axis[i],
                y0: data.data_y_axis_lower[i],
                y1: data.data_y_axis_upper[i]
            };
        
            focus
                .attr("cx", x(selectedData.x))
                .attr("cy", y(selectedData.y));

            d3.select("#tooltip")
                .style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px")
                .html(`Time: ${d3.timeFormat("%Y-%m-%d %H:%M")(selectedData.x)}<br/>
                       Lower bound: ${selectedData.y0.toFixed(4)}<br/>
                       Pred: ${selectedData.y.toFixed(4)}<br/>
                       Upper bound: ${selectedData.y1.toFixed(4)}`);
        })
        .on('mouseout', function() {
            focus.style("opacity", 0);
            d3.select("#tooltip").style("visibility", "hidden");
        });
}