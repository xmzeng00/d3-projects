
// **** Your JavaScript code goes here ****
d3.csv('./baseball_hr_leaders_2017.csv').then(function(data){
    console.log("Line 1: inside the callback function");
    console.log(data);

    // append p
    let homerunLeaders = d3.select('#homerun-leaders');
    homerunLeaders.selectAll('p')
        .data(data)
        .enter()
        .append('p')
        .text(function(d, i){
            return (i +1) + ". " + d.name + ": " + d.homeruns + " Home Runs";
        })
        .style('font-weight', function(d) {
		    return d.name == 'Giancarlo Stanton' ? 'bold' : 'normal';
        })
    ;
    

    // table
    // let main = d3.select('#main');
    let tbody = d3.select('#homerun-table').select('tbody');
    
    let rows = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr');
    
    rows.append('td')
        .text(function(d, i) { return i + 1; });

    rows.append('td')
        .text(function(d) { return d.name; });

    rows.append('td')
        .text(function(d) { return d.homeruns; });



});


console.log("Line 2: outside the callback function");