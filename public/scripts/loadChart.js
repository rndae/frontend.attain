var volumeChart=null
var speedChart=null
var stdChart=null
function drawSpeedChart(type, array) {
	if (array.length === 0) {
	  return;
	}
  
	const ctx = document.getElementById('speedChart').getContext('2d');
	const labels = array.map((item, index) => index);
	const speedData = array.map((item) => item.speed);
  
	if (speedChart !== null) {
	  speedChart.destroy();
	}
  
	speedChart = new Chart(ctx, {
	  type: 'line',
	  data: {
		labels: labels,
		datasets: [{
		  label: 'Speed',
		  data: speedData,
		  borderColor: 'rgba(75, 192, 192, 1)',
		  backgroundColor: 'rgba(75, 192, 192, 0.2)',
		  borderWidth: 1
		}]
	  },
	  options: {
		responsive: true,
		scales: {
		  x: {
			type: 'time',
			time: {
			  displayFormats: {
				hour: 'HH:mm'
			  }
			}
		  },
		  y: {
			beginAtZero: true,
			min: 0
		  }
		}
	  }
	});
  }
  
  function drawVolumeChart(type, array) {
	if (array.length === 0) {
	  return;
	}
  
	const ctx = document.getElementById('volumeChart').getContext('2d');
	const labels = array.map((item, index) => index);
	const volumeData = array.map((item) => item.volume);
  
	if (stdChart !== null) {
	  stdChart.destroy();
	}
  
	stdChart = new Chart(ctx, {
	  type: 'line',
	  data: {
		labels: labels,
		datasets: [{
		  label: 'Volume',
		  data: volumeData,
		  borderColor: 'rgba(255, 99, 132, 1)',
		  backgroundColor: 'rgba(255, 99, 132, 0.2)',
		  borderWidth: 1
		}]
	  },
	  options: {
		responsive: true,
		scales: {
		  x: {
			type: 'time',
			time: {
			  displayFormats: {
				hour: 'HH:mm'
			  }
			}
		  },
		  y: {
			beginAtZero: true,
			min: 0
		  }
		}
	  }
	});
  }
