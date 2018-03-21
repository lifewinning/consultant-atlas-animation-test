// basically just an appropriation of https://www.mapbox.com/mapbox-gl-js/example/scroll-fly-to/

mapboxgl.accessToken = 'pk.eyJ1IjoibGlmZXdpbm5pbmciLCJhIjoiYWZyWnFjMCJ9.ksAPTz72HyEjF2AOMbRNvg';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/lifewinning/cjd52cola5t0g2rnvua7d2frg',
    center: [-0.15591514, 51.51830379],
    zoom: 15.5,
    //bearing: 27,
    //pitch: 45
});

// On every scroll event, check which element is on screen
window.onscroll = function() {
    var chapterNames = Object.keys(chapters);
    for (var i = 0; i < chapterNames.length; i++) {
        var chapterName = chapterNames[i];
        if (isElementOnScreen(chapterName)) {
            setActiveChapter(chapterName);
            break;
        }
    }
};

//var activeChapterName = 'baker';

map.on('style.load',function(){
    // map.addSource('cops',{
    //     'type':'geojson',
    //     'data':'consulting-polygons.geojson'
    // })
    map.addLayer({
        'id':'cops',
        'type':'line',
        'source':{
            "type":'geojson',
            "data": 'consulting-polygons.geojson'   
        },
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        'paint': {
        'line-color': 'red',
        'line-opacity': 0.8,
        'line-width': 3
        }
    })
})
var sortByProperty = function (property) {
    return function (x, y) {
        return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));};
    };


coords = []
fetch('consulting-polygons.geojson')
  .then(function(response) {
    return response.json();
  })
  .then(function(cops) {
    feat = cops.features
    div = document.querySelector('#features')
    feat.forEach(function(e){
       newdiv = document.createElement('section')
       newdiv.setAttribute('height', window.innerHeight)
       newdiv.id = e.properties.cop+e.properties.location.replace(', ','').replace(' ','')+e.properties.year.toString()
       h3 = document.createElement('h3')
       h3.innerText = e.properties.location+ ' | '+e.properties.year.toString()+ ' ('+e.properties.cop+')'
       newdiv.append(h3)
       p = document.createElement('p')
       p.innerText = e.properties.caption
       newdiv.append(p)
       div.append(newdiv)
       var bounds = turf.bbox(e.geometry)
       obj = {}
       obj.ne = [bounds[0], bounds[1]]
       obj.sw = [bounds[2],bounds[3]]
       obj.id = newdiv.id
       coords.push(obj)
    })
})
.then(function(response){
        active = document.querySelector('section')
        active.setAttribute('class','active')
        activeid = active.id
})

window.onscroll = function(){
    coords.forEach(function(c){
        if(isElementOnScreen(c.id)){
           rebound(c.id, [c.ne,c.sw])}
    })
}
    
function isElementOnScreen(id) {
    var element = document.getElementById(id);
    var bounds = element.getBoundingClientRect();
    return bounds.top < window.innerHeight/2 && bounds.bottom > window.innerHeight/4;
}

function rebound(id, coord){
    if (id == activeid) return;
    map.fitBounds(coord);
    document.querySelector('#'+id).setAttribute('class','active')
    document.querySelector('#'+activeid).setAttribute('class','')
    activeid = id
}

