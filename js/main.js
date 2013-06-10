var geocoder, lat, lon;

$(function() {
    // Handler for .ready() called.
    geocoder = new google.maps.Geocoder();

    $('#lai-form').submit(function() {
        codeAddress();
        return false;
    });
});

function codeAddress() {
    var address = document.getElementById('address').value;
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            lat = results[0].geometry.location.lat();
            lon = results[0].geometry.location.lng();
            $.ajax({
                dataType: "jsonp",
                url: "http://data.fcc.gov/api/block/find",
                data: { format: "jsonp", latitude: lat, longitude : lon  },
                success: function(data) {
                    var fips = data.Block.FIPS;
                    var blockgroup = fips.substr(0,12);
                    console.log(blockgroup);
                    $.ajax({
                        dataType: "json",
                        url: "http://laiapi-placematters.dotcloud.com/blockgroup/" + blockgroup,
                        success: function(data) {
                            console.log(data);
                        }
                    });
                }
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}



// http://data.fcc.gov/api/block/find?format=json&latitude=28.35975&longitude=-81.421988&showall=true