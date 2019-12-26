$(document).ready(function() {
  $('html, body, *').mousewheel(function(e, delta) {
    this.scrollLeft -= (delta);
  });
});

window.addEventListener("scroll", function (event) {
    var scroll = this.scrollX;
    // console.log(scroll)
    d3.select('.dialogbox-2')
    .style('top','100%')

    if(scroll>=400 && scroll <= 999){
      $('.dialogbox-1').removeClass('show')
      $('.dialogbox-1').addClass('hide')
      // $('.dialogbox-2').removeClass('hide')
      // $('.dialogbox-2').addClass('show')
      d3.select('.dialogbox-2')
      .style('top','100%')
      .transition()
      .duration(250)
      .ease(d3.easeLinear)
      .style('top','60%')
      .style('left','750px')

      d3.selectAll('.circle').attr('opacity',function(d){
        if(d.cause == "raccoon"){return 1}
        else{return .2}
      })
    }
    else if(scroll >=1000){
      // $('.dialogbox-2').removeClass('show')
      // $('.dialogbox-2').addClass('hide')
      $('.dialogbox-3').removeClass('hide')
      $('.dialogbox-3').addClass('show')

      d3.selectAll('.circle').attr('opacity',1)
    }
    else if(scroll <=499){
      $('.dialogbox-1').removeClass('hide')
      $('.dialogbox-1').addClass('show')
      // $('.dialogbox-2').removeClass('show')
      // $('.dialogbox-2').addClass('hide')

      d3.selectAll('.circle').attr('opacity',1)
    }
});