var riskChart=null
function drawRiskChart(type,array)
{
	if(array.length<=0)
	{
		return
	}
	var labelset=[]
	var riskSet=[]
	//var severe_crash_riskSet=[]
	var riskHigh=[]

  for (var i = 0; i < array.length; i++)
  {
    number=array[i].crashRisk
    //number2=Math.floor(Math.random() *15);
  	labelset.push(i)
  	riskSet.push(number)
  	//severe_crash_riskSet.push(number2)
  	//riskHigh.push(0.6)
  }
//console.log("updateCrashRisk chart")
 if(riskChart!=null){
 	var pos = $(document).scrollTop();
		 riskChart.destroy();
		$(document).scrollTop(pos);
    }
riskChart=new Chart(document.getElementById("riskChart"), {
	  type: 'line',
	  data: {
	    labels: labelset,
	    datasets: [{
	        data: riskSet,
	        label: "Crash Risk",
	        borderColor: 'rgba(255, 12, 12, 1.0)',
	        fill: false
				}
	    ]
	  },
	  options: {
	  	animation: false,
	  	responsive: true,
	  	legend: {

          position: 'top',
           labels: {
           		usePointStyle:true,
                fontColor: 'white',
                fontSize:12
            }
        },
	    title: {
	      display: true,
	      fontColor: 'white',
	      text: 'Real-Time Crash Risk Prediction'
	    },
	    tooltips: {
      		mode: 'index',
     		 intersect: true
    		},
    		scales:{yAxes: [{
                barThickness : 13,
                fontColor: 'white',
                ticks: {
                	beginAtZero: true,
                  fontColor: "white", // this here
                },scaleLabel: {
				        display: true,
				        labelString: 'Risk Score',
				        fontColor: 'white'
				      }

    		}],
    		xAxes: [{

                fontColor: 'white',
                ticks: {
                  fontColor: "white", // this here
                },
                scaleLabel: {
				        display: true,
				        labelString: 'Time',
				        fontColor: 'white'
				      }
    		}]}
	  }
	});
}
/////////////////////////////////////////pred rank///////////////////////////////////////////////////////////////////////////////////
var secondaryEventRankChart=null
function darwEventRankChart(array)
{
	if(array===undefined)
	{
		return
	}
	if(array.length<0)
	{
		return
	}
	var data1Set=[]
	var data1SetName=[]
	var data1SetName2=[]
	var data1SetLat=[]
	var data1SetLng=[]
	// var rankData=data
	//console.log(array[0][0])
for (var i = 0; i < array.length; i++)
{
		if(array[i]==null || typeof array[i] === 'undefined')
	{
	continue
	}
	else
	{
	data1Set.push(Math.round(array[i].crashRisk * 100) / 100)

	// var roadName=getRoadNameById(array[i].segmentId)
	// var str = [roadName.substring(0, roadName.length - 8),roadName.substring(roadName.length - 8, roadName.length)]
	try {
  var roadName=getRoadNameById(array[i].segmentId)
} catch (error) {
  var roadName=array[i].segmentId
  // expected output: ReferenceError: nonExistentFunction is not defined
  // Note - error messages will vary depending on browser
}

	data1SetName2.push(array[i].segmentId)
	data1SetName.push(array[i].segmentId)
	}
}
if(secondaryEventRankChart!=null){
	 	var pos = $(document).scrollTop();
	secondaryEventRankChart.destroy();
		$(document).scrollTop(pos);
    }
	secondaryEventRankChart= new Chart(document.getElementById("secondaryEventRankChart"), {
	  type: 'horizontalBar',
	  scaleFontColor: 'white',
	  data: {
	    labels: data1SetName,
	    datasets: [{
	        data: data1Set,
	        label: "Freeway",
	   	backgroundColor:'rgba(25, 289, 255, 0.2)',
	        borderColor: 'rgba(25, 289, 255, 1.0)',
	        fill: false,
	         borderWidth: 1
	      }

	    ]
	  },
  options: {
	  	animation: false,
	  	responsive: true,
	    title: {
	    	fontColor: 'white',
	      display: true,
	      text: 'Top 3  Segments Secondary Crash Prone Location\n (based on crash events) '
	    },
	    legend: {
          position: 'top',
           labels: {

                // This more specific font property overrides the global property
                fontColor: 'white',
                fontSize:12
            }
        },

	    scales: {
          yAxes: [{
                barThickness : 13,
                fontColor: 'white',
                ticks: {
                	beginAtZero: true,
                  fontColor: "white", // this here
                },scaleLabel: {
				        display: true,
				        labelString: 'Mile Mark',
				        fontColor: 'white'
				      }

    		}],
    		xAxes: [{

                fontColor: 'white',
                ticks: {
                	beginAtZero: true,
                  fontColor: "white", // this here
                },
                scaleLabel: {
				        display: true,
				        labelString: 'Risk Score',
				        fontColor: 'white'
				      }

    		}]
	  }
	}
	});
		document.getElementById("secondaryEventRankChart").onclick = function(evt)
		{
			var activePoints = secondaryEventRankChart.getElementsAtEvent(evt);

			if(activePoints.length > 0)
			{
				//get the internal index of slice in pie chart
				var clickedElementindex = activePoints[0]["_index"];

				//get specific label by index
				var label = secondaryEventRankChart.data.labels[clickedElementindex];

				//get value by index
				var value = secondaryEventRankChart.data.datasets[0].data[clickedElementindex];
				moveToLocation("freeway",data1SetName2[clickedElementindex])
				severeTag=false
				updateChart(displayDataNumeber)
				openNav2()
				getSecondaryCCTVData(data1SetName2[clickedElementindex])
								                  try {
                getHeatMap(data1SetName2[clickedElementindex])
              }
              catch(err) {
                console.log("no heatmap")
              }
				

				closeNav3()
		   }
		}
	}
