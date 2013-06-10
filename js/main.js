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
                            var keyIndex;
                            var div, hh;
                            var hh_types = { "a" : "Regional Typical",
                            "b" : "Regional Moderate",
                            "c" : "Core Typical",
                            "d" : "Single-Income Family",
                            "e" : "Low Income",
                            "f" : "Moderate Income",
                            "g" : "Single Person Very Low Income",
                            "h" : "One-Worker Family Very Low Income",
                            "i" : "Single Professional",
                            "j" : "Single Worker",
                            "k" : "Dual-Income Family",
                            "l" : "Retirees"};
                            $.each(data, function(k,v) {
                                keyIndex = k.split("_");
                                if (keyIndex[0] == 'hh') {
                                    if(hh != keyIndex[1]) {
                                        hh = keyIndex[1];
                                        $('#data').append($('<div class="panel callout"/>').html(hh_types[hh] + " Household Type"));
                                    }
                                    div = $('<div class="panel large-12"/>').html(keyIndex[2] + ": " + Math.round(v*100)/100);
                                } else {
                                    div = $('<div class="panel large-12"/>').html(k + ": " + v);
                                }
                                $('#data').append(div);
                            });
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