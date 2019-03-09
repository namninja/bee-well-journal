const SERVERBASE = "//evening-mesa-72855.herokuapp.com/";

const LOCAL = 'http://localhost:8080/'

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

function getMorningMood(data) {
  console.log('getMorningMood ran')

  if (data.length > 30) {
    for (let i = data.length - 30; i < data.length; i++) {
      morning.y.push(data[i].morningRating)
    }
    for (q = 1; q <= 30; q++) {
      morning.x.push(q)
    }
  } else {
    for (let i = 0; i < data.length; i++) {
      morning.y.push(data[i].morningRating)
      morning.x.push(i + 1)
    }
  }
  console.log(morning)
}

function getEveningMood(data) {
  console.log('getEveningMood ran')
  console.log(data.length)

  if (data.length > 30) {
    for (let i = data.length - 30; i < data.length; i++) {
      evening.y.push(data[i].eveningRating)
    }
    for (q = 1; q <= 30; q++) {
      evening.x.push(q)
    }
  } else {
    for (let i = 0; i < data.length; i++) {
      evening.y.push(data[i].eveningRating)
      evening.x.push(i + 1)
    }
  }
  console.log(evening)
}


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
    .then(responseJson => {
      getMorningMood(responseJson)
      getEveningMood(responseJson)
    })
    .then(() => {
      var data = [morning, evening];
      var layout = {
        showlegend: true,
        legend: { "orientation": "h" }
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
function deleteJournal(journalId) {
  console.log("Deleting journal `" + journalId + "`");
  const url = LOCAL + "delete-journal/" + journalId
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