/////////////////////////////////////////pred rank///////////////////////////////////////////////////////////////////////////////////
var secondaryPredRankChart=null
function darwPredRankChart(array)
{
	console.log(array)
	if(array===undefined)
	{
		return
	}
	if(array.length<0)
	{
		return
	}
	var data1Set=[]
	var data1SetName=[]
	var data1SetName2=[]
	var data1SetLat=[]
	var data1SetLng=[]
	// var rankData=data
	//console.log(array[0][0])
for (var i = 0; i < array.length; i++)
{
		if(array[i]==null || typeof array[i] === 'undefined')
	{
	continue
	}
	else
	{
	data1Set.push(Math.round(array[i].crashRisk * 100) / 100)

	try {
  var roadName=getRoadNameById(array[i].segmentId)
} catch (error) {
  var roadName=array[i].segmentId
  // expected output: ReferenceError: nonExistentFunction is not defined
  // Note - error messages will vary depending on browser
}


	// var str = [roadName.substring(0, roadName.length - 8),roadName.substring(roadName.length - 8, roadName.length)]



	data1SetName2.push(array[i].segmentId)
	data1SetName.push(roadName)
	}
}
	 if(secondaryPredRankChart!=null){
	 	console.log("--------------------reset-------------------")
	 	var pos = $(document).scrollTop();
	secondaryPredRankChart.destroy();
		$(document).scrollTop(pos);
    }

	secondaryPredRankChart= new Chart(document.getElementById("secondaryPredRankChart"), {
	  type: 'horizontalBar',
	  scaleFontColor: 'white',
	  data: {
	    labels: data1SetName,
	    datasets: [{
	        data: data1Set,
	        label: "Freeway",
	   	backgroundColor:'rgba(25, 289, 255, 0.2)',
	        borderColor: 'rgba(25, 289, 255, 1.0)',
	        fill: false,
	         borderWidth: 1
	      }

	    ]
	  },
  options: {
	  	animation: false,
	  	responsive: true,
	    title: {
	    	fontColor: 'white',
	      display: true,
	      text: 'Top 3  Segements Secondary Crash Prone Location\n (based on crash Prediction) '
	    },
	    legend: {
          position: 'top',
           labels: {

                // This more specific font property overrides the global property
                fontColor: 'white',
                fontSize:12
            }
        },

	    scales: {
          yAxes: [{
                barThickness : 13,
                fontColor: 'white',
                ticks: {
                	beginAtZero: true,
                  fontColor: "white", // this here
                },scaleLabel: {
				        display: true,
				        labelString: 'Mile Mark',
				        fontColor: 'white'
				      }

    		}],
    		xAxes: [{

                fontColor: 'white',
                ticks: {
                	beginAtZero: true,
                  fontColor: "white", // this here
                },
                scaleLabel: {
				        display: true,
				        labelString: 'Risk Score',
				        fontColor: 'white'
				      }

    		}]
	  }
	}
	});
		document.getElementById("secondaryPredRankChart").onclick = function(evt)
		{
			var activePoints = secondaryPredRankChart.getElementsAtEvent(evt);

			if(activePoints.length > 0)
			{
				//get the internal index of slice in pie chart
				var clickedElementindex = activePoints[0]["_index"];

				//get specific label by index
				var label = secondaryPredRankChart.data.labels[clickedElementindex];

				//get value by index
				var value = secondaryPredRankChart.data.datasets[0].data[clickedElementindex];
				moveToLocation("freeway",data1SetName2[clickedElementindex])
				severeTag=false
				updateChart(displayDataNumeber)
				openNav2()
				getSecondaryCCTVData(data1SetName2[clickedElementindex])

				                  try {
                getHeatMap(data1SetName2[clickedElementindex])
              }
              catch(err) {
                console.log("no heatmap")
              }
				
				closeNav3()
		   }
		}
	}

