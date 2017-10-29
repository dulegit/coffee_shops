(function($){

"use strict";
var ajaxData;
var venueId;

// function for sorting found coffee shops
function sortPlaces(elem) {
  var itemContent = $("#coffeePlaces");
  var item = $(".__items", itemContent);

  if ($(elem).attr("data-sort") === "distance") {
    item.sort(function(a,b){
      var keyA = $(a).attr("data-distance");
      var keyB = $(b).attr("data-distance");
      return keyA - keyB;
    });
  } else {
    item.sort(function(a,b){
      var keyA = $(a).attr("data-expensive");
      var keyB = $(b).attr("data-expensive");
      return keyB - keyA;
    });
  }
  $.each(item, function(index, row){
    itemContent.append(row);
  });
}

// Try HTML5 geolocation.
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    // Get curent position of user
    $("#latitude").val(position.coords.latitude);
    $("#longitude").val(position.coords.longitude);



    function initPlaces() {
      var place = this;

      place.url = "https://api.foursquare.com/v2/venues/search";
      place.url_exp = "https://api.foursquare.com/v2/venues/explore";
      place.url_venue = "https://api.foursquare.com/v2/venues";
      place.client_id = "WFIS5VTEFPL0TGN00QVMVDM5MTJI3J4MTO4OTHDN4OTBKLFE";
      place.client_secret = "21RCFFCECLEKPUBE2BP0RPID4DP2XRCPY5DWGPZKMJ2WB0DJ";
      place.version = "20171028";
      place.latLon = "44.809,20.514";
      place.radius = "1000"
      place.categories = "4bf58dd8d48988d1e0931735,5665c7b9498e7d8a4f2c0f06";
      place.limit = "10";

    }

    ajaxData = new initPlaces();


    var callFS = function() {
      var lat = $("#latitude").val();
      var lng = $("#longitude").val();

      ajaxData.latLon = lat+","+lng;

      $.ajax({
        // GOOD SEARCH
        //url: ajaxData.url+'?v='+ajaxData.version+'&ll='+ajaxData.latLon+'&radius='+ajaxData.radius+'&categoryId='+ajaxData.categories+'&limit='+ajaxData.limit+'&client_id='+ajaxData.client_id+'&client_secret='+ajaxData.client_secret,
        // TEST SEARCH
        //url: ajaxData.url+'?v='+ajaxData.version+'&ll=44.816978,20.461561&radius='+ajaxData.radius+'&categoryId='+ajaxData.categories+'&limit='+ajaxData.limit+'&client_id='+ajaxData.client_id+'&client_secret='+ajaxData.client_secret,
        // TEST EXPLORE
        //url: ajaxData.url_exp+'?v='+ajaxData.version+'&ll=44.816978,20.461561&radius='+ajaxData.radius+'&section=coffee&venuePhotos=1&openNow=1&limit='+ajaxData.limit+'&client_id='+ajaxData.client_id+'&client_secret='+ajaxData.client_secret,
        // GOOD EXPLORE
        url: ajaxData.url_exp+'?v='+ajaxData.version+'&ll='+ajaxData.latLon+'&radius='+ajaxData.radius+'&section=coffee&venuePhotos=1&openNow=1&limit='+ajaxData.limit+'&client_id='+ajaxData.client_id+'&client_secret='+ajaxData.client_secret,
        method: 'GET',
        success: function(data) {
          console.log(data.response);

          // EXPLORE RESULTS

          $.each(data.response.groups[0].items, function(){
            var placeName = this.venue.name;
            var placeDistance = this.venue.location.distance;
            var venueId = this.venue.id;
            if (this.venue.price) {
              var placeExpensiveness = this.venue.price.message;
              var placePriceTier = this.venue.price.tier;
              var placePriceTierVal = this.venue.price.tier;
            } else {
              var placeExpensiveness = "No-Rated";
              var placePriceTier = "No-Rated";
              var placePriceTierVal = 0;
            }
            console.log(this);
            //console.log(this.id);

            if (this.venue.photos.count === 0) {
              var placeImg = "images/card-default.jpg";
            } else {
              var imgPrefix = this.venue.photos.groups[0].items[0].prefix;
              var imgSufix = this.venue.photos.groups[0].items[0].suffix;
              var placeImg = imgPrefix+"550x365"+imgSufix;
            }

            $("#coffeePlaces").append(
            "<div id="+venueId+" class='card __items' data-distance="+placeDistance+" data-expensive="+placePriceTierVal+">"+
              "<img class='card-img-top' src="+placeImg+" alt="+placeName+">"+
              "<div class='card-body d-flex flex-column justify-content-between'>"+
                "<h4 class='card-title'>"+placeName+"</h4>"+
                "<p class='card-text'>Distance: <span class='font-italic font-weight-bold'>"+placeDistance+"m</span><br>Expensiveness: <span style='text-decoration:underline'>"+placeExpensiveness+"</span></p>"+
                "<a href='details.html#"+venueId+"#"+placeDistance+"' target='_blank' class='newClass btn btn-primary'>View Place</a>"+
              "</div>"+
            "</div>"
            );

          });

        },
        error: function(data) {
          console.log(data);
        }
      });

    };
    callFS();

    // Sort Items on radio buttons click
    $(".details-sort input").on("change", function(){
      sortPlaces($(this));
    });

    // trigger click first time on load to sort by Distance by default
    $("#sort-distance").trigger("click");


  }, function() {
    // Handle error if user block geolocation
    $("#errorModal").modal("show");
    return false;
  });
} else {
  // Browser doesn't support Geolocation
  console.log("not supported");
}

})(jQuery);
