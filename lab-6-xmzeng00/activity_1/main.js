var svg = d3.select('svg');

// Get layout parameters
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = {t: 40, r: 40, b: 40, l: 40};
var cellPadding = 10;

// Create a group element for appending chart elements
var chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

var dataAttributes = ['economy (mpg)', 'cylinders', 'power (hp)', '0-60 mph (s)'];
var N = dataAttributes.length;

// Compute chart dimensions
var cellWidth = (svgWidth - padding.l - padding.r) / N;
var cellHeight = (svgHeight - padding.t - padding.b) / N;

// Global x and y scales to be used for all SplomCells
var xScale = d3.scaleLinear().range([0, cellWidth - cellPadding]);
var yScale = d3.scaleLinear().range([cellHeight - cellPadding, 0]);
// axes that are rendered already for you
var xAxis = d3.axisTop(xScale).ticks(6).tickSize(-cellHeight * N, 0, 0);
var yAxis = d3.axisLeft(yScale).ticks(6).tickSize(-cellWidth * N, 0, 0);
// Ordinal color scale for cylinders color mapping
var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
// Map for referencing min/max per each attribute
var extentByAttribute = {};
// Object for keeping state of which cell is currently being brushed
var brushCell;

// ****** Add reusable components here ****** //
function SplomCell(x, y, col, row) {
    this.x = x;
    this.y = y;
    this.col = col;
    this.row = row;
}

var cells = [];
dataAttributes.forEach(function (attrX, col) {
  dataAttributes.forEach(function (attrY, row) {
    cells.push(new SplomCell(attrX, attrY, col, row));
  });
});

console.log(cells);


d3.csv('cars.csv', dataPreprocessor).then(function(dataset) {
  cars = dataset;

  // Create map for each attribute's extent
  dataAttributes.forEach(function (attribute) {
    extentByAttribute[attribute] = d3.extent(dataset, function (d) {
      return d[attribute];
    });
  });

  // Pre-render gridlines and labels
  chartG
    .selectAll(".x.axis")
    .data(dataAttributes)
    .enter()
    .append("g")
    .attr("class", "x axis")
    .attr("transform", function (d, i) {
      return (
        "translate(" + [(N - i - 1) * cellWidth + cellPadding / 2, 0] + ")"
      );
    })
    .each(function (attribute) {
      xScale.domain(extentByAttribute[attribute]);
      d3.select(this).call(xAxis);
      d3.select(this)
        .append("text")
        .text(attribute)
        .attr("class", "axis-label")
        .attr("transform", "translate(" + [cellWidth / 2, -20] + ")");
    });
  chartG
    .selectAll(".y.axis")
    .data(dataAttributes)
    .enter()
    .append("g")
    .attr("class", "y axis")
    .attr("transform", function (d, i) {
      return "translate(" + [0, i * cellHeight + cellPadding / 2] + ")";
    })
    .each(function (attribute) {
      yScale.domain(extentByAttribute[attribute]);
      d3.select(this).call(yAxis);
      d3.select(this)
        .append("text")
        .text(attribute)
        .attr("class", "axis-label")
        .attr(
          "transform",
          "translate(" + [-26, cellHeight / 2] + ")rotate(270)"
        );
    });

  // ********* Your data dependent code goes here *********//

  SplomCell.prototype.init = function (g) {
    var cell = d3.select(g);

    cell
      .append("rect")
      .attr("class", "frame")
      .attr("width", cellWidth - cellPadding)
      .attr("height", cellHeight - cellPadding);
  };

  SplomCell.prototype.update = function (g, data) {
    var cell = d3.select(g);

    // Update the global x,yScale objects for this cell's x,y attribute domains
    xScale.domain(extentByAttribute[this.x]);
    yScale.domain(extentByAttribute[this.y]);

    // Save a reference of this SplomCell, to use within anon function scopes
    var _this = this;

    var dots = cell.selectAll(".dot").data(data, function (d) {
      return d.name + "-" + d.year + "-" + d.cylinders; // Create a unique id for the car
    });

    var dotsEnter = dots
      .enter()
      .append("circle")
      .attr("class", "dot")
      .style("fill", function (d) {
        return colorScale(d.cylinders);
      })
      .attr("r", 4);

    dots
      .merge(dotsEnter)
      .attr("cx", function (d) {
        return xScale(d[_this.x]);
      })
      .attr("cy", function (d) {
        return yScale(d[_this.y]);
      });

    dots.exit().remove();
  };

  // Draw the 16 SplomCells
  var cellEnter = chartG
    .selectAll(".cell")
    .data(cells)
    .enter()
    .append("g")
    .attr("class", "cell")
    .attr("transform", function (d) {
      // Start from the far right for columns to get a better looking chart
      var tx = (N - d.col - 1) * cellWidth + cellPadding / 2;
      var ty = d.row * cellHeight + cellPadding / 2;
      return "translate(" + [tx, ty] + ")";
    });

    cellEnter.each(function(cell){
        cell.init(this);
        cell.update(this, dataset);
    });

    
});


// ********* Your event listener functions go here *********//


// Remember code outside of the data callback function will run before the data loads

function dataPreprocessor(row) {
    return {
        'name': row['name'],
        'economy (mpg)': +row['economy (mpg)'],
        'cylinders': +row['cylinders'],
        'displacement (cc)': +row['displacement (cc)'],
        'power (hp)': +row['power (hp)'],
        'weight (lb)': +row['weight (lb)'],
        '0-60 mph (s)': +row['0-60 mph (s)'],
        'year': +row['year']
    };
}