/////////////////////////////////////////arterial rank///////////////////////////////////////////////////////////////////////////////////
var arterialRankChart=null
function drawArterialChart(array)
{
	if(array===undefined)
	{
		return
	}
	if(array.length<0)
	{
		return
	}
	var data1Set=[]
	var data1SetName=[]
	var data1SetLat=[]
	var data1SetLng=[]
	// var rankData=data
	//console.log(array[0][0])
for (var i = 0; i < array.length; i++)
{
	data1Set.push(Math.round(array[i][array[i].length-1].crashRisk * 100) / 100)
	data1SetName.push(array[i][array[i].length-1].allId1)

	// data1SetLat.push(10)
	// data1SetLng.push(10)

}
	 if(arterialRankChart!=null){
	 	var pos = $(document).scrollTop();
	arterialRankChart.destroy();
		$(document).scrollTop(pos);
    }

	arterialRankChart= new Chart(document.getElementById("arterialRankChart"), {
	  type: 'horizontalBar',
	  scaleFontColor: 'white',
	  data: {
	    labels: data1SetName,
	    datasets: [{
	        data: data1Set,
	        label: "Arterial",
	   	backgroundColor:'rgba(25, 289, 255, 0.2)',
	        borderColor: 'rgba(25, 289, 255, 1.0)',
	        fill: false,
	         borderWidth: 1
	      }

	    ]
	  },
  options: {
	  	animation: false,
	  	responsive: true,
	    title: {
	    	fontColor: 'white',
	      display: true,
	      text: 'Top 3 High-Risk Arterial Segments  '
	    },
	    legend: {
          position: 'top',
           labels: {

                // This more specific font property overrides the global property
                fontColor: 'white',
                fontSize:12
            }
        },
	    // elements: {
					// 	rectangle: {
					// 		borderWidth: 2,
					// 	}
					// },
	    scales: {
          yAxes: [{
                barThickness : 13,
                fontColor: 'white',
                ticks: {
                	beginAtZero: true,
                  fontColor: "white", // this here
                },scaleLabel: {
				        display: true,
				        labelString: 'Segments ID',
				        fontColor: 'white'
				      }
            //      categoryPercentage: 0.5,
            // barPercentage: 0.5
    		}],
    		xAxes: [{

                fontColor: 'white',
                ticks: {
                	beginAtZero: true,
                  fontColor: "white", // this here
                },
                scaleLabel: {
				        display: true,
				        labelString: 'Risk Score',
				        fontColor: 'white'
				      }
            //      categoryPercentage: 0.5,
            // barPercentage: 0.5
    		}]
	  }
	}
	});
		document.getElementById("arterialRankChart").onclick = function(evt)
		{
			var activePoints = arterialRankChart.getElementsAtEvent(evt);

			if(activePoints.length > 0)
			{
				//get the internal index of slice in pie chart
				var clickedElementindex = activePoints[0]["_index"];

				//get specific label by index
				var label = arterialRankChart.data.labels[clickedElementindex];

				//get value by index
				var value = arterialRankChart.data.datasets[0].data[clickedElementindex];
				moveToLocation("arterial",data1SetName[clickedElementindex])
				severeTag=false
				updateChart(displayDataNumeber)
				openNav2()
				closeNav3()
				getSecondaryCCTVData(data1SetName[clickedElementindex])
		   }
		}
	}



    /////////////////////////////////////////freeway  rank///////////////////////////////////////////////////////////////////////////////////
    var basicRankChart=null
    function drawBasicChart(array)
    {
			if(array===undefined)
			{
				return
			}
			if(array.length<0)
			{
				return
			}
    	var data1Set=[]
    	var data1SetName=[]
    	var data1SetName2=[]
    	var data1SetLat=[]
    	var data1SetLng=[]
    	// var rankData=data
    for (var i = 0; i < array.length; i++)
    {
			data1Set.push(Math.round(array[i][array[i].length-1].crashRisk * 100) / 100)


			var roadName=getRoadNameById(array[i][array[i].length-1].allId1)
			var str = [roadName.substring(0, roadName.length - 8),roadName.substring(roadName.length - 8, roadName.length)]

			data1SetName.push(str)
			data1SetName2.push(array[i][array[i].length-1].allId1)
    }
    	 if(basicRankChart!=null){
    	 	var pos = $(document).scrollTop();
    	basicRankChart.destroy();
    		$(document).scrollTop(pos);
            //console.log("resetttttttttt")
        }

    	basicRankChart= new Chart(document.getElementById("basicRankChart"), {
    	  type: 'horizontalBar',
    	  scaleFontColor: 'white',
    	  data: {
    	    labels: data1SetName,
    	    datasets: [{
    	        data: data1Set,
    	        label: "basic",
    	   	backgroundColor:'rgba(25, 289, 255, 0.2)',
    	        borderColor: 'rgba(25, 289, 255, 1.0)',
    	        fill: false,
    	         borderWidth: 1
    	      }

    	    ]
    	  },
      options: {
    	  	animation: false,
    	  	responsive: true,
    	    title: {
    	    	fontColor: 'white',
    	      display: true,
    	      text: 'Top 3 High-Risk Freeway-Basic Segements  '
    	    },
    	    legend: {
              position: 'top',
               labels: {

                    // This more specific font property overrides the global property
                    fontColor: 'white',
                    fontSize:12
                }
            },
    	    // elements: {
    					// 	rectangle: {
    					// 		borderWidth: 2,
    					// 	}
    					// },
    	    scales: {
              yAxes: [{
                    barThickness : 13,
                    fontColor: 'white',
                    ticks: {
									
								
                    	beginAtZero: true,
                      fontColor: "white", // this here
                    },scaleLabel: {
    				        display: true,
    				        labelString: 'Mile Mark',
    				        fontColor: 'white'
    				      }
                //      categoryPercentage: 0.5,
                // barPercentage: 0.5
        		}],
        		xAxes: [{

                    fontColor: 'white',
                    ticks: {
                    	beginAtZero: true,
                      fontColor: "white", // this here
                    },
                    scaleLabel: {
    				        display: true,
    				        labelString: 'Risk Score',
    				        fontColor: 'white'
    				      }
                //      categoryPercentage: 0.5,
                // barPercentage: 0.5
        		}]
    	  }
    	}
    	});
    		document.getElementById("basicRankChart").onclick = function(evt)
    		{
    		    var activePoints = basicRankChart.getElementsAtEvent(evt);

    		    if(activePoints.length > 0)
    		    {
    		      //get the internal index of slice in pie chart
    		      var clickedElementindex = activePoints[0]["_index"];

    		      //get specific label by index
    		      var label = basicRankChart.data.labels[clickedElementindex];

    		      //get value by index
    		      var value = basicRankChart.data.datasets[0].data[clickedElementindex];
    		      moveToLocation("freeway",data1SetName2[clickedElementindex])
							severeTag=false
							updateChart(displayDataNumeber)
							openNav2()
							closeNav3()
				getSecondaryCCTVData(data1SetName2[clickedElementindex])
    		      /* other stuff that requires slice's label and value */
    		   }
    		}
			}

