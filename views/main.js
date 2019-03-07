function getMorningMood() {
  console.log('getMorningMood ran')
  data = getMoodData()
  console.log(data)
}


var morning = {
    x: [1, 2, 3, 4, ],
    y: [10, 15, 13, 17],
    type: 'scatter'
  };
  
  var evening = {
    x: [1, 2, 3, 4],
    y: [16, 5, 11, 9],
    type: 'scatter'
  };
  
  var data = [morning, evening];
  
  Plotly.newPlot('plotly', data);

  
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
   
    //if reponse is not ok, then the error we threw will be passed as a parameter in the displayError function and rendered in DOM
    .catch(err => {
        displayError(err.message);
    });
}

//diplays error to DOM if there are no lyrics. The function takes an error as a parameter
//but it is not used since failure of API is most likely due to no lyrics found.
function displayError() {
    console.log('displayError ran');
    $('#plotly').html(`<h4 role="alert" class="error">Something went wrong: ${error}</h4>`)
}

  $(function () {
    console.log('App loaded! Waiting for submit!');
    getMorningMood();
});