var loadJQuery = function () {
	var jquery_script = document.createElement('script');
	var header = document.getElementsByTagName('head')[0];
	jquery_script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js";
	jquery_script.type = "text/javascript";
	jquery_script.onload = setDatePicker();
	header.appendChild(jquery_script);
};

var setDatePicker = function () {
	$(function () {
		$('.date-picker').datepicker();
	});
	
};

window.onload = setDatePicker;