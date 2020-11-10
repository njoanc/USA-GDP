document.addEventListener('DOMContentLoaded', function () {
    let dataUrl = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';
    req = new XMLHttpRequest();
    req.open("GET", dataUrl, true);
    req.send();
    req.onload = function () {
        json = JSON.parse(req.responseText);
        var dataset = json['data'];
        var gdpMax = d3.max(dataset, (d) => d[1]);
        var gdpMin = d3.min(dataset, (d) => d[1]);

        var format = d3.format(",.2f");
        var q = (date) => {
            var arr = date.split('-');
            if (arr[1] == '01')
                return arr[0] + ' Q1';
            else if (arr[1] == '04')
                return arr[0] + ' Q2';
            else if (arr[1] == '07')
                return arr[0] + ' Q3';
            else
                return arr[0] + ' Q4';
        }

        var padding = 80;
        var width = 900 + padding * 2; //dataset.length * 3
        var height = 500;
        var barWidth = 900 / dataset.length;

        const tooltip = d3.select("body")
            .append("div")
            .attr("id", "tooltip").style("fill", "rose");

        const svg = d3.select("#chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
        // .style("background-color", "white");

        svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("data-date", (d) => d[0])
            .attr("data-gdp", (d) => d[1])
            .attr("x", (d, i) => i * barWidth)
            .attr("y", (d) => 5 + (height - padding) - d[1] * (height - padding) / gdpMax)
            // .style("fill", "green")
            // .transition().duration(3000)
            // .style("fill", "gray")
            .attr("width", barWidth)
            .attr("height", (d) => d[1] * (height - padding) / gdpMax)
            .attr("transform", "translate(" + padding + ", 0)")
            // .style("fill", "orange")
            // .transition().duration(2000)
            // .style("fill", "green")

            .on("mouseover", function (d) {
                return tooltip.style("visibility", "visible")
                    .attr("data-date", d[0])
                    .html(q(d[0]) + '<br /> $' + format(d[1]) + ' Billion');
            })
            .on("mousemove", function () {
                return tooltip.style("top", (d3.event.pageY - 20) + "px")
                    .style("left", (d3.event.pageX + 20) + "px");
            })
            .on("mouseout", function () {
                return tooltip.style("visibility", "hidden");
            });


        var xscale = d3.scaleLinear()
            .domain([d3.min(dataset, (d) => (new Date(d[0])).getFullYear()),
            d3.max(dataset, (d) => (new Date(d[0])).getFullYear())])
            .range([0, width - 2 * padding]);
        var x_axis = d3.axisBottom()
            .scale(xscale)
            .tickFormat(d3.format("d"));

        svg.append("g")
            .attr("transform", "translate(" + padding + ", " + (height - padding + 5) + ")")
            .attr("id", "x-axis")
            .call(x_axis);

        var yscale = d3.scaleLinear()
            .domain([0, gdpMax])
            .range([height - padding, 0]);

        var y_axis = d3.axisLeft()
            .scale(yscale);

        svg.append("g")
            .attr("transform", "translate(" + padding + ", 3)")
            .attr("id", "y-axis")
            .call(y_axis).transition().duration(5000).style("fill", "black");

        svg.append("text")
            .text("Gross Domestic Product")
            .style("fill", "green").transition().duration(3000).style("fill", "red")
            .attr("x", -200)
            .attr("y", padding + 30)
            .attr("transform", "rotate(-90)");

        svg.append("text")
            .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf")
            .style("font-size", "11")
            .style("fill", "green")
            .attr("x", 700)
            .attr("y", height - 25);
    };
});