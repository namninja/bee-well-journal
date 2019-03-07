$(function () {
  console.log('App loaded! Waiting for submit!');
  getMoodData();



function getMorningMood(data) {
  console.log('getMorningMood ran')
  if (data.journals.length > 30) {
    for(let i = data.journals.length-30; i >= 0 ; i++) {
      morningMood.push(data.journals[i].morningRating)
    }
  } else {
    for(let i = 0; i < data.journals.length ; i++) {
      morning.y.push(data.journals[i].morningRating)
      morning.x.push(i+1)
    }
  }
}

function getEveningMood(data) {
  console.log('getEveningMood ran')
  if (data.journals.length > 30) {
    for(let i = data.journals.length-30; i >= 0 ; i++) {
      eveningMood.push(data.journals[i].eveningRating)
    }
  } else {
    for(let i = 0; i < data.journals.length ; i++) {
      evening.y.push(data.journals[i].eveningRating)
      evening.x.push(i+1)
    }
  }
}



var morning = {
    x: [0],
    y: [0],
    type: 'scatter',
    name: 'morning mood'
  };
  
  var evening = {
    x: [0],
    y: [0],
    type: 'scatter',
    name: 'evening mood'
  };
  
 
  console.log(morning)
  console.log(evening)

  var data = [morning, evening];
  var layout = {
		showlegend: true,
		legend: {"orientation": "h"}
	    };
  
  Plotly.newPlot('plotly', data, layout, {showSendToCloud: true});

  
  function getMoodData() {
      console.log('getMoodData ran')
      const url = 'http://localhost:8080/mood-data'
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

  
    
   
});