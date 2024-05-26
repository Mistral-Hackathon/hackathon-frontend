import * as d3 from 'd3';

export function renderWaterfallChart(inputData, containerSelector) {
    // Destructure the input data
    const { data, graph_title, y_axis } = inputData;
  
    // Margin conventions
    const margin = { top: 20, right: 20, bottom: 60, left: 120 }; // Left margin increased for y-axis labels
    const width = 550 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    let cumulative = 0;
    data.forEach(d => {
    d.start = cumulative;
    cumulative += d.value;
    d.end = cumulative;
    d.class = d.value >= 0 ? 'positive' : 'negative';
    });

    // Extend the domain of the xScale to include the minimum and maximum cumulative values
    const xScale = d3.scaleLinear()
    .domain([
    Math.min(0, d3.min(data, d => d.start)),
    Math.max(d3.max(data, d => d.end), 0)
    ])
    .range([0, width]);
  
    // Y scale now band scale for names
    const yScale = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, height])
        .padding(0.1); // Padding for band scale
  
    // Append the svg object to the designated container
    const svg = d3.select(containerSelector)
        .append('svg')
        .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .style('width', '100%')
        .style('height', 'auto')
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
    // Initialize runningValue for waterfall chart calculations
    let runningValue = 0;
  
    // Rectangles (Bars)
    svg.selectAll('rect')
    .data(data)
    .enter().append('rect')
    .attr('y', d => yScale(d.name)) // Y position determined by band scale
    .attr('height', yScale.bandwidth()) // Height of bar is bandwidth of yScale
    .attr('x', d => { // Starting x position of the bar
    if (d.name === 'Starting Value') {
        runningValue = d.value;
        return xScale(0); // Starting value begins at zero
    } else {
        let startValue = runningValue;
        runningValue += d.value; // Update runningValue for the next bar
        return xScale(Math.min(startValue, runningValue));
    }
    })
    .attr('width', d => { // Width of the bar based on value
    if (d.name === 'Starting Value') {
        return xScale(d.value) - xScale(0); // Full width for the starting value
    }
    return Math.abs(xScale(d.value) - xScale(0)); // Width based on the value difference
    })
    .attr('fill', (d, i) => {
    if (i === 0) return 'blue'; // First bar color
    return d.value >= 0 ? 'lightgreen' : 'lightcoral'; // Color based on positive or negative value
    });
  
    // Axes
    // X axis on bottom, for values
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));
  
    // Y axis on left, for names
    svg.append('g')
      .call(d3.axisLeft(yScale));

  // Tooltip
  const tooltip = d3.select(containerSelector)
    .append('div')
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('visibility', 'hidden')
    .style('padding', '10px')
    .style('background', 'white')
    .style('border', '1px solid #ccc')
    .style('border-radius', '5px');

  // Tooltip event handlers
  svg.selectAll('rect')
    .on('mouseover', function(event, d) {
      tooltip.html(`Name: ${d.name}<br>Value: ${d.value.toFixed(4)}`)
        .style('visibility', 'visible');
      d3.select(this).style('opacity', 0.7);
    })
    .on('mousemove', (event) => {
      tooltip.style('top', (event.pageY - 10) + 'px')
             .style('left', (event.pageX + 10) + 'px');
    })
    .on('mouseout', function() {
      tooltip.style('visibility', 'hidden');
      d3.select(this).style('opacity', 1);
    });

  // Chart title
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', -5)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .text(graph_title);

   // X-axis label (now representing values)
   svg.append('text')
    .attr('transform', `translate(${width / 2}, ${height + margin.top + 40})`)
    .style('text-anchor', 'middle')
    .text(y_axis);
}