///
/////////////////////////////////////////freeway  rank///////////////////////////////////////////////////////////////////////////////////
var rampRankChart=null
function drawRampChart(array)
{
	if(array===undefined)
	{
		return
	}
	if(array.length<0)
	{
		return
	}
	var data1Set=[]
	var data1SetName=[]
	var data1SetName2=[]
	var data1SetLat=[]
	var data1SetLng=[]
	// var rankData=data
for (var i = 0; i < array.length; i++)
{
	//console.log(array[i][array[i].length-1].crashRisk)
	data1Set.push(array[i][array[i].length-1].crashRisk)

				var roadName=getRoadNameById(array[i][array[i].length-1].allId1)
			var str = [roadName.substring(0, roadName.length - 8),roadName.substring(roadName.length - 8, roadName.length)]

data1SetName2.push(array[i][array[i].length-1].allId1)
	data1SetName.push(str)
}
// console.log(data1Set)
	 if(rampRankChart!=null){
		var pos = $(document).scrollTop();
	rampRankChart.destroy();
		$(document).scrollTop(pos);
				//console.log("resetttttttttt")
		}

	rampRankChart= new Chart(document.getElementById("rampRankChart"), {
		type: 'horizontalBar',
		scaleFontColor: 'white',
		data: {
			labels: data1SetName,
			datasets: [{
					data: data1Set,
					label: "Freeway",
			backgroundColor:'rgba(25, 289, 255, 0.2)',
					borderColor: 'rgba(25, 289, 255, 1.0)',
					fill: false,
					 borderWidth: 1
				}

			]
		},
	options: {
			animation: false,
			responsive: true,
			title: {
				fontColor: 'white',
				display: true,
				text: 'Top 3 High-Risk Freeway-Ramp Segements  '
			},
			legend: {
					position: 'top',
					 labels: {

								// This more specific font property overrides the global property
								fontColor: 'white',
								fontSize:12
						}
				},
			// elements: {
					// 	rectangle: {
					// 		borderWidth: 2,
					// 	}
					// },
			scales: {
					yAxes: [{
								barThickness : 13,
								fontColor: 'white',
								ticks: {
							
									beginAtZero: true,
									fontColor: "white", // this here
								},scaleLabel: {
								display: true,
								labelString: 'Mile Mark',
								fontColor: 'white'
							}
						//      categoryPercentage: 0.5,
						// barPercentage: 0.5
				}],
				xAxes: [{

								fontColor: 'white',
								ticks: {
									beginAtZero: true,
									fontColor: "white", // this here
								},
								scaleLabel: {
								display: true,
								labelString: 'Risk Score',
								fontColor: 'white'
							}
						//      categoryPercentage: 0.5,
						// barPercentage: 0.5
				}]
		}
	}
	});
		document.getElementById("rampRankChart").onclick = function(evt)
		{
				var activePoints = rampRankChart.getElementsAtEvent(evt);

				if(activePoints.length > 0)
				{
					//get the internal index of slice in pie chart
					var clickedElementindex = activePoints[0]["_index"];

					//get specific label by index
					var label = rampRankChart.data.labels[clickedElementindex];

					//get value by index
					var value = rampRankChart.data.datasets[0].data[clickedElementindex];
					moveToLocation("freeway",data1SetName2[clickedElementindex])
					severeTag=false
					updateChart(displayDataNumeber)
					openNav2()
					closeNav3()
					getSecondaryCCTVData(data1SetName2[clickedElementindex])
					/* other stuff that requires slice's label and value */
			 }
		}
	}

