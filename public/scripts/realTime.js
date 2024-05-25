var map=null;
var baseMap=null;
var baseMapReady=false;
var intersection=null;
var cameras=null;
var lynxBusId=null;
var ucfBusId=null;

var freewayCount=0;
var basicCount=0
var weavingCount=0
var rampCount=0
var arterialCount=0;
var intersectionCount=0;
var severeCrashCount=0;

var displayDataNumeber=5
var hardBreakCount=0;
var hardAccelerationCount=0;
var highStdSpeedCount=0;
var selectedRoadId=null
var selectedIntersectionId=null
var selectedbusId=null
var selectedRoadType=null
var busData=[]
var drawChartId=0
var dataArray=[]

var showBus=false
var showBusEvent=false
var showCamera=false
var src = './data/kml/Final_segment_0507.kml';

var margin = {top: 10, right: 5, bottom: 40, left: 50},
  width = 300 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;
var svg=null

var isUserOpenPrimary=false
var isUserOpenSconedary=true


var frameCounter=0

function getButtonStatua(buttonId)
{
	var ButtonStatus = document.getElementById(buttonId);
	if (ButtonStatus.classList.contains('active')){
	    //console.log('active')
	    return true
	}
	else {
		//console.log('not active')
		return false
	}
}

function checkPrimaryButtonStatus()
{
	return getButtonStatua('PrimaryCrashButton')
}

function checkSecondaryButtonStatus()
{
return getButtonStatua('SecondaryCrashButton')
}
function checkBaseMapStatus(baseMap)
{
	if(baseMap.docs[0] == undefined)
	{
		return false
	}

	else{
		 return true

	}
}
// function getHeatMap()
// {



// }

function onLoadRealTimeMap()
{

  
  svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

  map = initMap(map)
  //showPleaseWait()
  // initAllbus()
  initCamera()
  loadRoadName()
  getWeatherData()

  baseMap=new geoXML3.parser({map: map, suppressInfoWindows: true,afterParse: initKmlColor});
  baseMap.parse(src)
  // baseMapProne=new geoXML3.parser({map: map, suppressInfoWindows: true,afterParse: initKmlColor});
  // baseMapProne.parse(src)
  

	initSystem()
}
var dataUpdate=false
function initSystem()
{
	
	if(checkBaseMapStatus(baseMap))
	{
		if(dataUpdate==false)
		{
			updateAllBaseMap(10)
			dataUpdate=true
		}
		
		// console.log(baseMap)
		document.getElementById('info-updateTime').textContent ="Init...data...."
		if( weavingArray.length>0 && basicArray.length>0 && rampArray.length>0)
  		{
  			updateRank()
  			updateSecondaryCrash()
        updateAllBaseMap(10)
  			updateEvent()
  			document.getElementById('info-updateTime').textContent ="Ready"
        	updateChart(displayDataNumeber)
        	getBusFiltedData(60)
       		map.setZoom(11);
       		// getPatm()
			   run()
		}
		else
		{
			requestAnimationFrame(initSystem)
		}

	}
	else
	{
	document.getElementById('info-updateTime').textContent ="Loading..."
	requestAnimationFrame(initSystem)

	}

}
var frameCounter=0
function run()
{
	frameCounter+=1
     if(frameCounter%(60*30)==0)
       {
        // if(disableVehicle.length<=0)
        // {
          
          // updateEvent()

        // }

        if(selectedRoadId!=null)
        {
          //console.log(selectedRoadId)




          getSecondaryCCTVData(selectedRoadId)



          try {
                getHeatMap(selectedRoadId)
              }
              catch(err) {
                console.log("no heatmap")
              }





        }
       }

     if(frameCounter%(60*60*5)==0)
       {

          updateEvent()

        }




     if(frameCounter%(60*30)==0)
       {
       	  updateRank()
           console.log("update charts")
           updateAllBaseMap(10)
           // updateEvent()
           updateSecondaryCrash()
           displayOptions()
           
           updateRank()
           // updateSecondRank()
           getBusFiltedData(60)
           getWeatherData()
        }
	requestAnimationFrame(run)
}






function displayOptions()
{
  // if($('#busCheckBox:checked').val()=="")
  // {
  //   showBus=true
  //   displayLynxBus()
  //   displayUcfBus()
  //   openNav3()
  //   closeNav2()
  // }
  // else
  // {
  //   showBus=false
  //   hideLynxBus()
  //   hideUcfBus()
  //   closeNav3()
  //   document.getElementById('info-busData').textContent ="Please select a bus:"
  //   if(busSpeedChart!=null){
  //    var pos = $(document).scrollTop();
  //       busSpeedChart.destroy();
  //      $(document).scrollTop(pos);
  //      }
  //      busSource=null
  //      selectedbusId=null
  // }



  if($('#busEventCheckBox:checked').val()=="")
  {
    showBusEvent=true
    displayBusEvent()
  }
  else
  {
    showBusEvent=false
    hideBusEvent()
  }

  if($('#disabeldVehicleCheckBox:checked').val()=="")
  {
    disableVehicleVisible=true
    displayEvent(disableVehicle)
  }
  else
  {
    disableVehicleVisible=false
    hideEvent(disableVehicle)
  }


  if($('#crashEventCheckBox:checked').val()=="")
  {
   crashEventVisible=true
    displayEvent(crashEvent)
  }
  else
  {
    crashEventVisible=false
    hideEvent(crashEvent)
  }

  if($('#abandonedVehicleCheckBox:checked').val()=="")
  {
   abandonedVehicleVisible=true
    displayEvent(abandonedVehicle)
  }
  else
  {
    abandonedVehicleVisible=false
    hideEvent(abandonedVehicle)
  }

  if($('#congestionCheckBox:checked').val()=="")
  {
   congestionVisible=true
    displayEvent(congestion)
  }
  else
  {
    congestionVisible=false
    hideEvent(congestion)
  }

  if($('#scheduledRoadWorkCheckBox:checked').val()=="")
  {
   scheduledRoadWorkVisible=true
    displayEvent(scheduledRoadWork)
  }
  else
  {
    scheduledRoadWorkVisible=false
    hideEvent(scheduledRoadWork)
  }


  if($('#debrisOnRoadwayCheckBox:checked').val()=="")
  {
   debrisOnRoadwayVisible=true
    displayEvent(debrisOnRoadway)
  }
  else
  {
    debrisOnRoadwayVisible=false
    hideEvent(debrisOnRoadway)
  }


  if($('#secondaryEventCheckBox:checked').val()=="")
  {
    console.log("display")
   secondaryEventVisible=true
    displayEvent(secondaryEvent)
  }
  else
  {
    console.log("hide")
    secondaryEventVisible=false
    hideEvent(secondaryEvent)
  }


  if($('#secondaryPredCheckBox:checked').val()=="")
  {
   secondaryPredVisible=true
    displayEvent(secondaryPred)
  }
  else
  {
    secondaryPredVisible=false
    hideEvent(secondaryPred)
  }





  if($('#cameraCheckBox:checked').val()=="")
  {
  showCamera=true
  displayCamera()
  }
  else
  {
      showCamera=false
      hideCamera()
  }
  if($('#crashCheckBox:checked').val()=="")
  {
  displaySevereCrash()
  }
  else
  {
      hideSevereCrash()
  }
 // if($('#gridSmartCheckBox:checked').val()=="")
 //    {
 //    displayGridSmart()
 //    }
 //    else
 //    {
 //        hideGridSmart()
 //    }

 //    if($('#droneCheckBox:checked').val()=="")
 //    {
 //    displayDrone()
 //    }
 //    else
 //    {
 //        hideDrone()
 //    }

}

