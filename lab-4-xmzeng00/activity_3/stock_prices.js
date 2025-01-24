// **** Example of how to create padding and spacing for trellis plot****
var svg = d3.select('svg');

// Hand code the svg dimensions, you can also use +svg.attr('width') or +svg.attr('height')
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

// Define a padding object
// This will space out the trellis subplots
var padding = {t: 20, r: 20, b: 60, l: 60};

// Compute the dimensions of the trellis plots, assuming a 2x2 layout matrix.
trellisWidth = svgWidth / 2 - padding.l - padding.r;
trellisHeight = svgHeight / 2 - padding.t - padding.b;

// As an example for how to layout elements with our variables
// Lets create .background rects for the trellis plots
svg.selectAll('.background')
    .data(['A', 'B', 'C', 'C']) // dummy data
    .enter()
    .append('rect') // Append 4 rectangles
    .attr('class', 'background')
    .attr('width', trellisWidth) // Use our trellis dimensions
    .attr('height', trellisHeight)
    .attr('transform', function(d, i) {
        // Position based on the matrix array indices.
        // i = 1 for column 1, row 0)
        var tx = (i % 2) * (trellisWidth + padding.l + padding.r) + padding.l;
        var ty = Math.floor(i / 2) * (trellisHeight + padding.t + padding.b) + padding.t;
        return 'translate('+[tx, ty]+')';
    });

var parseDate = d3.timeParse('%b %Y');
// To speed things up, we have already computed the domains for your scales
var dateDomain = [new Date(2000, 0), new Date(2010, 2)];
var priceDomain = [0, 223.02];

// **** How to properly load data ****

d3.csv('stock_prices.csv').then(function(dataset) {



// **** Your JavaScript code goes here ****

    // console.log(dataset)
    dataset.forEach(function(d) {
        d.date = parseDate(d.date);
    });
    console.log(dataset);

    let nested = d3.nest()
        .key(function(d) { return d.company; })
        .entries(dataset);

    console.log(nested)


    // activity 2
    let trellisG = svg.selectAll('g.trellis')
        .data(nested)
        .enter()
        .append('g')
        .attr('class', 'trellis')
        .attr('transform', function(d, i) { 
            let xPos = (i % 2) * (trellisWidth + padding.l + padding.r) + padding.l;
            let yPos = Math.floor(i / 2) * (trellisHeight + padding.t + padding.b) + padding.t;
            return `translate(${xPos},${yPos})`;
        });


    let xScale = d3.scaleTime()
                    .domain(dateDomain)
                    .range([0, trellisWidth]);
    let yScale = d3.scaleLinear()
                    .domain(priceDomain)
                    .range([trellisHeight, 0]);

    let lineInterpolate = d3.line()
                .x(function(d) {return xScale(d.date) })
                .y(function(d) {return yScale(d.price) });


    
                            
    // grid
    var xGrid = d3.axisTop(xScale)
        .tickSize(-trellisHeight, 0, 0)
        .tickFormat('');

    var yGrid = d3.axisLeft(yScale)
        .tickSize(-trellisWidth, 0, 0)
        .tickFormat('')
    

    trellisG.append('g')
            .attr('class', 'x grid')
            .call(xGrid)
    
    trellisG.append('g')
            .attr('class', 'y grid')
            .call(yGrid)

            
    // append path + color
    let colorScale = d3.scaleOrdinal()
        .domain(nested.map(d => d.key)) 
        .range(d3.schemeCategory10); 

    trellisG.append('path')
            .attr('class', 'line-plot')
            .attr('d', d => lineInterpolate(d.values))
            .style('strock', '#333')
            .style('stroke', d => colorScale(d.key) );
            

    // axis
    let xAxis =  d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale);

    trellisG.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${trellisHeight})`)
        .call(xAxis);

    trellisG.append('g')
        .attr('class', 'y axis')
        .call(yAxis);



    // activity 3
    trellisG.append('text')
            .attr('class', 'company-label')
            .attr('x', trellisWidth / 2) 
            .attr('y', trellisHeight / 2) 
            .style('fill', d => colorScale(d.key))
            .text(d => d.key);

    trellisG.append('text')
            .attr('class', 'x axis-label')
            .attr('x', trellisWidth / 2) 
            .attr('y', trellisHeight + 34)
            .attr('text-anchor', 'middle')
            .text('Date (by Month)');
    
    trellisG.append('text')
            .attr('class', 'y axis-label')
            .attr('transform', `translate(${-30}, ${trellisHeight / 2}) rotate(-90)`)
            .attr('text-anchor', 'middle')
            .text('Date (by Month)');


    // // grid
    // var xGrid = d3.axisTop(xScale)
    //     .tickSize(-trellisHeight, 0, 0)
    //     .tickFormat('');

    // var yGrid = d3.axisLeft(yScale)
    //     .tickSize(-trellisWidth, 0, 0)
    //     .tickFormat('')
    

    // trellisG.append('g')
    //         .attr('class', 'x grid')
    //         .call(xGrid)
    
    // trellisG.append('g')
    //         .attr('class', 'y grid')
    //         .call(yGrid)




});

// Remember code outside of the data callback function will run before the data loads
console.log("test")






