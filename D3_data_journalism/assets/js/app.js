// @TODO: YOUR CODE HERE!
var svgWidth = 750;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create SVG wrapper, append SVG group to hold chart
// Shift SVG group by left and top margins...
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Import data
d3.csv("assets/data/data.csv").then(function(journalismData) {

    // 1. Parse data
    journalismData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
    });

    // 2. Create scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(journalismData, d => d.poverty)])
        .range([0, width]);
    
    var yLinearScale = d3.scaleLinear()
        .domain([20, d3.max(journalismData, d => d.obesity)])
        .range([height, 0]);

    // 3. Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // 4. Append axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    chartGroup.append("g")
        .call(leftAxis);

    // 5. Create circles
    var circlesGroup = chartGroup.selectAll("circle")
    .attr("class","stateCircle")
    .data(journalismData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d=> yLinearScale(d.obesity))
    .attr("r","12")
    .attr("fill","#8ABCD5")
    .style("stroke","white")
    .attr("opacity","1")

    var circleLabels = chartGroup.selectAll(null).data(journalismData).enter().append("text");

    circleLabels
      .attr("x", function(d) {
        return xLinearScale(d.poverty);
      })
      .attr("y", function(d) {
        return yLinearScale(d.obesity);
      })
      .text(function(d) {
        return d.abbr;
      })
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .attr("font-weight","bold")
      .attr("text-anchor", "middle")
      .attr("fill", "white");

    // .append("text").text(function(d){
    //     return d.abbr
    // // .attr("poverty",function(d) {
    // //     return poverty(d.poverty);
    // //     })
    // // .attr("obesity",function(d) {
    // //     return obesity(d.obesity);
    //     });

    // 6. Initialise tooltip
    var toolTip = d3.tip()
        .attr("class","tooltip")
        .offset([80,-60])
        .html(function(d) {
            return(`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}%`);
        });
    
    // 7. Create tooltip in the chart
    chartGroup.call(toolTip);

    // 8. Create event listeners to display and hide the tooltip
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data,this);
    })
        // onmouseout event
        .on("mouseout",function(data, index) {
            toolTip.hide(data);
        });
    
    // 9. Create axes labels
    chartGroup.append("text")
        .attr("transform","rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor","middle")
        .attr("class", "axisText")
        .text("Rate of obesity (%)")
        .style("font-weight","bold");
    
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .style("text-anchor","middle")
        .text("Rate of poverty (%)")
        .style("font-weight","bold");
    
    // }).catch(function(error) {
    //     console.log(error);

});