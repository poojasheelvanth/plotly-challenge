function buildMetadata(sample) {
  let url ="/metadata/"+sample;
    // Use `d3.json` to fetch the metadata for a sample
    d3.json(url).then(function(data) {
    // Use d3 to select the panel with id of `#sample-metadata`
    var row = d3.select("#sample-metadata");
      row.html("");  
     
      Object.entries(data).forEach(([key, value]) => {
      var newline = row.append("p");
      newline.text(`${key}: ${value}`);
      });
      console.log(data.WFREQ);
    // Gauge chart
    var gaugedata = [{domain: {x: [0, 1], y: [0, 1]}, value: data.WFREQ, title: {text: "Belly Button Washing Frequency"},
    type: "indicator", mode: "gauge+number", gauge:
    {axis: {range: [null, 9]}, steps: [{range: [0, 1], color: "GreenYellow"},
    {range: [1,2], color: "Chartreuse"},{range: [2,3], color: "LawnGreen"},{range: [3,4], color: "Lime"},
    {range: [4,5], color: "PaleGreen"}, {range: [5,6], color: "LightGreen"},{range: [6,7], color: "MediumSpringGreen"},
    {range: [7,8], color: "SpringGreen"}, {range: [8,9], color: "MediumSeaGreen"}] }}];

    var layout = {width: 600, height: 500, margin: {t: 0, b: 0}};
    Plotly.newPlot("gauge",gaugedata,layout); 
    });
   
}
function buildCharts(sample) {

  let url="/samples/"+sample;
  d3.json(url).then(function(data){
    

    

    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    values = data.sample_values.slice(0,10)
    labels = data.otu_ids.slice(0,10);
    hoverlabels =data.otu_labels.slice(0,10);
    
    console.log(hoverlabels)
  // @TODO: Build a Pie Chart
  var pie ={
    "labels": labels,
    "values": values,
    "type": "pie",
    hoverinfo:hoverlabels,
  }
  datapie =[pie];
  Plotly.newPlot("pie", datapie)


  // @TODO: Build a Bubble Chart using the sample data
  var bubble = {
    x: data.otu_ids,
    y: data.sample_values,
    text: data.otu_labels,
    mode: 'markers',
    marker: {
      color:data.otu_ids,
      size: data.sample_values
    }
  };
  console.log(bubble);
  var databubble = [bubble];
  console.log(databubble);
  var layout = {
    xaxis:{title: 'OTU ID'},
    showlegend: false    
  };
  console.log(layout)
  Plotly.newPlot("bubble", databubble, layout);
   
    
  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
      // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  }

// Initialize the dashboard
init();
