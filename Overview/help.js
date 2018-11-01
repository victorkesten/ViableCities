var width = 1300;
var height = 400;


var omrade_titles = {
  0: "Civilsamhällesorganisation",
  1: "Forskning",
  2: "Näringsliv",
  3: "Offentlig verksamhet"
};

var q_o = {
   "Civilsamhällesorganisation" : 0,
   "Forskning" : 1,
   "Näringsliv": 2,
   "Offentlig verksamhet": 3
}

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip_bubble")
    .style("opacity", 0);

var omradeCenters = {
  0: { x: width / 3, y: height / 2 },
  1: { x: width / 2, y: height / 2 },
  2: { x: 2 * width / 3, y: height / 2 },
  3: { x:250, y:0}
};
var center = { x: width / 2, y: height / 2 };

var omrade_titles_x = {
    3: 210,
    0: 415,
    1: 630,
    2: 890
};
var omrade_titles_y = {
  3: 100,
  0: 100,
  1: 100,
  2:50
};

var bubbles = null;
var nodes;
var zoom = d3.zoom()
    .scaleExtent([.2, 20])
    .on("zoom", zoomed);

var svg = d3.select("svg")
      .attr("width",width)
      .attr("height",height);

var g = svg.append("g");

var view_option = 0;

svg.call(zoom);
function zoomed() {
  g.attr("transform", d3.event.transform);
}


// sim
var forceStrength = 0.025;
var simulation = d3.forceSimulation()
  .velocityDecay(0.2)
  .force('x', d3.forceX().strength(forceStrength).x(center.x))
  .force('y', d3.forceY().strength(forceStrength).y(center.y))
  .force('charge', d3.forceManyBody().strength(charge))
  .on('tick', ticked);

  simulation.stop();

  // Moving
  function charge(d) {
    // 2.15 works well
    return -Math.pow(d.radius, 2.0) * forceStrength;
  }

  function ticked() {
  bubbles
    .attr('cx', function (d) { return d.x; })
    .attr('cy', function (d) { return d.y; });
}


function createNewNodes(rawData){
  var myNodes = rawData.map(function (d,i){
    return {
      id: (i),
      radius : 15,
      organisation: d.Organisation,
      value: Math.random() * 10,
      kategori:convert_omrade(d.Kategori),
      x: Math.random() * 900,
      y: Math.random() * 800
    };
  });
  myNodes.sort(function (a,b){ return b.value - a.value; });
  return myNodes;
}

function convert_omrade(q_id){
  return q_o[q_id];
}



function chart(rawData) {
  var maxAmount = d3.max(rawData, function (d) { return +d.total_amount; });

  var radiusScale = d3.scalePow()
    .exponent(0.5)
    .range([2, 85])
    .domain([0, maxAmount]);
  nodes = createNewNodes(rawData);
  console.log(nodes);
  bubbles = g.selectAll('.bubble')
    .data(nodes, function (d) { return d.id; });

  var bubblesE = bubbles.enter().append('circle')
    .classed('bubble', true)
    .attr('r', 0)
    .style("stroke","black")
    .style("fill",function(d){ return mote_color(d);})
    .attr('stroke-width', 1)
    .on("mouseover",handleMouseOverCircle)
    .on("mouseout",handleMouseOutCircle);


  bubbles = bubbles.merge(bubblesE);

  bubbles.transition()
    .duration(2000)
    .attr('r', function (d) { console.log(d.radius); return d.radius; });

  // Start simulation
  simulation.nodes(nodes);
  move_bubbles(0);

  create_omrade_titles();

  function handleMouseOverCircle(d){
    var id = d.id;
    this.parentNode.appendChild(this);
    d3.selectAll(".bubble")
      .filter(function(d){if(d.id==id){return false;}return true;})
      .transition()
        .style("opacity","0.3");

    tooltip.transition().style("opacity", .9);
    tooltip.html(d.organisation) //+ " " + omrade_titles[d.kategori])
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 28) + "px")
      .style("max-width",  200 + "px");
  }

  function handleMouseOutCircle(d){
    tooltip.transition().style("opacity", 0);
    d3.selectAll(".bubble")
      .transition()
        .style("opacity","1");
  }
};

function move_bubbles(opt){
  if(opt == 0){
    simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));
  } else if (opt == 1){
    simulation.force('x', d3.forceX().strength(forceStrength).x(omrade_view));
  }
  simulation.alpha(1).restart();
  toggle_title();
}

function change_view(option){
  $("#view_"+view_option).removeClass("active");
  $("#view_"+option).addClass("active");
  view_option = option;
  move_bubbles(option);
}

function omrade_view(d){

  return omradeCenters[d.kategori].x;
}

function start_program(){
  var q = d3.queue();
  q.defer(d3.csv, "data.csv");

  q.awaitAll(function(error, data_list){
    if(error) throw error;
    console.log(data_list);
    // var no = createNewNodes(data_list[0]);
    chart(data_list[0]);
    // console.log(no);

  });
  // question_omrade = o;
  // meet_info = t;
  // prepare_meetings(t);
}


function create_omrade_titles(){
  var omradeData = d3.keys(omrade_titles);
  var years = g.selectAll('.omradeTitles')
  .data(omradeData);

years.enter().append('text')
  .attr('class', 'omradeTitles')
  .attr('display','none')
  .attr('x', function (d) { return omrade_titles_x[d]; })
  .attr('y', function(d){  return omrade_titles_y[d];})
  .attr('text-anchor', 'middle')
  .text(function (d) { return omrade_titles[d]; });
}

function toggle_title(){
  if(view_option == 1){
    console.log(view_option);
    $(".omradeTitles").css("display","initial");
    // d3.selectAll(".omradeTitles")
  } else {
    $(".omradeTitles").css("display","none");
  }
}

function mote_color(d){
  if(d.kategori == 0){
    return "rgb(0,125,145)";
  } else if (d.kategori == 1){
    return "#EA9A00";
  } else if (d.kategori == 2){
    return "#00A389";
  } else if (d.kategori == 3){
    return "#97C28E";
  }
  return "black";
}

start_program();
