// PCIbex OCD Online Movie Study 
// Visit 2
// Simon Frew, NNL, June 2021

/* document overview  


Instructions 
    - provide instructions and overview
    - calibrate eye-tracking


Movie 1 / Movie 2:  
	- calibrate eye-tracking

    - take distress rating
	- Movie 1: counterbalanced OCD / control movie
    - take distress rating

	- calibrate eye-tracking
	
    - take distress rating
	- Movie 2: counterbalanced OCD / control movie
    - take distress rating


Movie Clips
	- practice round with slider bar  
	- watch 1 minute clips of ocd movie w continuous rating 

Calming Movie 
    - select from a list of calming movies presented in the demo
    - or user can skip

*/


// remove PennController prefix 
PennController.ResetPrefix(null)

// Replace the URL with one that points to a PHP script that you uploaded to your webserver 
// see: https://doc.pcibex.net/how-to-guides/collecting-eyetracking-data/#php-script
EyeTrackerURL("https://dummy.url/script.php")
// notes: addhosts for urls, add servers for videos
AddHost("https://headspacestudios.s3.amazonaws.com/ocd_movies/")

// ---------------- introduction and baseline distress rating 
newTrial("instructions-movieFull",
	defaultText
		.center()
		.print()
	,
	newText("instructions-1", "Welcome") 
	,
	newText("instructions-2", `<p>In this experiment, we will show you some movie clips and track your eye movements.</p>
			<p>We will ask you how you feel as well!</p>`)
	,
	newText("instructions-3", `<p>This experiment needs to access your webcam to follow your eye movements.</p>
			<p>We will only collect data on where on this page your eyes are looking during the experiment!</p>`)
	,
	newButton("instructions-end", "I understand. Start the experiment")
		.center()
		.print() 
		.wait( newEyeTracker("tracker").test.ready() ) 
	,
	clear() 
	,
	fullscreen()
)

CheckPreloaded() 

