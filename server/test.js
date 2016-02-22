function getData() {
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			console.log(xhttp.responseText);
		}
	};

	xhttp.open("GET", "http://127.0.0.1:8081/realtimedata?test=2", true);
	xhttp.send();
}

getData();