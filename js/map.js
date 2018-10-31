//http://bl.ocks.org/lwhitaker3/9348e54d6d85d8e7a70d
//https://bl.ocks.org/ChumaA/385a269db46ae56444772b62f1ae82bf


//https://www.gps-coordinates.net/
var cities;
var width = 800,
    height = 535;

var zoom = d3.zoom()
    .scaleExtent([1, 100])
    .on("zoom.foo", zoomed2)
    .on("zoom.bar", zoomed);

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip_bubble")
    .style("opacity", 0);

var projection = d3.geoMercator()
    .rotate([5,-1])
    // .scale(950)
    .scale(500)
    // .center([29,62]) // X,Y or 21
    .center([15,58])
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection);

var svg = d3.select("svg")
    .attr("width", "100%")
    .attr("height", height)
    // .append("rect")
    // .attr("width", "100%")
    // .attr("height", "100%")
    // .attr("fill", "pink")
    // .attr("fill","lightblue")
    .call(zoom);
    // .append("g")


var g = svg.append("g");                              // The map itself
var cities_container = svg.append("g")
          // .attr('width',"100%")
          // .attr("height","100%")
          .attr("class","circle_box");  // All corresponding circle_packings
          var projects = svg.append("g");

var cities_circles;
var project_circles;
var mock_data = {};
var project_coordinates = {
  "Stockholm" : {
    "x" : 18.068580800000063,
    "y" : 59.32932349999999
  },
  "Karlstad" : {
    "x" : 13.51149780000003,
    "y" : 59.4021806
  },
  "Kiruna" : {
    "x" : 20.225282,
    "y" : 67.8558
  },
  "Umeå" : {
    "x" : 20.263035,
    "y" : 63.825847
  },
  "Göteborg" : {
    "x" : 11.97456,
    "y" : 57.70887
  },
  "Uppsala" : {
    "x" : 17.638926699999956,
    "y" : 59.85856380000001
  },
  "Lund" : {
    "x" : 13.191007300000024,
    "y" : 55.70466010000001
  },
  "Kungälv" : {
    "x" : 11.974031700000069,
    "y" : 57.86975400000001
  },
  "Kalmar" : {
    "x" : 16.35677910000004,
    "y" : 56.6634447
  },
  "Röstånga" : {
    "x" : 13.29325689999996,
    "y" : 56.0024903
  },
  "Malmö" : {
    "x":13.003822,
    "y":55.604981
  },
  "N/A" : {
    "x":18.068580800000063,
    "y":59.32932349999999
  }
};

function zoomed() {
  g.attr("transform",  d3.event.transform);
}

function zoomed2(){
  cities_circles.attr("transform",circle_transform(d3.event.transform));
  project_circles.attr("transform",project_transform(d3.event.transform));
  project_circles.attr("r",circle_size_increase);
}

function circle_size_increase(d){
  // console.log(d3.event.transform);
  // console.log(this);
  // use THIS
  if(d3.event.transform.y < -600 && d3.event.transform.y > -800){
    // console.log(d3.event.transform);
    // console.log(d);
    // return
  }
  return 5;
}

function circle_transform(t) {
  return function(d) {
    // console.log()
    var c = [this.getAttribute('cx'), this.getAttribute('cy')];
    var r = t.apply(c);
    var x = [r[0] - c[0],r[1]-c[1]];

    return "translate(" + x + ")";
  };
}

function project_transform(t) {
  return function(d) {
    // console.log(d);
    // console.log(this);
    // var c = project_coordinates[d.survey_answers.location];
    // var r = projection([c.x, c.y]);
    var r = [this.getAttribute('cx'), this.getAttribute('cy')];
    var x = t.apply(r);
    var a = [x[0] - r[0], x[1] - r[1]];
    // console.log(c);
    return "translate(" + a + ")";
  };
}

