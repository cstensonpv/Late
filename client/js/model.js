function getData() {
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			console.log(xhttp.responseText);
		}
	};

	xhttp.open("GET", "http://api.sl.se/api2/realtimedepartures.xml?key=a759eafc14934dd681cb2f542e99330b&siteid=9192&timewindow=5", true);
	xhttp.send();
}

getData();