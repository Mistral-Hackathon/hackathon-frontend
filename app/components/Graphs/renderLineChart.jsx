import * as d3 from 'd3';

// Utility function to render a bar chart
export function renderLineChart(data, containerSelector) {
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(containerSelector)
      .append('svg')
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // X axis
    const x = d3.scaleLinear()
      .domain([d3.min(data.data_x_axis), d3.max(data.data_x_axis)])
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
      .domain([d3.min(data.data_y_axis), d3.max(data.data_y_axis)])
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

    // Line
    const line = d3.line()
      .x(d => x(d[0]))
      .y(d => y(d[1]));
    svg.append('path')
      .datum(data.data_x_axis.map((d, i) => [d, data.data_y_axis[i]]))
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    const bisect = d3.bisector(d => d[0]).left; 
    
    // Create the circle that travels along the curve of the chart
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
        const i = bisect(data.data_x_axis.map((d, i) => [d, data.data_y_axis[i]]), xValue, 1);
        const selectedData = data.data_x_axis.map((d, i) => [d, data.data_y_axis[i]])[i];
    
        // Update the cursor's circle and text positions
        focus
          .attr("cx", x(selectedData[0]))
          .attr("cy", y(selectedData[1]));

        d3.select("#tooltip")
          .style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px")
          .html(`${data.x_axis}: ${selectedData[0]}<br/>${data.y_axis}: ${selectedData[1]}`);
      })
      .on('mouseout', function() {
        focus.style("opacity", 0);
        d3.select("#tooltip").style("visibility", "hidden");
      });
  }