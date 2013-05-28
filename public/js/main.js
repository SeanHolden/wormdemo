$(function() {
  bindVotingButtons();
  getTimeline();
});

var timelineData = [];
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
  $.getJSON('votes.json', function(data) {
    timelineData.push([Date.now(), parseInt(data.votes)]);
    timelineData = timelineData.splice(timelineData.length - 10);
    renderTimelineResults(timelineData);
  });
  
  setTimeout(getTimeline, refreshInterval);
}

function renderTimelineResults(plotData) {
  var axisLimit = getAxisLimit(plotData);

  $.plot($("#timeline"), [plotData], { 
    lines :{ show : true, fill : true },
    xaxis : { show : false },
    yaxis : { show : true, min : -axisLimit, max : axisLimit },
    grid : { borderWidth : 0 } });
}

function getAxisLimit(plotData) {
  var axisLimit = 0;
  for(var i=0; i<plotData.length; i++) {
    var absoluteValue = Math.abs(plotData[i][1]);
    if (absoluteValue > axisLimit) {
      axisLimit = absoluteValue;
    }
  }
  return axisLimit + 10;
}
