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
 

*/


// remove PennController prefix 
PennController.ResetPrefix(null)

// Replace the URL with one that points to a PHP script that you uploaded to your webserver 
// see: https://doc.pcibex.net/how-to-guides/collecting-eyetracking-data/#php-script
EyeTrackerURL("https://dummy.url/script.php")
// notes: addhosts for urls, add servers for videos


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
Template("movieURL-full.csv", row =>
	newTrial("movieFull-"+row.id,
        newButton("introMovieFull", "Click to begin "+row.id) 
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
Template("movieURL-clips.csv", row =>
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

newTrial("movieCalm",
	// Button Scaling
    newButton("introMovieCalm", "Click to begin") 
        .center()
        .print() 
        .wait() 
    ,
    clear() 
    ,
	// load video url
	newVideo("calmMovie", "https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_1920_18MG.mp4")		.size("80vw", "80vh") 
		//.disable(0.01) 
		.log() 
	,
	// set up canvas 
	newCanvas("movieCanvas", "90vw", "90vh")
		.color("orange")
		.add("center at 50%", "middle at 50%", getVideo("calmMovie"))
		.print("center at 50%", "middle at 50%")
	,
	// ---------start video 
	getVideo("calmMovie")
		.play()
		.wait()
	    .stop()
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