// ---------------- Movie 1 / Movie 2 Trial 
// template 
Template("visit2-movieURL-full.csv", row =>
	newTrial("movieFull-"+row.id,
		newText("instructions-calibration", "Eye tracking calibaration will begin. Make sure to look at the green dots as they appear!")
			.center()
			.print()
		,
        newButton("introMovieFull", "Click to begin the movie") 
            .center()
            .print() 
            .wait() 
        ,
        clear() 
        , 
        fullscreen()
        ,
		// calibrate eye-tracking
		newEyeTracker("tracker").calibrate(50,2)
		,
		// input distress rating		
		newScale("initialRating", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10")
			.radio()
			.center()
			.labelsPosition("bottom")
			.log("last")
			.print()
		,
		newButton("Select your distress rating then click to start the movie")
		    .center()
		    .print()
		    .wait( getScale("initialRating").test.selected() ) 
	    , 

		// load video url
		newVideo("movieFull", row.movieURL)
			.size("80vw", "80vh") 
			.disable(0.01) 
			.log() 
		,
		// set up canvas 
		newCanvas("movieCanvas", "90vw", "90vh")
			.color("orange")
			.add("center at 50%", "middle at 50%", getVideo("movieFull"))
			.print("center at 50%", "middle at 50%")
		,

		// ---------start video and eye tracking
		getEyeTracker("tracker")
			.add( getCanvas("movieCanvas") )
			.log()
			.start()
		,
		getVideo("movieFull")
			.play()
			.wait()
		    .stop()
	    ,
		getEyeTracker("tracker")
			.stop()
		,
		clear()
		,
		// input distress rating 
		newScale("finalRating", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10")
			.radio()
			.center()
			.labelsPosition("bottom")
			.log("last")
			.print()
		,
		newButton("Select your distress rating then click to move to the next section")
		    .center()
		    .print()
		    .wait( getScale("finalRating").test.selected() ) 
	    ,
		clear()
		,
		newTimer("pause", 250)
			.start()
			.wait() 
    )
)
 



// ---------------- Movie Clips 

newTrial("instructions-movieClips",
	defaultText
			.center()
			.print()
	,
	exitFullscreen()  
	,
	// arrow listening functions
	newKey("upArrow", "ArrowUp") // listen for up arrow press
	    .callback(
	        newFunction("sliderUp", ()=>document.getElementById("mySlider").stepUp(1)) // step slider down
                       .call(),
   	        newFunction("sliderUpCall", ()=>document.getElementById("mySlider").oninput()) // record keypress by triggering slider event
                       .call()
        )
	, 
	newKey("downArrow", "ArrowDown") // listen for down arrow press
	    .callback(
	        newFunction("sliderDown",()=>document.getElementById("mySlider").stepDown(1)) // step slider down
                       .call(),
  	        newFunction("sliderDownCall", ()=>document.getElementById("mySlider").oninput()) // record keypress by triggering slider event
                       .call()
        )
	, 
	// provide example and prompt
	newText("instructions-1", "Remember to use the up and down arrow keys to change the slider!")
	,
    newSlider("exampleSlider", 10)
        .center()
        .vertical()
        .slider()
        .size("5vw", "20vh")  
        .print()
    ,
	newButton("instructions-end", "I understand. Start the experiment")
		.center()
		.print()
		.wait()
	,
	clear() 
	, 
	fullscreen() 
)  
 
  
// template  
Template("visit2-movieURL-clips.csv", row =>
	newTrial("movieClips-"+row.id,
	
		// arrow listening functions
		newKey("upArrow", "ArrowUp") // listen for up arrow press
		    .callback(
		        newFunction("sliderUp", ()=>document.getElementById("mySlider").stepUp(1)) // step slider down
	                       .call(),
	   	        newFunction("sliderUpCall", ()=>document.getElementById("mySlider").oninput()) // record keypress by triggering slider event
	                       .call()
	        )
		, 
		newKey("downArrow", "ArrowDown") // listen for down arrow press
		    .callback(
		        newFunction("sliderDown",()=>document.getElementById("mySlider").stepDown(1)) // step slider down
	                       .call(),
	  	        newFunction("sliderDownCall", ()=>document.getElementById("mySlider").oninput()) // record keypress by triggering slider event
	                       .call()
	        )
		, 

		// ---------initialize content 
		newText("instructions-1", "Remember to use the up and down arrow keys to change the slider!")
	        .center()
	        .print()
	    ,
		newButton("Click to begin the next movie")
		    .center()
		    .print()
		    .wait()  
	    , 
		// load video url
		newVideo("movieClip", row.movieURL)
			.size("80vw", "80vh") 
			.disable(0.01)
			.log()
		, 
		// load distress rating slider
	    newSlider("distressSlider", 10)
			.vertical()
			.slider()
			.log("all") 
			.size("5vw", "20vh")  
	    ,

		// ---------display run experiemnt
		newCanvas("movieCanvas", "90vw", "90vh")
			.color("orange")
			.add("center at 50%", "middle at 50%", getVideo("movieClip"))  
			.add("center at 97%", "middle at 50%", getSlider("distressSlider") )
			.print("center at 50%", "middle at 50%")
		,
		getVideo("movieClip")  
			.play()
			.wait()
		    .stop()
	    , 
	    clear()
	    , 
		newTimer("pause", 250)
			.start()
			.wait()
		)  
)

// ----------------- calming movie selection and play

newVar("movieCalm-choice", "") // define choice variable to pass between trials 
	.global()
 
 
newTrial("movieCalm-selection",

	// select movie
	newScale("movieCalm-options", "Bao","Hugo","Inscapes","Inside Out","Moonrise","Penguins of Madagascar","Piper", "No Movie") // these strings must match the dict keys exactyly in movieURL-calm-dict.js
		.radio()
		.center()
		.vertical()
		.labelsPosition("right") 
		.log("last")
		.print()
	,
	// Button Selection
    newButton("introMovieCalm", "Choose your movie then click to begin!") 
        .center()
        .print() 
        .wait( getScale("movieCalm-options").test.selected() ) 
    ,	
	getVar("movieCalm-choice").set( getScale("movieCalm-options")  ) // save selection
	,
	getVar("movieCalm-choice").set( v=>movieURL_calm_dict[v]) // compare to preloaded dict with URLs
	,
	getVar("movieCalm-choice").set( function(v){ movieChoice = v; return v;}) // set preloaded variable movieChoice to URL
)
 
//play movie from embedded movieCalm.html
newTrial("movieCalm",

    clear() 
    ,
	// load video url
	newHtml("movieHTML", "movieCalm.html").size("80vw", "80vh")   // load html file
		.log() 
	,
    newButton("exitMovie", "Click to exit") // generate exit html file
        .center()
    ,
	// set up canvas 
	newCanvas("movieCanvas", "90vw", "90vh")
		.color("orange")
		.add("center at 50%", "middle at 50%", getHtml("movieHTML"))
		.add("center at 50%", "middle at 90%", getButton("exitMovie"))
		.print("center at 50%", "middle at 50%") 
	,
	newFunction("selectMovie", function(){document.getElementById("movieFrame").src = movieChoice;}) //change html iframe to selected source
	    .call()
	, 
    getButton("exitMovie") // wait for subject to exit the movie 
        .wait()
    ,
	clear()
	,	
	// input distress rating 
	newScale("calmRating", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10")
		.radio()
		.center()
		.labelsPosition("bottom")
		.log("last")
		.print()
	,
	newButton("Select your distress rating then click to finish the experiment")
		.center()
		.print()
		.wait( getScale("calmRating").test.selected() ) 
)

 
SendResults()  

