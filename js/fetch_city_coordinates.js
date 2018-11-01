//https://developers.google.com/maps/documentation/geocoding/start
//https://population.mongabay.com/population/sweden/
//http://www.datamake.io/blog/d3-zoom
var api_key = "AIzaSyCZ9FpAsVSW2Gzy8XnpTFacw_X8sD94Jq8";
var list_of_cities = [
  'Stockholm',
  'Göteborg',
  'Malmö',
  'Uppsala',
  'Västerås',
  'Örebro',
  'Linköping',
  'Helsingborg',
  'Huddinge',
  'Jönköping',
  'Norrköping',
  'Lund',
  'Haninge',
  'Umeå',
  'Gävle',
  'Solna',
  'Borås',
  'Bromma',
  'Södertälje',
  'Växjö',
  'Mölndal',
  'Karlstad',
  'Eskilstuna',
  'Sollentuna',
  'Täby',
  'Halmstad',
  'Sundsvall',
  'Luleå',
  'Trollhättan',
  'Lidingö',
  'Östersund',
  'Borlänge',
  'Upplands Väsby',
  'Falun',
  'Östermalm',
  'Tumba',
  'Kalmar',
  'Sundbyberg',
  'Skövde',
  'Karlskrona',
  'Kristianstad',
  'Skellefteå',
  'Uddevalla',
  'Motala',
  'Majorna',
  'Partille',
  'Landskrona',
  'Örnsköldsvik',
  'Nyköping',
  'Karlskoga',
  'Åkersberga',
  'Vallentuna',
  'Varberg',
  'Trelleborg%20Sweden',
  'Nacka',
  'Alingsås',
  'Lidköping',
  'Jakobsberg',
  'Ängelholm',
  'Märsta',
  'Sandviken',
  'Piteå',
  'Visby',
  'Vänersborg',
  'Boo',
  'Huskvarna',
  'Kungälv',
  'Katrineholm',
  'Västervik',
  'Enköping',
  'Skara',
  'Kungsbacka%20Sweden',
  'Falkenberg',
  'Boden%20Sweden',
  'Karlshamn',
  'Kiruna',
  'Värnamo',
  'Kristinehamn',
  'Ystad',
  'Hässleholm',
  'Härnösand',
  'Norrtälje',
  'Råsunda',
  'Årsta',
  'Köping',
  'Oskarshamn',
  'Gamla Uppsala',
  'Tullinge',
  'Nässjö',
  'Lerum%20Sweden',
  'Eslöv',
  'Falköping%20Sweden',
  'Röstånga'
];
var cities_formatted;
var q = d3.queue();
var qt = d3.queue();
function fetch_cities(){
    qt.defer(d3.csv,"data/tätorter.csv")

    qt.awaitAll(function(error, data_list){
        // console.log(data_list);
      for(var i = 0; i < data_list[0].length; i++){
        list_of_cities[i] = data_list[0][i].ort;
      }
      queue_master();
    });
    // var i = 0;

}
var time = 0;
function queue_master(){
  q.defer(d3.json,"https://maps.googleapis.com/maps/api/geocode/json?address="+list_of_cities[time]+"&key=AIzaSyCZ9FpAsVSW2Gzy8XnpTFacw_X8sD94Jq8");
  if(time < list_of_cities.length-1){
    time++;
    setTimeout(queue_master, 50);
  } else {
    q.awaitAll(function(error, data_list){
      if(error) throw error;
      // for(var i = 1; i < data_list.length; i++){
        // cities_formatted[i] = map_data(data.results[i]);
      // }
      console.log(data_list);
      cities_formatted = map_data(data_list);
      console.log(cities_formatted);
      $(".texta").text(JSON.stringify(cities_formatted));
      // console.log(list_of_cities[71]);
      // console.log(list_of_cities[73]);
      // console.log(list_of_cities[89]);

    });
  }
}

function map_data(rawData){
  var mynodes = rawData.map(function (d,i){
    if(d.status.match("ZERO_RESULTS")){
      return;
    }
    return {
      id : i,
      radius : 15,
      coordinates : {
        x : d.results[0].geometry.location.lng,
        y : d.results[0].geometry.location.lat
      },
      short_name : d.results[0].address_components[0].short_name,
      name : d.results[0].address_components[0].long_name
    }
  });
  return mynodes;
}