///
/////////////////////////////////////////freeway  rank///////////////////////////////////////////////////////////////////////////////////
var weavingRankChart=null
function drawWeavingChart(array)
{
	if(array===undefined)
	{
		return
	}
	if(array.length<0)
	{
		return
	}
	var data1Set=[]
	var data1SetName=[]
	var data1SetName2=[]
	var data1SetLat=[]
	var data1SetLng=[]
	// var rankData=data
for (var i = 0; i < array.length; i++)
{
	data1Set.push(Math.round(array[i][array[i].length-1].crashRisk * 100) / 100)
					var roadName=getRoadNameById(array[i][array[i].length-1].allId1)
			var str = [roadName.substring(0, roadName.length - 8),roadName.substring(roadName.length - 8, roadName.length)]

data1SetName2.push(array[i][array[i].length-1].allId1)
	data1SetName.push(str)
}
	 if(weavingRankChart!=null){
		var pos = $(document).scrollTop();
	weavingRankChart.destroy();
		$(document).scrollTop(pos);
				//console.log("resetttttttttt")
		}

	weavingRankChart= new Chart(document.getElementById("weavingRankChart"), {
		type: 'horizontalBar',
		scaleFontColor: 'white',
		data: {
			labels: data1SetName,
			datasets: [{
					data: data1Set,
					label: "weaving",
			backgroundColor:'rgba(25, 289, 255, 0.2)',
					borderColor: 'rgba(25, 289, 255, 1.0)',
					fill: false,
					 borderWidth: 1
				}

			]
		},
	options: {
			animation: false,
			responsive: true,
			title: {
				fontColor: 'white',
				display: true,
				text: 'Top 3 High-Risk Freeway-Weaving Segements  '
			},
			legend: {
					position: 'top',
					 labels: {

								// This more specific font property overrides the global property
								fontColor: 'white',
								fontSize:12
						}
				},
			// elements: {
					// 	rectangle: {
					// 		borderWidth: 2,
					// 	}
					// },
			scales: {
					yAxes: [{
								barThickness : 13,
								fontColor: 'white',
								ticks: {
									
									beginAtZero: true,
									fontColor: "white", // this here
								},scaleLabel: {
								display: true,
								labelString: 'Mile Mark',
								fontColor: 'white'
							}
						//      categoryPercentage: 0.5,
						// barPercentage: 0.5
				}],
				xAxes: [{

								fontColor: 'white',
								ticks: {
									beginAtZero: true,
									fontColor: "white", // this here
								},
								scaleLabel: {
								display: true,
								labelString: 'Risk Score',
								fontColor: 'white'
							}
						//      categoryPercentage: 0.5,
						// barPercentage: 0.5
				}]
		}
	}
	});
		document.getElementById("weavingRankChart").onclick = function(evt)
		{
				var activePoints = weavingRankChart.getElementsAtEvent(evt);

				if(activePoints.length > 0)
				{
					//get the internal index of slice in pie chart
					var clickedElementindex = activePoints[0]["_index"];

					//get specific label by index
					var label = weavingRankChart.data.labels[clickedElementindex];

					//get value by index
					var value = weavingRankChart.data.datasets[0].data[clickedElementindex];
					moveToLocation("freeway",data1SetName2[clickedElementindex])
					severeTag=false
					updateChart(displayDataNumeber)
					openNav2()
					closeNav3()
					getSecondaryCCTVData(data1SetName2[clickedElementindex])
					/* other stuff that requires slice's label and value */
			 }
		}
	}

