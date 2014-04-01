(function(guide,$,undefined) {
	
	guide.init = function() {
	
		// CSS top menu bar
		$("h1, #logo, #loadData").wrapAll( "<div id='topbar' />");
		$("#logo").html($("<div id='logo2'><img src='./img/tvguide_logo_tat.gif' alt='logo' /></div>"));
		$("#logo").addClass("logo");
		
		// Bootstrap
		$("#loadData").addClass("btn btn-success btn-lg");
		$("#upcomingEpisodes, #interestingShows").wrapAll( "<div class='allcontent' />").wrapAll( "<div class='container-fluid' />").wrapAll( "<div class='row' />");
		$("#upcomingEpisodes").wrap("<div class='col-lg-10' />");
		$("#interestingShows").wrap("<div class='col-lg-2' />");
		
		// The main button - load the data
		$("#loadData").on("click", function() {
			
			// Call to the two functions with the AJAX queries
			guide.retrieveEpisodes();
			guide.retrieveShows();
			
			$("#loadData").off("click");

		});
		
	}
	
	// First AJAX query
	guide.retrieveEpisodes = function() {
		
		// Title and red button 
		$('#upcomingEpisodes').append($("<legend>Upcoming Episodes<button type='button' id='redButton' class='btn btn-danger btn-lg'>Find Seasons</button></legend>"));
		
		// Red button onclick
		$("#redButton").on("click", function() {
			
			$(".highlight").css("color","red");
			$(".highlight").css("font-weight","bold");
			
			$("#loadData").off("click");

		});
		
		// I create a table with all the episodes to maintain a clean layout
		var content = "<table>";
		$.ajax({url:"./episodes.json", contentType: "application/json; charset=utf-8"}).done(
			
			function(data) { 
				
				$(data).each(function(i,val) {
					
					// If it is the first item of the row
					if (i%4 == 0) {
						content += "<tr>";
					}
					
					content += "<td><div class='block'><h3>"+val.show.title+"</h3>"+
								"<h4>\"" +shortenTitle(val.episode.title)+ "\"</h4>"+
								"<p><span class='highlight'>Season " +val.episode.season + "</span> Episode "+val.episode.episode+"</p>"+
								"<p><img class='episodes' src='" +val.episode.images.screen+ "' /></p></div></td>";
					
					// If its the last item of the row
					if (i%4 == 3) {
						content += "</tr>";
					}
					
					// If its the end of the table
					if (i == data.length-1) {content += "</table>";}
					
				});
				
				// Append the data and change the opacity for it to appear
				$('#upcomingEpisodes').append(content);
				$('#upcomingEpisodes').css("opacity", "1");
			}
			
			
		);
		
		
	}
	
	// Second AJAX query
	guide.retrieveShows = function() {
		
		// Set the legend 
		$('#interestingShows').append($("<legend>Shows</legend>"));
		
		$.ajax({url:"./shows.json", contentType: "application/json; charset=utf-8"}).done(
			
			function(data) { 
			
				$(data).each(function(i,val) {
					
					// Each show is in a div. Button has its own ID and the description too
					var cShows = "<div class='ishows'><h3>"+val.title+"</h3>"+
								"<img class='posterimg' src='" +val.images.banner+ "' />"+
								"<div id='showcontent" + i + "'><p class='desc'><em>Overview: </em>" +shortenDesc(val.overview) + "</p></div>"+
								"<div class='text-center readmore" + i + "'><button type='button' id='in" + i + "' class='btn btn-primary'>Read more</button></div>"+
								"<div class='text-center readless" + i + "'><button type='button' id='out" + i + "' class='btn btn-primary'>Read less</button></div>"+
								"</div>";
					
					// Append the data 
					$('#interestingShows').append(cShows);
					
					// View short description or full description with the click of the button
					$(".readmore" + i).css("display", "block");
					$(".readless" + i).css("display", "none");
					
					$('#in' + i).on("click", function() {
			
						$("#showcontent" + i).html("<p class='desc'><em>Overview: </em>" +val.overview + "</p>"+
												"<p class='desc'><em>Year: </em>" +val.year + "</p>"+
												"<p class='desc'><em>Country: </em>" +val.country + "</p>"+
												"<p class='desc'><em>Network: </em>" +val.network + "</p>"
												);
						$(".readmore" + i).css("display", "none");
						$(".readless" + i).css("display", "block");
						
						$('#out' + i).on("click", function() {
			
							$("#showcontent" + i).html("<p class='desc'><em>Overview: </em>" +shortenDesc(val.overview) + "</p>");
							$(".readmore" + i).css("display", "block");
							$(".readless" + i).css("display", "none");
							
						});
						
					});
					
					
				});
				
				// Change the opacity to make the data appear
				$('#interestingShows').css("opacity", "1");
			}
			
			
		);
	
	}
	
	// Two functions to make episode title and show description shorter
	var shortenDesc = function(string){
		if (string.length > 85) {
			return string.substr(0, 85)+"...";
		}
      };
	
	var shortenTitle = function(string){
		if (string.length > 40) {
			return string.substr(0, 40)+"...";
		}
      };
	
	
$(document).ready(guide.init);

})(window.guide = window.guide || {},jQuery)