data = d3.csv('data/jan_feb_aug_sept_oct_nov.csv')
  .then((csv) => {

// X jan
// X feb
//mar
//apr
//may
//june
//july
// X aug
// X sept
// X oct
// X nov
//dec

    // d3.select('#dialog')
    // .append('div')
    // .attr('class','dialog-4')
    // .style('position','absolute')
    // .style('top','60%')
    // .style('left','500px')
    // .style('width','300px')
    // .text('Hello!')
var parseTime = d3.timeParse("%m/%d/%Y %I:%M:%S %p");

  csv.forEach(function(d){
    alltrains = d.train.split(',')
    d.trainone= alltrains[0]
    hoursminutes = d.time.split(':')
    d.hours = hoursminutes[0]
    d.minutes = hoursminutes[1]
    d.fulldateparsed = parseTime(d.fulldate);
  })
  console.log('csv',csv)
  function sortByDateAscending(a, b) {
      return a.fulldateparsed - b.fulldateparsed;
  }
  sortedCSV = csv.sort(sortByDateAscending);
  console.log('sortedCSV',sortedCSV)
  data = sortedCSV.filter(function(d){return d.trainone != '' && d.time != ''})
  console.log('data length',data.length)
  console.log('data',data)
  nodate = sortedCSV.filter(function(d){return d.fulldateparsed == null})
  console.log('null date',nodate)
  const colLength = 10,
  size = 25,
  marginLeft = 0,
  marginRight = 0,
  marginTop = 50,
  rowLength = data.length / colLength,
  width=rowLength*size,
  height=window.innerHeight/2

  const scale = d3.scaleLinear()
    .domain([0, colLength])
    .range([0, size * colLength])

  const viz = d3.select("#delays")
  	.append("svg")
    .attr("id","grid")
  	.attr("width",width+marginLeft+marginRight)
  	.attr("height",height+marginTop)

  const trains = ['A','B','C','D','E','F','G','J','L','M','N','Q','R','S','W','Z','1','2','3','4','5','6','7']
  // const oldcolors = ['blue','orange','blue','orange','blue','orange','limegreen','brown','gray','brown','yellow','yellow','yellow','lightgray','yellow','brown','red','red','red','green','green','green','purple']
  const colors = ['#006bf5','#ff6f30','#006bf5','#ff6f30','#006bf5','#ff6f30','#90d050','#994646','#808080','#994646','#ffcc51','#ffcc51','#ffcc51','#bbb','#ffcc51','#994646','#ff252a','#ff252a','#ff252a','#368826','#368826','#368826','#581b7c','#000']
  //blue #006bf5
  //orange #ff6f30
  //lime green #90d050
  //brown #994646
  //gray #808080
  //yellow #ffcc51
  //lightgray #bbb
  //green #368826
  //purple #581b7c
  //red #ff252a

  const grid = viz.append('g').attr('transform','translate('+marginLeft+','+marginTop+')')

  const slot = grid.selectAll('.square')
    .data(data)
    .enter().append("g")
    .attr('class','slot')

  const circle = slot
    .append('circle')
    .attr('cx', (d, i) => {
      const n = Math.floor(i / colLength)
      return scale(n) + size/2
    })
    .attr('cy', (d, i) => {
      const n = i % colLength
      return scale(n) + size/2
    })
    .attr('r', size/2)
    .attr('fill', function(d){
      const whichtrain = trains.indexOf(d.trainone)
      return colors[whichtrain]
    })
    .attr('class','circle')
    .attr('opacity',1)
    .attr('stroke','#fff')
    .attr('stroke-width',1)

    slot
      .append('text')
      .attr('fill','#fff')
      .attr('font-size',12)
      .attr('dx', (d, i) => {
        const n = Math.floor(i / colLength)
        return scale(n) + (size/2) - 3.5
      })
      .attr('dy', (d, i) => {
        const n = i % colLength
        return scale(n) + (size/2) + 4
      })
      .attr('cursor','default')
      .text(function(d){return d.trainone})

    slot
      .on("mouseover", function(d) {
        d3.selectAll('.slot').attr('opacity',0.2)
        d3.select(this).attr('opacity',1)
        let tooltip_str = ''
        if(d.minutes.length == 1){
          tooltip_str = d.date + ', ' + d.hours + ':0' + d.minutes + d.ampm + '<br/>' + d.train + ' train<br/>' + d.cause + '<br/>' + d.message
        }else{
          tooltip_str = d.date + ', ' + d.hours + ':' + d.minutes + d.ampm + '<br/>' + d.train + ' train<br/>' + d.cause + '<br/>' + d.message
        }
        tooltip.html(tooltip_str)
          .style("visibility", "visible");
      })
      .on("mousemove", function(d) {
        tooltip.style("top", event.pageY  + 8 + "px")
        // tooltip.style("top", event.pageY - (tooltip.node().clientHeight + 5) + "px")
            .style("left", event.pageX - (tooltip.node().clientWidth / 2.0) + "px");
      })
      .on("mouseout", function(d) {
        d3.selectAll('.slot').attr('opacity',1)
        tooltip.style("visibility", "hidden");
      })

    const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip");

    //change this to grab the causes list from the data
    let causes = ["Assault", "Brake Activation", "Bridge", "Broken Rail", "Broken Window", "Congestion", "Customer Altercation", "Customer Will Not Allow The Doors To Close", "Debris On Track", "Disruptive Passenger", "Disruptive People Who Broke Into The Conductor's Cab", "Door Problems", "Earlier Incident", "EMS Help", "FDNY", "Gap In Service", "Incident", "Inclement Weather", "Injured Customer", "Injured Person", "Investigation", "Late Arriving Trains", "Loss Of Power", "Lost Child", "Maintenance", "Malfunctioning Horn", "Mechanical Problems", "Medical Problems", "Network Communications Issue", "NYPD Activity", "NYPD Investigation", "Person Fell On Tracks", "Person Holding Doors", "Person On Tracks", "Person Riding Between Train Cars", "Person Stuck By A Train", "Police Activity", "Police Assistance", "Raccoon", "Rail Condition", "Rail Repair", "Rail Replacement", "Removed A Train From Service", "Residual Delays", "Shared Track", "Shopping Cart That Fell Onto The Tracks", "Shuttle Inspection", "Sick Passenger", "Signal Maintenance", "Signal Malfunction", "Signal Problems", "Signal Repair", "Slippery Rails", "Struck By Train", "Surfing", "Switch Problems", "Track Fire", "Track Geometry Train", "Track Maintenance", "Train Overran Platform", "Train Track Inspection", "Tree Branches", "Unauthorized Person", "Unsanitary Train", "Vandalized Trains", "Wet Leaves", "Work Trains"]

    const select = document.getElementById("cause_filter");
      for(let i = 0; i < causes.length; i++) {
          let opt = causes[i];
          let el = document.createElement("option");
          // if (opt == "A"){
          //   el.selected = 'selected';
          // }
          el.textContent = opt;
          el.value = opt;
          select.appendChild(el);
      }

    d3.select('#cause_filter')
    .on("change", function () {
      // console.log('changed')
      d3.selectAll('rect').attr('opacity',1)
      d3.selectAll('circle').attr('opacity',1)
      selectedCause = $(this).children(':selected').text();
      // console.log('selectedCause',selectedCause)
      d3.selectAll('rect').attr('opacity',function(d){
        if(d.cause == selectedCause ){return 1}
        else{return 0.1}
      })
      d3.selectAll('circle').attr('opacity',function(d){
        if(d.cause == selectedCause ){return 1}
        else{return 0.1}
      })
    })

  })
