function getData() {
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			console.log(xhttp.responseText);
		}
	};

	xhttp.open("GET", "http://localhost:3000/delaydata", true);
	xhttp.send();
}

$.ajax({
	url: "http://localhost:3000/delaydata",
	type: "GET",
	dataType: "jsonp",
	success: function(result){
       console.log(result);
	},
	error: function(xhr, status, error) {
		console.log(error);
	}
});

// getData();