///
/////////////////////////////////////////freeway  rank///////////////////////////////////////////////////////////////////////////////////
var intersectionRankChart=null
function drawIntersectionChart(array)
{
	if(array===undefined)
	{
		return
	}
	if(array.length<0)
	{
		return
	}
	var data1Set=[]
	var data1SetName=[]
	var data1SetLat=[]
	var data1SetLng=[]
	// var rankData=data
for (var i = 0; i < array.length; i++)
{
	data1Set.push(Math.round(array[i][array[i].length-1].crashRisk * 100) / 100)
	data1SetName.push(array[i][array[i].length-1].intersection)
}
	 if(intersectionRankChart!=null){
		var pos = $(document).scrollTop();
	intersectionRankChart.destroy();
		$(document).scrollTop(pos);
				//console.log("resetttttttttt")
		}

	intersectionRankChart= new Chart(document.getElementById("intersectionRankChart"), {
		type: 'horizontalBar',
		scaleFontColor: 'white',
		data: {
			labels: data1SetName,
			datasets: [{
					data: data1Set,
					label: "Intersection",
			backgroundColor:'rgba(25, 289, 255, 0.2)',
					borderColor: 'rgba(25, 289, 255, 1.0)',
					fill: false,
					 borderWidth: 1
				}

			]
		},
	options: {
			animation: false,
			responsive: true,
			title: {
				fontColor: 'white',
				display: true,
				text: 'Top 3 High-Risk Intersections  '
			},
			legend: {
					position: 'top',
					 labels: {

								// This more specific font property overrides the global property
								fontColor: 'white',
								fontSize:12
						}
				},
			// elements: {
					// 	rectangle: {
					// 		borderWidth: 2,
					// 	}
					// },
			scales: {
					yAxes: [{
								barThickness : 13,
								fontColor: 'white',
								ticks: {
									beginAtZero: true,
									fontColor: "white", // this here
								},scaleLabel: {
								display: true,
								labelString: 'Segments ID',
								fontColor: 'white'
							}
						//      categoryPercentage: 0.5,
						// barPercentage: 0.5
				}],
				xAxes: [{

								fontColor: 'white',
								ticks: {
									beginAtZero: true,
									fontColor: "white", // this here
								},
								scaleLabel: {
								display: true,
								labelString: 'Risk Score',
								fontColor: 'white'
							}
						//      categoryPercentage: 0.5,
						// barPercentage: 0.5
				}]
		}
	}
	});
		document.getElementById("intersectionRankChart").onclick = function(evt)
		{
			var activePoints = intersectionRankChart.getElementsAtEvent(evt);

			if(activePoints.length > 0)
			{
				//get the internal index of slice in pie chart
				var clickedElementindex = activePoints[0]["_index"];

				//get specific label by index
				var label = intersectionRankChart.data.labels[clickedElementindex];

				//get value by index
				var value = intersectionRankChart.data.datasets[0].data[clickedElementindex];
				console.log("inertszdfhkalsjdhfalskdjflskudzgfljk")
				moveToLocation("intersection",data1SetName[clickedElementindex])
				severeTag=false
				updateChart(displayDataNumeber)
				openNav2()
				closeNav3()
				getSecondaryCCTVData(data1SetName[clickedElementindex])
				/* other stuff that requires slice's label and value */
		 }
			 }
		}
