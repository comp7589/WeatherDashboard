$(document).ready(function () {
    //search button feature
    $("#search-button").on("click", function () {
        var searchTerm = $("#search-value").val();//grab value in input search-value.
        $("#search-value").val("");//empty input field.
        weatherFunction(searchTerm);
        weatherForecast(searchTerm);
    });

    //search button enter key feature. NOT WORKING***
    $("#search-button").keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        // var searchTerm = $("#search-value").val();
        if (keycode === 13) {
            weatherFunction(searchTerm);
            weatherForecast(searchTerm);
        }
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
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=9bbe868aa95e2e05ff8a18fa3fab1fc7&units=imperial",


        }).then(function (data) {
            if (history.indexOf(searchTerm) === -1) {//if index of search value does not exist.
                history.push(searchTerm);//push searchValue to history array.
                localStorage.setItem("history", JSON.stringify(history));//places item pushed into local storage with
                createRow(searchTerm);
            }
            $("#today").empty();// clears out old content

            var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
            var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");


            var card = $("<div>").addClass("card");
            var cardBody = $("<div>").addClass("card-body");
            var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
            var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
            var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " °F");

            var lon = data.coord.lon;
            var lat = data.coord.lat;

            $.ajax({
                type: "GET",
                url: "https://api.openweathermap.org/data/2.5/uvi?appid=9bbe868aa95e2e05ff8a18fa3fab1fc7&lat=" + lat + "&lon=" + lon,


            }).then(function (response) {
                console.log(response);

                var uvColor;
                var uvResponse = response.value;
                var uvIndex = $("<p>").addClass("card-text").text("UV Index: ");
                var btn = $("<span>").addClass("btn btn-sm").text(uvResponse);


                if (uvResponse < 3) {
                    btn.addClass("btn-success");
                } else if (uvResponse < 7) {
                    btn.addClass("btn-warning");
                } else {
                    btn.addClass("btn-danger");
                }

                cardBody.append(uvIndex);
                $("#today .card-body").append(uvIndex.append(btn));

            });

            // merge and add to page
            title.append(img);
            cardBody.append(title, temp, humid, wind);
            card.append(cardBody);
            $("#today").append(card);
            console.log(data);
        });
    }
    // function weatherForecast(searchTerm) 1) drop similar AJAX as above. 2) append to #forecast 3) in #forecast add row in class & add plain text "5 day forecast: " etc.
    //Loop to create a new card for 5 days. Pull data image from search.

    function weatherForecast(searchTerm) {
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchTerm + "&appid=9bbe868aa95e2e05ff8a18fa3fab1fc7&units=imperial",

        }).then(function (data) {
            console.log(data);
            $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");//do I need the .append or not? Only styled it out of the way.

            for (var i = 0; i < data.list.length; i++) {

                if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {

                    var titleFive = $("<h3>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
                    var imgFive = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");

                    var colFive = $("<div>").addClass("col-md-2");//newly added to test issue.
                    var cardFive = $("<div>").addClass("card bg-primary text-white");
                    var cardBodyFive = $("<div>").addClass("card-body p-2");
                    var humidFive = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
                    var tempFive = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp + " °F");

                    //merge together and put on page
                    colFive.append(cardFive.append(cardBodyFive.append(titleFive, imgFive, tempFive, humidFive)));
                    //append card to column, body to card, and other elements to body
                    $("#forecast .row").append(colFive);

                    // //OLD WAY: merge to div ---remove colFive to make right.
                    // titleFive.append(imgFive);
                    // cardBodyFive.append(titleFive, tempFive, humidFive);
                    // cardFive.append(cardBodyFive);
                    // $(".card-deck").append(cardFive);
                }
            }
        });
    }

});
