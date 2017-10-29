(function($){
  var venueId = window.location.href.split("#")[1];
  var venueDistance = window.location.href.split("#")[2];

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

  var ajaxData = new initPlaces();


  $.ajax({
    url: ajaxData.url_venue+'/'+venueId+'?v='+ajaxData.version+'&client_id='+ajaxData.client_id+'&client_secret='+ajaxData.client_secret,
    method: 'GET',
    success: function(data) {
      // console.log(data);
      $(".shop-name").text(data.response.venue.name);
      $(".shop-range").text(data.response.venue.price.tier);
      $(".shop-distance").text(venueDistance);
      if (data.response.venue.tips.count !== 0) {
        var tipsCoffee = data.response.venue.tips.groups[0].items.slice(0,30);
        var regCoffee = /coffe?|kafa?|kafu?/i;
        var pulledTextCoffee = "";
        $.each(tipsCoffee, function(){
          if(regCoffee.test(this.text)) {
            return pulledTextCoffee = this.text;
          }
        });
        $(".shop-tips p").text(pulledTextCoffee);
      } else {
        $(".shop-tips p").text("There is not review of this coffe shop");
      }

      // another ajax call to pull images for current venue
      $.ajax({
        url: ajaxData.url_venue+'/'+venueId+"/photos"+"?v="+ajaxData.version+"&client_id="+ajaxData.client_id+"&client_secret="+ajaxData.client_secret,
        method: 'GET',
        success: function(data){
          //console.log(data);
          var imgItems = data.response.photos.items.slice(0,10);
          if (data.response.photos.count !== 0) {
            $.each(imgItems, function(){

              console.log(this.prefix);
              $(".details-slider-for").append(
                "<div>"+
                  "<img src="+this.prefix+"1200x600"+this.suffix+">"+
                "</div>"
              );
              $(".details-slider-nav").append(
                "<div>"+
                  "<img src="+this.prefix+"300x300"+this.suffix+">"+
                "</div>"
              );

            });
          }
          // initialize slick slider for details page
          $('.details-slider-for').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            asNavFor: '.details-slider-nav'
          });
          $('.details-slider-nav').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            asNavFor: '.details-slider-for',
            dots: true,
            centerMode: true,
            focusOnSelect: true
          });
        },
        error: function(data){
          console.log(data);
        }
      });

    },
    error: function(data) {
      console.log(data);
    }
  });


})(jQuery);