//////////////////////////////
/////////////risk chart/////////////////
var busSpeedChart=null
function drawBusSpeedChart(array)
{
	console.log(array)
	if(array.length<=0)
	{
		return
	}
	var labelset=[]
	var riskSet=[]
	//var severe_crash_riskSet=[]
	var riskHigh=[]
  for (var i = 1; i < array.length; i++)
  {
    var preLat=array[i-1].lat
		var preLon=array[i-1].lon
		var currentLat=array[i].lat
		var currentLon=array[i].lon
		var preTime=array[i-1].lastUpdate
		var currentTime=array[i].lastUpdate
		var time=currentTime-preTime
		var distance=getGpsDistance(preLat, preLon, currentLat, currentLon, "K")
		//console.log(distance)
		//console.log(time)
		var speed=distance*1000/(time)
		if(speed>17)
		{
			speed=17+Math.floor(Math.random() * 2) - 1
		}
    //number2=Math.floor(Math.random() *15);
		var date = new Date(array[i].lastUpdate*1000);
		if(speed*2.23694>=0)
		{
			labelset.push(array.length-i)
			riskSet.push(speed*2.23694)
		}
		// else
		// {
		// 	labelset.push("")
		// 	riskSet.push(0)
		// }

  	//severe_crash_riskSet.push(number2)
  	//riskHigh.push(0.6)
  }
//console.log("updateCrashRisk chart")
 if(busSpeedChart!=null){
 	var pos = $(document).scrollTop();
		 busSpeedChart.destroy();
		$(document).scrollTop(pos);
    }
busSpeedChart=new Chart(document.getElementById("busSpeedChart"), {
	type: 'line',
	data: {
		labels: labelset,
		datasets: [{
				data: riskSet,
				label: "mph",
				 backgroundColor:'rgba(255, 183, 30, 0.2)',
				borderColor: 'rgba(255, 183, 30, 1.0)',
				fill: false,
				 borderWidth: 1
			}

		]
	},
	options: {
		animation: false,
		responsive: true,
		legend: {
				position: 'top',
				 labels: {
							fontColor: 'white',
							fontSize:12
					}
			},
		title: {
			fontColor: 'white',
			display: true,
			text: 'Real-Time Bus Speed'
		},scales: {
			yAxes: [{

								fontColor: 'white',
							 scaleLabel: {
							display: true,
							labelString: 'Speed(mph)',
							 fontColor: 'white'
						},
						 ticks: {
							beginAtZero: true,
								fontColor: "orange", // this here
							}
					}]
					,
xAxes: [{
								fontColor: 'white',
							 scaleLabel: {
							display: true,
							labelString: 'Seconds before the current time(s)',
							 fontColor: 'white'
						},
						 ticks: {
								fontColor: "white", // this here
							}
					}]
			 }
	}
});
}