function load_map_components(){
  // var q = d3.queue();
  d3.json("data/cities_updated.json", function(error,data){
    cities = data;
    cities_circles = cities_container.selectAll("circle")
       .data(cities).enter()
       .append("circle")
       .attr("id",function(d){return"circle-"+d.id})
       .attr("cx", function (d) { return projection([d.coordinates.x, d.coordinates.y])[0]; })
       .attr("cy", function (d) { return projection([d.coordinates.x, d.coordinates.y])[1]; })
       // .attr("cy","0")
       // .attr("cx","0")
       .attr("r", "3")
       .attr("fill", function(d){
         return "black";
       })
       .on("mouseover",handleMouseOverCircle)
       .on("mouseout",handleMouseOutCircle);


       function handleMouseOverCircle(d){
         tooltip.transition().style("opacity", .9);
         tooltip.html("<b>"+d.name + "</b>")
           .style("left", (d3.event.pageX) + "px")
           .style("top", (d3.event.pageY - 28) + "px")
           .style("max-width",  200 + "px");
       }

       function handleMouseOutCircle(d){
          tooltip.transition().style("opacity", 0);
        }
  });

  d3.json("data/mock-data.json", function(error,data){
    mock_data = data.data;

    console.log(data.data);
    // for(var i = 0; i < data.data.length; i++){
    //   // console.log('f');
    //   create_sunburst(cities_container, data.data[i].survey_answers, projection);
    // }

    project_circles = projects.selectAll("circle")
       .data(data.data).enter()
       .append("circle")
       .attr("id",function(d){return"project-"+d.survey_answers.project_id})
       .attr("cx", function (d) { var c = project_coordinates[d.survey_answers.location]; return projection([c.x,c.y])[0];})
       .attr("cy", function (d) { var c = project_coordinates[d.survey_answers.location]; return projection([c.x,c.y])[1];})
       // .attr("cx","0")
       // .attr("cy","0")
       .attr("r", "3")
       .style("stroke-width", .4)
       .style("stroke", "#fff")
       .attr("fill", function(d){
         // this.parentNode.appendChild(this);
         return "#EA9A00";
         // return "#97C28E";
       })
       .on('click',handleClick);

     function handleClick(d){
       console.log(d);
       console.log(this);
       var projects_in_city = [];
       var city = d.survey_answers.location;
       for(var i = 0; i < mock_data.length; i++){
         if(mock_data[i].survey_answers.location.match(city)){
           projects_in_city.push(mock_data[i]);
         }
       }
       console.log(projects_in_city);
       if(projects_in_city.length > 1){
         // console.log("bigger");
         $("#multi_title").text("Multiple Projects in " + city);

         var str = "";
         for(var i = 0; i < projects_in_city.length; i++){
           str += "<div id='projc' onclick='show_project("+mock_data[i].survey_answers.project_id+")'>" + projects_in_city[i].survey_answers.project_title+"</div><br>\n";
         }
         $("#multi_proj_list").html(str);
         $(".multi-proj").css("display","initial");

       } else{
         $("#info_box_col").css("display","initial");
         // d3.select("#card_budget").enter()
         document.getElementById('project_title').innerHTML = d.survey_answers.project_title;
         document.getElementById('project_subtitle').innerHTML = d.survey_answers.project_type;
         document.getElementById('project_leader').innerHTML = d.survey_answers.project_organization;
         document.getElementById('budget').innerHTML = d.survey_answers.budget.funded;
       }


       // document.getElementById('project_time').innerHTML = d.survey_answers.date;
       // document.getElementById('project_keywords').innerHTML = d.survey_answers;

       // document.getElementById('card_descriptive_text').innerHTML = d.survey_answers.text;
       // document.getElementById('card_webesite_link').innerHTML = d.survey_answers.path;




     }
  });
  d3.json('data/europe.topo.json', function(error, europe){
    g.selectAll(".continent_Europe_subunits")
      .data(topojson.feature(europe, europe.objects.continent_Europe_subunits).features)
        .enter().append("path")
        .attr("class", function(d) {return "country-" + d.id;})
        .attr("d", path)
        .attr("fill","#cdc");

    g.append("path")
        .attr("stroke", "black")
        // .attr("fill","#cdc")
        .attr("fill","#cdc")
        .attr("stroke-width", 0.2)
        .attr("d", path(topojson.mesh(europe, europe.objects.continent_Europe_subunits, border)));
     function border(id0, id1) {

      return function(a, b) {
        return a.id === id0 && b.id === id1
            || a.id === id1 && b.id === id0;
        return true;
      };
      }
  });
  d3.json("data/sweden.topo.json", function(error, sweden) {

    g.selectAll(".subunit")
        .data(topojson.feature(sweden, sweden.objects.subunits).features)
        .enter().append("path")
          .attr("class", function(d) {return "subunit-" + d.geounit;})
          .attr("d", path)
          .attr("fill","#669966");
          // .attr("fill","#97C28E");

          // return "#97C28E";

       g.append("path")
           .attr("stroke", "#404040")
           .attr("fill"," #669966")
           // .attr("fill","#97C28E")

           .attr("stroke-width", 0.2)
           .attr("d", path(topojson.mesh(sweden, sweden.objects.subunits, borders)));

     function borders(id0, id1) {
       // console.log(id0);
       // console.log(id1);
      return function(a, b) {
        // console.log(a);
        return a.id === id0 && b.id === id1
            || a.id === id1 && b.id === id0;
      };
    }
  });
}

function hide_text(r){
  if(r==1){
    document.getElementById('multi-proj').style.display = "none";
  } else if (r == 0){
    document.getElementById('info_box_col').style.display = "none";
  }
}

function show_project(proj_id){
  hide_text(1);
  $("#info_box_col").css("display","initial");
  // d3.select("#card_budget").enter()
  var d;
  for(var i = 0; i < mock_data.length; i++){
    if(mock_data[i].survey_answers.project_id == proj_id){
      d = mock_data[i];
    }
  }
  document.getElementById('project_title').innerHTML = d.survey_answers.project_title;
  document.getElementById('project_subtitle').innerHTML = d.survey_answers.project_type;
  document.getElementById('project_leader').innerHTML = d.survey_answers.project_organization;
  document.getElementById('budget').innerHTML = d.survey_answers.budget.funded;

}
