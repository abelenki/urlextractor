var SHORTENED_URL = "//goo.gl/";
var MARKER_CLASS = "googl_trigger";
var API_KEY = "key=AIzaSyCLUqYtgHq8IyB9wQepNtCUE3Af4L_2qyA&";
API_KEY = "";
var SERVICE_API = "https://www.googleapis.com/urlshortener/v1/url?" + API_KEY + "projection=FULL&shortUrl="; // ANALYTICS_CLICKS, ANALYTICS_TOP_STRINGS, FULL
var INDICATOR_CLASS = "triggerHighlight";

var getContent = function getContent(anchor, content){
	var href = $(anchor)[0].href;
	var id = href;
	var api = "";
	var statsUrl = "";
	var output = "Fetching...";

	id = href;
	id = id.substring(id.indexOf(SHORTENED_URL) + SHORTENED_URL.length);
	if(id.indexOf("/") > -1){
		id = id.substring(0, id.indexOf("/"));
	}
	api = SERVICE_API + "http://goo.gl/" + id;
	statsUrl = "http://goo.gl/#analytics/goo.gl/" + id + "/all_time";

	$.ajax({
		url: api,
		async: false,
		data: {},
		success: function(data){
			output = 
			"<span class=\"fullstats\"><a href=\"" + statsUrl + "\">full stats</a></span>" + 
			"<div class=\"title\">Stats Extraction for: " + data.id + "</div>" + 
			"<a href=\"" + data.longUrl + "\">" + data.longUrl + "</a><br />" +
			"Created: " + new Date(data.created) + "&nbsp;" +
			"<hr />" +
			"<span class=\"heading\">Clicks: " + data.analytics.allTime.shortUrlClicks + "</span><br />" +
			"day:" + data.analytics.day.shortUrlClicks + "&nbsp;" +
			"week:" + data.analytics.week.shortUrlClicks + "&nbsp;" +
			"month:" + data.analytics.month.shortUrlClicks + "&nbsp;" + 
			"<hr />" +
			"Most popular:<br />" +
			"" + data.analytics.allTime.referrers[0].id + " (" + data.analytics.allTime.referrers[0].count + ") from " + 
			"" + data.analytics.allTime.countries[0].id + " (" + data.analytics.allTime.countries[0].count + ")" + 
			"<br />" +
			"" + data.analytics.allTime.browsers[0].id + " (" + data.analytics.allTime.browsers[0].count + ") on " + 
			"" + data.analytics.allTime.platforms[0].id + " (" + data.analytics.allTime.platforms[0].count + ")" + 
			"";
//			content.html(output);

		},
		dataType: 'json'
	});

	return output;
/*
	$.get(api, {}, function(data){
		var output = '';

		output = data.longUrl + "<center>----------</center>Clicks: " + data.analytics.allTime.shortUrlClicks + " [month: " + data.analytics.month.shortUrlClicks + " week: " + data.analytics.week.shortUrlClicks + "]";
		content.html(output);
	}, "json");

	return "Fetching...";
*/
};

/*
var triggerExpand = function expand(link){
	var href = $(link)[0].href;
	var api = SERVICE_API + href; // ANALYTICS_TOP_STRINGS, FULL
	$.get(api, {}, function(data){
		var output = '';

console.log("Full URL: " + data.longUrl);
console.log("All time: " + data.analytics.allTime.shortUrlClicks);
console.log("Past Month: " + data.analytics.month.shortUrlClicks);
console.log("Past Week: " + data.analytics.week.shortUrlClicks);

		output = "Clicks: " + data.analytics.allTime.shortUrlClicks + " [month: " + data.analytics.month.shortUrlClicks + "  week: " + data.analytics.week.shortUrlClicks + "]";

		$(link)[0].title = output;
//		$(link).addClass(INDICATOR_CLASS);
		var speechBubble = $.akita.show({element: $(link)[0], content: output});
	}, "json");
};


var clearExpand = function expand(link){
	var speechBubble = $.akita.hide({element: $(link)[0]});
//	$(link).removeClass(INDICATOR_CLASS);
};
*/

$(function(){
	var valid = false;

	// Add the marker class
	$('a').each(function(){
		var $this = $(this);
		var $href = $this[0].href;
		if($href.match(SHORTENED_URL)){
			$this.addClass(MARKER_CLASS);
			valid = true;
		}
	});

	// We found a match, so notify the background page to show the icon.
	if(valid) chrome.extension.sendRequest({}, function(response) {});

	// bind the popup! (bootstrap)
//	$('a.' + MARKER_CLASS).popover({html: true, trigger: 'hover', content: 'getContent'});

	// bind the popup! (tiptip)
	$('a.' + MARKER_CLASS).tipTip({keepAlive: true, maxWidth: 'auto', defaultPosition: 'top', content: getContent});

/*
	// bind the popup! (akita)
	$('a.' + MARKER_CLASS).hover(
		function() { triggerExpand($(this)); },
		function() { clearExpand($(this)); }
	);
*/
});
