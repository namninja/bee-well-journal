'use strict'

// initialize our Global Variables
const SERVERBASE = "//gentle-chamber-86652.herokuapp.com/";
const LOCAL = 'http://localhost:8080/'

// plotly data variables
const morning = {
  x: [],
  y: [],
  type: 'scatter',
  name: 'morning mood'
};

const evening = {
  x: [],
  y: [],
  type: 'scatter',
  name: 'evening mood'
};

// This function extracts morning mood data and pushes into our plotly array
function getMorningMood(data) {
  console.log('getMorningMood ran')
// there are more than 30 entries, it extracts the most recent 30
  if (data.length > 30) {
    for (let i = data.length - 30; i < data.length; i++) {
      morning.y.push(data[i].morningRating)
      morning.x.push(data[i].created)
    }
  // if there are less than 30, it extracts all of the data
  } else {
    for (let i = 0; i < data.length; i++) {
      morning.y.push(data[i].morningRating)
      morning.x.push(data[i].created)
    }
  }
}
// This function extracts evening mood data and pushes into our plotly array
function getEveningMood(data) {
  console.log('getEveningMood ran')
  console.log(data.length)
// there are more than 30 entries, it extracts the most recent 30
  if (data.length > 30) {
    for (let i = data.length - 30; i < data.length; i++) {
      evening.y.push(data[i].eveningRating)
      evening.x.push(data[i].created)
    }
// if there are less than 30, it extracts all of the data
  } else {
    for (let i = 0; i < data.length; i++) {
      evening.y.push(data[i].eveningRating)
      evening.x.push(data[i].created)
    }
  }
  console.log(evening)
}

// This function makes a fetch call to extract the mood data from the server
function getMoodData() {
  console.log('getMoodData ran')
  const url = LOCAL + 'mood-data'
  fetch(url)
    .then(response => {
      if (response.ok) {
        console.log('ok')
        return response.json();
      }
      //if reponse is not ok,then throw an error
      throw new Error(response.statusText);
    })
    //we use promises to make sure our data is fully available before processing.
    .then(responseJson => {
      getMorningMood(responseJson)
      getEveningMood(responseJson)
    })
    //Once the data is handled and varaiables are ready, we process the data for visualization.
    .then(() => {
      var data = [morning, evening];
      var layout = {
        title: {
          text:'30 Day Mood Meter',
          font: {
            family: 'sans-serif',
            size: 24
          },
          xref: 'paper',
         
        },
        showlegend: true,
        legend: { "orientation": "v" }
      };
      Plotly.newPlot('plotly', data, layout, {responsive: true});
    })
    //if reponse is not ok, then the error we threw will be passed as a parameter in the displayError function and rendered in DOM
    .catch(err => {
      displayError(err.message);
    });
}

//diplays error to DOM if there are no lyrics. The function takes an error as a parameter
//but it is not used since failure of API is most likely due to no lyrics found.
function displayError(error) {
  console.log('displayError ran');
  $('#plotly').html(`<h4 role="alert" class="error">Something went wrong: ${error}</h4>`)
}

// We create delete on the front end, because the majority of our CRUD operations are submitted by forms
// which only provide GET and POST operation.  
function deleteJournal(journalId) {
  console.log("Deleting journal `" + journalId + "`");
  const url = LOCAL + "delete-journal/" + journalId
  // fetch data from the server with the Delete method
  fetch(url, {
    method: "DELETE",
  })
    .then(response => {
      if (response.ok) {
        console.log('Journal ' + journalId + ' successfully deleted')
        window.open('/dashboard', '_top')
      }
      //if reponse is not ok,then throw an error
      throw new Error(response.statusText);
    })
    //if reponse is not ok, then the error we threw will be passed as a parameter in the displayError function and rendered in DOM
    .catch(err => {
      console.log(err.message);
    });
}

// This function handles the click event for Deleting Journals
function handleJournalDelete() {
  $(".js-delete").on("click", function (e) {
    e.preventDefault();
    deleteJournal(
      $(e.currentTarget)
        .attr("data-key")
    );
  });
}

$(function () {
  console.log('Ready!');
  getMoodData();
  handleJournalDelete();
});