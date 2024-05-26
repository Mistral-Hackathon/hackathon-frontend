import * as d3 from 'd3';

// Utility function to render a bar chart
export function renderBarChart(data, containerSelector) {
const margin = { top: 20, right: 20, bottom: 60, left: 60 };
const width = 400 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;

const xScale = d3.scaleBand()
    .domain(data.data_label)
    .range([0, width])
    .padding(0.2);

const yScale = d3.scaleLinear()
    .domain([0, d3.max(data.data)])
    .range([height, 0]);

const svg = d3.select(containerSelector)
    .append('svg')
    .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .style('width', '100%')
    .style('height', 'auto')
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// Bars
svg.selectAll('rect')
    .data(data.data)
    .enter()
    .append('rect')
    .attr('x', (d, i) => xScale(data.data_label[i]))
    .attr('y', d => yScale(d))
    .attr('width', xScale.bandwidth())
    .attr('height', d => height - yScale(d))
    .attr('fill', '#69b3a2')
    .on('mouseover', function(event, d) {
    d3.select(this).style('opacity', 0.5); // Set opacity to 50% on hover
    d3.select("#tooltip")
        .style("visibility", "visible")
        .html(`${data.x_axis}: ${data.data_label[data.data.indexOf(d)]}<br/>${data.y_axis}: ${d}`);
    })
    .on('mousemove', (event, d) => {
    d3.select("#tooltip")
        .style('top', (event.pageY - 10) + 'px')
        .style('left', (event.pageX + 10) + 'px');
    })
    .on('mouseout', function() {
    d3.select(this).style('opacity', 1); // Restore original opacity on mouseout
    d3.select("#tooltip").style("visibility", "hidden");
    });

// X-axis
svg.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale))
    .selectAll('text')
    .attr('transform', 'translate(-10,0)rotate(-45)')
    .style('text-anchor', 'end');

svg.append('text')
    .attr('x', width / 2)
    .attr('y', height + 40)
    .attr('text-anchor', 'middle')
    .text(data.x_axis);

// Y-axis
svg.append('g').call(d3.axisLeft(yScale));
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
}