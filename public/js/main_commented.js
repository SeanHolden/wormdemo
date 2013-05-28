$(function() {
  bindVotingButtons();
  getTimeline();
});

var timelineData = [];
// Set worm refresh interval to 1 second.
var refreshInterval = 1000;

function bindVotingButtons() {
  $('#upvote').click(voteUpPressed);
  $('#downvote').click(voteDownPressed);
}

function voteUpPressed() {
  $.post('upvote', function(data){
  });
}

function voteDownPressed() {
  $.post('downvote', function(data){
  });
}

function getTimeline() {
  // get json from votes.json and send it into function as 'data'
  $.getJSON('votes.json', function(data) {
    // Add timestamped number of votes to array, e.g.:[ 1369237348955, 3 ]
    timelineData.push([Date.now(), parseInt(data.votes)]);
    // Chop off the oldest 10 values of the array
    timelineData = timelineData.splice(timelineData.length - 10);
    // Send array to renderTimelineResults function
    renderTimelineResults(timelineData);
  });
  
  // Set function to run again in 1 second (effectively runs on repeat)
  setTimeout(getTimeline, refreshInterval);
}

function renderTimelineResults(plotData) {
  
  // axisLimit is the sum of votes + 10 (that is what getAxisLimit will return)
  var axisLimit = getAxisLimit(plotData);

  $.plot($("#timeline"), [plotData], { 
    lines :{ show : true, fill : true },
    // Don't display timestamps as x axis values (looks ugly)
    xaxis : { show : false },
    // Y axis is the number of votes. minimum is negative amount of maximum.
    yaxis : { show : true, min : -axisLimit, max : axisLimit },
    // Turn border off
    grid : { borderWidth : 0 } });
}

// plotData is an array of arrays. Taken from getTimeline function.
function getAxisLimit(plotData) {
  var axisLimit = 0;
  // for items in plotData
  for(var i=0; i<plotData.length; i++) {
    // absoluteValue = number of votes for this item, removing negativity and converted to an integer
    var absoluteValue = Math.abs(plotData[i][1]);
    // if the number of votes is > axisLimit (default is 0) axisLimit is now number of votes
    if (absoluteValue > axisLimit) {
      axisLimit = absoluteValue;
    }
  }
  // returned value is sum of votes plus 10
  return axisLimit + 10;
}
