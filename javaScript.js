$(document).ready(function () {
    //search button feature
    $("#search-button").on("click", function () {
        var searchTerm = $("#search-value").val();//grab value in input search-value.
        $("#search-value").val("");//empty input field.
        weatherFunction(searchTerm);//call weatherFunction with searchTerm parameter.

    });

    var history = JSON.parse(localStorage.getItem("history")) || [];//grab item from local storage, if any.

    if (history.length > 0) {//sets history array search to correct length.
        weatherFunction(history[history.length - 1]);
    }
    for (var i = 0; i < history.length; i++) {// makes a row for each element in history array(searchTerms).
        createRow(history[i]);
    }

    function createRow(text) {
        var listItem = $("<li>").addClass("list-group-item").text(text);
        $(".history").append(listItem);
    }
    //
    $(".history").on("click", "li", function () {
        weatherFunction($(this).text());
    });

    function weatherFunction(searchTerm) {
        $.ajax({
            type: "GET",
            url: "http://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=9bbe868aa95e2e05ff8a18fa3fab1fc7&units=imperial",


        }).then(function (data) {
            if (history.indexOf(searchTerm) === -1) {//if index of search value does not exist.
                history.push(searchTerm);//push searchValue to history array.
                localStorage.setItem("history", JSON.stringify(history));//places item pushed into local storage with
                createRow(searchTerm);
            }
            // $("#today").empty();// clears out old content/prevents infinite loop.

            var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
            var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");


            var card = $("<div>").addClass("card");
            var cardBody = $("<div>").addClass("card-body");
            var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
            var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
            var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " °F");
            var uvIndex;

            var lon = data.coord.lon;
            var lat = data.coord.lat;

            $.ajax({
                url: "http://api.openweathermap.org/data/2.5/uvi?appid=9bbe868aa95e2e05ff8a18fa3fab1fc7&lat=" + lat + "&lon=" + lon,
                method: "GET",

            }).then(function (response) {
                console.log(response);
                uvIndex = $("<p>").addClass("card-text").text("UV Index: " + response.value);
                console.log(response.value);
                // var uvColor = "";

                // if (uvIndex < 3) {
                //     uvColor = "green";
                // } else if (uvIndex < 6) {
                //     uvColor = "yellow";
                // } else if (uvIndex < 8) {
                //     uvColor = "orange;"
                // } else if (uvIndex < 11) {
                //     uvColor = "red";
                // } else {
                //     uvColor = "violet";
                // }
                cardBody.append(uvIndex);
            });

            // merge and add to page
            title.append(img);
            cardBody.append(title, temp, humid, wind);
            card.append(cardBody);
            $("#today").append(card);
            console.log(data);
            //weatherFunction(searchTerm); CAUSE OF INFINTE LOOP TO REFRESH CARD***
        });
    }
    // function weather5Day(searchTerm) 1) drop similar AJAX as above. 2) append to #forecast 3) in #forecast add row in class & add plain text "5 day forecast: " etc.
    //Loop to create a new card for 5 days. Pull data image from search.

})



