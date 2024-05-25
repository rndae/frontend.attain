//ou zheng
//2019/4/15
var rampArray=[]
var secondaryArray=[]
var secondaryEvent=[]
var secondaryPred=[]
var secondaryEventRank=[]
var secondaryPredRank=[]
var secondaryEventVisible=true
var secondaryPredVisible=true
var crashEvent=[]
var disableVehicle=[]
var debrisOnRoadway=[]
var abandonedVehicle=[]
var congestion=[]
var scheduledRoadWork=[]
var otherEvent=[]

var crashEventVisible=false
var disableVehicleVisible=false
var debrisOnRoadwayVisible=false
var abandonedVehicleVisible=false
var congestionVisible=false
var scheduledRoadWorkVisible=false
var otherEventVisible=false

var secondaryEventRedCount=0
var secondaryPredRedCount=0
var intersectionArray=[]
var basicArray=[]
var weavingArray=[]
var arterialArray=[]
var severeTag=false
var weavingRedCount=0
var rampRedCount=0
var basicRedCount=0
var intersectionRedCount=0
var arterialRedCount=0
var weavingSevereRedCount=0
var rampSevereRedCount=0
var basicSevereRedCount=0
var intersectionSevereRedCount=0
var arterialSevereRedCount=0

var intersectionUpdated=0
var arterialUpdated=0
var rampUpdated=0
var basicUpdated=0
var weavingUpdated=0
var currentSelectedRoadStatus="green"
//basic th
var basicRiskThreshold1=0.276
var basicRiskThreshold2=0.11
var basicSevereRiskThreshold1=0.00341905865030657
var basicSevereRiskThreshold2=0.0000959943908851817

//weaving th
var weavingRiskThreshold1=0.067
var weavingRiskThreshold2=0.005
var weavingSevereRiskThreshold1=0.00223284519047619
var weavingSevereRiskThreshold2=0.000166630238095238

//ramp th
var rampRiskThreshold1=0.005
var rampRiskThreshold2=0.002
var rampSevereRiskThreshold1=0.0001403616167698182
var rampSevereRiskThreshold2=0.0000701808083849091

//arterial th
var arterialRiskThreshold1=0.01
var arterialRiskThreshold2=0.007
var arterialSevereRiskThreshold1=0.000151784077384049
var arterialSevereRiskThreshold2=0.000106248854168834

//intersection th
var intersectionRiskThreshold1=0.026
var intersectionRiskThreshold2=0.017
var intersectionSevereRiskThreshold1=0.0055441612568527
var intersectionSevereRiskThreshold2=0.00175862068965517






function generateXSPF(name, url) {
      var xspfString = `<?xml version="1.0" encoding="UTF-8"?><playlist xmlns="http://xspf.org/ns/0/" xmlns:vlc="http://www.videolan.org/vlc/playlist/ns/0/" version="1"><trackList><track><location>${url}</location><title>${name}</title></track></trackList></playlist>`
      var element = document.createElement('a');
      element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(xspfString)}`);
      element.setAttribute('download', `${name}.xspf`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
}






function updateAllBaseMap(number)
{
  currentSelectedRoadStatus="green"
  //console.log("update map")
  if(severeMakerArray.length>0)
  {
    severeMakerArray=deleteMarkers(severeMakerArray)
  }

  updateWeaving(number);
  //updateArterial(number);
  updateRamp(number);
  updateBasic(number);
  //updateIntersection(number);

    basicCount=getBasicCount()
    weavingCount=getWeavingCount()
    rampCount=getRampCount()
    //arterialCount=getArterialCount()
    //intersectionCount=getIntersectionCount()
    severeCrashCount=getSevereCount()
  document.getElementById('info-basic').textContent =String(basicCount).padStart(2, ' ')
  document.getElementById('info-weaving').textContent = String(weavingCount).padStart(2, ' ')
  document.getElementById('info-ramp').textContent = String(rampCount).padStart(2, '')
  // document.getElementById('info-arterial').textContent = String(arterialCount).padStart(2, ' ')
  // document.getElementById('info-intersection').textContent = String(intersectionCount).padStart(2, ' ')
  document.getElementById('info-severe').textContent = String(severeCrashCount).padStart(2, ' ')
  console.log($('#crashCheckBox:checked').val()=="")
  //document.getElementById('info-patm').textContent ="PATM strategy is not needed "

}
function getSecondaryCCTVData(segmentId)
{
    
    var jsonPath="http://10.32.93.91:8085/CCTV/getDataInMinutes/1"
    queryData(function(json) {
    var data=JSON.parse(json);

    //console.log(data)

     var findCCTV=false

        for (var i = 0; i <data.length; i++)
     {

      // console.log(segmentId.toString())
      if(data[i].segment_id==segmentId.toString())
      {
        findCCTV=true
        //console.log("------------------------")
        //console.log(data[i])
      var html=""
      html+="<div class=\"row\">"+"Type: "+data[i].type+"</h2>"
      html+="</div><br>"
        html+="<ul class=\"nav nav-tabs\">"
        if(data[i].cameras.length==0)
        {
          findCCTV=false
        }

      for (var j = 0; j <data[i].cameras.length; j++)
     {
            if(j==0)
      {
        html+="<li class=\"active camera"+j+"-tab\"><a data-toggle=\"tab\" href=\"#camera"+j+"\">camera:"+j+"</a></li>"
      }
      else
      {
        html+="<li class=\"camera"+j+"-tab\"><a data-toggle=\"tab\" href=\"#camera"+j+"\">camera:"+j+"</a></li>"
      }
      
     }
     html+="</ul>"

     html+="<div class=\"tab-content\">"

      for (var j = 0; j <data[i].cameras.length; j++)
     {
      if(j==0)
      {
        html+="<div id=\"camera"+j+"\" class=\"tab-pane fade  in active\">"
      }
      else
      {
        html+="<div id=\"camera"+j+"\" class=\"tab-pane fade \">"
      }
      
      html+="<img src=\""+data[i].cameras[j].snapshot_path+"\"alt=\"Paris\" style=\"width:250px;height:180px\">"
      html+="<h6>Recommended Scan Direction:\n"+data[i].cameras [j].rec_scan_direction+"</h6>"
      
      html+="<div><strong>Livestream: </strong><a class=\"link\" onclick=\"generateXSPF(\'"+data[i].cameras[j].camera_name+"\', \'"+data[i].cameras[j].video_feed+"\')\" >"+data[i].cameras[j].video_feed+"</a></div>"


      html+="</div>"
     }
     html+="</div>"

     // secondaryCCTV
  
        // if(data[i].type=="primary")
        // {
        //   $('#primaryCCTV').html(html);
        // }
        // else if(data[i].type=="secondary-confirmed" || data[i].type=="secondary-predicted")
        // {
        //     $('#secondaryCCTV').html(html);
        // }

      }
      if(findCCTV==false)
      {
            var html=""
      html+="<div class=\"row\">No camera</h2>"
      html+="</div><br>"
      }

     $('#secondaryCCTV').html(html);



     }


      },jsonPath);
}


function updateIntersection(number)
{
    intersectionUpdated=false
    var jsonPath="http://10.32.93.91:8085/intersection/getData/514"
    queryData(function(json) {
    var data=JSON.parse(json);
    var redCount=updateData("intersection",intersectionArray,data,intersectionRiskThreshold1,intersectionRiskThreshold2,intersectionSevereRiskThreshold1,intersectionSevereRiskThreshold2,number)
    intersectionRedCount=redCount[0]
    intersectionSevereRedCount=redCount[1]
    intersectionUpdated=true
      },jsonPath);
}

function getHeatMap(selectedRoadId)
{
var myGroups=[]
var myVars=[]
var myData=[]
  //console.log(selectedRoadId)
    var jsonPath="http://192.241.150.101:8082/heatmap/getDataBySegmentIdInMinutes/10/"+selectedRoadId.toString()
    queryData(function(json) {
    var data=JSON.parse(json).reverse();

    //console.log(data)

  try {
    for (id in data[0]["id"])
    {
      if(id!="_id")
      {
         myGroups.push(getRoadNameById(data[0]["id"][id]))
      }
}
} catch (error) {
  console.log(error);
  return
  // expected output: ReferenceError: nonExistentFunction is not defined
  // Note - error messages will vary depending on browser
}

myGroups=myGroups
// console.log(myGroups)

//console.log(data[0]["id"]["id1"])
//var myGroups = [data[0]["id"]["id1"],data[0]["id"]["id2"],data[0]["id"]["id3"],data[0]["id"]["id4"],data[0]["id"]["id5"],data[0]["id"]["id6"],data[0]["id"]["id7"],data[0]["id"]["id8"],data[0]["id"]["id9"],data[0]["id"]["id10"]]

//console.log(data.length)
for (var i = 0; i <data.length; i++)
 { //    {}

var d = new Date(data[i]["time"]);
var offset = +240; //Timezone offset for EST in minutes.
var estDate = new Date(d.getTime() + offset*60*1000);
var tmpMintues=(estDate.getMinutes()<10?'0':'') + estDate.getMinutes()
var tmpTime=estDate.getHours()+":"+tmpMintues
var width=150
var height=150
if(myVars.includes(tmpTime))
{
  console.log("key exist")
}
else
{
   myVars.push(tmpTime)
    for (var j = 1; j <myGroups.length+1; j++)
       {
        var tmpId="id"+j.toString()
        var tmpValue="val"+j.toString()
        // console.log(tmpId)
        // console.log(tmpValue)
       //console.log({"group:"+data[i]["id"][tmpId]+",variable:"+data[i]["time"]+",value:"+data[i]["value"][tmpValue]})
        //myData.push([`{`+`"group":"`+data[i]["id"][tmpId]+`+"\",\"variable\":\""+data[i]["time"]+"\",\"value\":\""+data[i]["value"][tmpValue]+"\"}`])
        var obj = new Object();
         obj.group = getRoadNameById(data[i]["id"][tmpId]).toString();
         obj.variable  = tmpTime
         obj.value = data[i]["value"][tmpValue].toString();
         // var jsonString= JSON.stringify(obj);
        myData.push(obj)
      }
}
 // console.log(data[i]["time"]) 
 // console.log(data[i]["value"])
// for (const property in data[i]) {
//   console.log(`${property["id"]}: ${data[i][property]}`);
// }
  

}
console.log(myVars)
myVars=myVars.reverse()
console.log(myVars)
console.log(myData)
//console.log(myData)
    // Labels of row and columns
// var myGroups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
// var myVars = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"]

// Build X scales and axis:
var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(myGroups)
  .padding(0.01);
// svg.append("g")
//   .attr("transform", "translate(0," + height + ")")
//   .call(d3.axisBottom(x))
//     .styles({
//       fill:"none",
//       stroke:"white",
//       "stroke-width":"1"
//     })
var margin=[]
margin.bottom=120
margin.top=20
margin.left=40
margin.right=5


d3.select("#my_dataviz").select("svg").remove();
  svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
  svg.append("g")
      // .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")  
        .style("text-anchor", "end")
        .style("stroke", "white")
        .style("font-size", "12px")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");




// Build X scales and axis:
var y = d3.scaleBand()
  .range([ height, 0 ])
  .domain(myVars)
  .padding(0.01);
svg.append("g")
  .call(d3.axisLeft(y))
        .selectAll("text")  
        .style("text-anchor", "end")
        .style("stroke", "white")
        .style("font-size", "10px")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        // .attr("transform", "rotate(-65)");
  // .style("font-size", "10px")
  //    .styles({
  //     fill:"none",
  //     stroke:"white",
  //     "stroke-width":"1"
  //   });

// Build color scale
var myColor = d3.scaleLinear()
    .domain([0, 50, 100])
    .range(["white", "pink", "red"]);
  // .range(["white", "#e01919"])
  // .domain([0,100])

//Read the data
// d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv", function(data) {
//  console.log(data)
  
  svg.selectAll()
      .data(myData, function(d) {return d.group+':'+d.variable;})
      .enter()
      .append("rect")
      .attr("x", function(d) { return x(d.group) })
      .attr("y", function(d) { return y(d.variable) })
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return myColor(d.value)} )

// })




      },jsonPath);
}








function updateData(type,array,data,th1,th2,th3,th4,number)
{
  var counter=0
  var counter2=0
  if(array.length>0)
  {
    //console.log(array)
    for (var i = 0; i <data.length; i++)
     {
       var findMatch=false
         for (var j = 0; j <array.length; j++)
          {
            if(type=="intersection")
            {
              if(array[j][array[j].length-1].intersection==data[i].intersection)
              {

                if(array[j][array[j].length-1]._id!=data[i]._id )
                {
                  if(array[j].length>=number)
                  {
                    array[j].shift()
                  }
                  array[j].push(data[i])
                }
                var color=updateColor(type,data[i],th1,th2)
                if(color=="red")
                {
                  counter+=1
                  var severeCrashColor=updateSevereColor(type,data[i],th3,th4)
                  if(severeCrashColor=="red")
                  {
                    counter2+=1
                  }
                }

                break;
              }
            }
            else {
              if(array[j][array[j].length-1].allId1==data[i].allId1)
              {
                                if(array[j][array[j].length-1]._id!=data[i]._id )
                                {
                                  if(array[j].length>=number)
                                  {
                                    array[j].shift()
                                    //console.log("shift")
                                  }
                                  array[j].push(data[i])
                                  //console.log("push data")
                                }
                                else
                                {
                                //  console.log("old data")

                                }
                                var color=updateColor(type,data[i],th1,th2)
                                if(color=="red")
                                {
                                  counter+=1
                                  var severeCrashColor=updateSevereColor(type,data[i],th3,th4)
                                  if(severeCrashColor=="red")
                                  {
                                    counter2+=1
                                  }
                                }
                                break;

              }
            }
          }
       }
       //console.log("old array data")
  }
  else
  {
    for (var i = 0; i <data.length; i++)
     {
       array.push([])
       array[array.length-1].push(data[i])
        var color=updateColor(type,data[i],th1,th2)
        if(color=="red")
        {
          counter+=1
          var severeCrashColor=updateSevereColor(type,data[i],th3,th4)
          if(severeCrashColor=="red")
          {
            counter2+=1
          }
        }

     }
  }
    //console.log(counter)
  return [counter,counter2]
}
function updateSecondaryCrash()
{
    weavingUpdated=false
    secondaryEventRedCount=0
    secondaryPredRedCount=0
    secondaryPred=removeEvent(secondaryPred)
    secondaryEvent=removeEvent(secondaryEvent)

    var jsonPath="http://10.32.93.91:8085/secondaryCrash/getDataInMinutes/1"
    queryData(function(json) {
    // console.log("==============================")
    //console.log(weavingRedCount)
    var data=JSON.parse(json);
    // console.log(data)
       for (var i = 0; i <data.length; i++)
     {
      var tmpSecondaryEvent = {crashSeverity:data[i]["eventType"],crashtime:data[i]["createdDate"],segmentId:data[i]["segmentId"],secondary:data[i]["secondary"],crashRisk:data[i]["crashRisk"],event:data[i]["event"], lon:data[i]["longitude"],lat:data[i]["latitude"],name:data[i]["name"],rank:data[i]["rank"],mark:null, icon:null};
      var tmpSecondaryPred = {crashSeverity:data[i]["eventType"],crashtime:data[i]["createdDate"],segmentId:data[i]["segmentId"],secondary:data[i]["secondary"],crashRisk:data[i]["crashRisk"],event:data[i]["event"], lon:data[i]["longitude"],lat:data[i]["latitude"],name:data[i]["name"],rank:data[i]["rank"],mark:null, icon:null};
    
      // console.log(i)
      // console.log(tmpSecondary.name)
      if(tmpSecondaryEvent.event >0 && tmpSecondaryPred.secondary >0){
      tmpSecondaryEvent.icon={
          url: "./img/icon/BasedonCrashEvents.png"      ,// url
          scaledSize: new google.maps.Size(30, 40), // scaled size
          // origin: new google.maps.Point(0,0), // origin
          // anchor: new google.maps.Point(30, 30) // anchor
      };
          var center = new google.maps.LatLng(tmpSecondaryEvent.lat, tmpSecondaryEvent.lon);
          var tmpMarket= new google.maps.Marker({
                map: map,
                draggable: false,
                icon:tmpSecondaryEvent.icon,
          
                position: center,
                visible:secondaryEventVisible,
                title:tmpSecondaryEvent.segmentId.toString()
              });
              
        // var infowindow=null
              // google.maps.event.addListener(tmpMarket,"click",function(event) {
              //   var location = event.latLng
              //     // var rowElem = document.getElementById('row'+polynum);
              //     // if (rowElem) rowElem.style.backgroundColor = "#FFFA5E";
                  
              //       var content=tmpMarket.title
              //       console.log(content)
                    
              //      selectedIntersectionId=null
              //      selectedRoadId=parseInt(tmpMarket.title)
              //      selectedbusId=null
              //      openNav2()
              //      closeNav3()
              //      updateChart(displayDataNumeber)
              //      busSource=null

              //     })
        tmpSecondaryEvent.mark=tmpMarket

        secondaryEventRedCount+=1
        secondaryEvent.push(tmpSecondaryEvent)

      }
         if(tmpSecondaryPred.secondary >0){
          tmpSecondaryPred.icon={
          url: "./img/icon/BasedonPredictedCrashes.png"      ,// url
          scaledSize: new google.maps.Size(30, 40), // scaled size
          // origin: new google.maps.Point(0,0), // origin
          // anchor: new google.maps.Point(30, 30) // anchor
      };
          var center = new google.maps.LatLng(tmpSecondaryPred.lat, tmpSecondaryPred.lon);
          var tmpMarket= new google.maps.Marker({
                map: map,
                draggable: false,
                icon:tmpSecondaryPred.icon,
          
                position: center,
                visible:secondaryPredVisible,
                title:tmpSecondaryPred.segmentId.toString()
              });
              
        // var infowindow=null
              // google.maps.event.addListener(tmpMarket,"click",function(event) {
              //   var location = event.latLng
              //     // var rowElem = document.getElementById('row'+polynum);
              //     // if (rowElem) rowElem.style.backgroundColor = "#FFFA5E";
                  
              //       var content=tmpMarket.title
              //       console.log(content)
                    
              //      selectedIntersectionId=null
              //      selectedRoadId=parseInt(tmpMarket.title)
              //      selectedbusId=null
              //      openNav2()
              //      closeNav3()
              //      updateChart(displayDataNumeber)
              //      busSource=null

              //     })
        tmpSecondaryPred.mark=tmpMarket

          secondaryPredRedCount+=1
        secondaryPred.push(tmpSecondaryPred)
      }
     }
    for (var j = 0; j <secondaryPred.length; j++)
     {
      var marker = secondaryPred[j].mark;
      var infoWindow = new google.maps.InfoWindow();
       google.maps.event.addListener(marker,"click",function(event)
       {
         var content;
         content =this.getTitle()
        selectedRoadId=parseInt(content)
        openNav2()
         closeNav3()
         updateChart(displayDataNumeber)
         getSecondaryCCTVData(selectedRoadId)
         
         moveToLocation("freeway",selectedRoadId)
         try {
                getHeatMap(selectedRoadId)
              }
              catch(err) {
                console.log("no heatmap")
              }
         
            
       });
      }
    for (var j = 0; j <secondaryEvent.length; j++)
     {
      var marker = secondaryEvent[j].mark;
      var infoWindow = new google.maps.InfoWindow();
       google.maps.event.addListener(marker,"click",function(event)
       {
         var content;
         content =this.getTitle()
     
        selectedRoadId=parseInt(content)
        openNav2()
         closeNav3()
         updateChart(displayDataNumeber)
         getSecondaryCCTVData(selectedRoadId)

         moveToLocation("freeway",selectedRoadId)
                              try {
                getHeatMap(selectedRoadId)
              }
              catch(err) {
                console.log("no heatmap")
              }
       });
      }

     document.getElementById('info-CrashEvent').textContent =secondaryEventRedCount
     document.getElementById('info-CrashPredicted').textContent =secondaryPredRedCount
     updateEventRank(secondaryEvent)
     updatePredRank(secondaryPred)

 
    //weavingUpdated=true
    },jsonPath);
}



function getTop3Array(data){
  if(data.length==0)
  {
    return []
  }
  var TmpArray=[1000,1000,1000]

  for (var j = 0; j <data.length; j++)
  {






     if(data[j].rank<TmpArray[0])
     {
      TmpArray[0]=data[j]
     }
     else if(data[j].rank<TmpArray[1])
     {
      TmpArray[1]=data[j]
     }
    else if(data[j].rank<TmpArray[2])
     {
      TmpArray[2]=data[j]
     }




  }
  return TmpArray.reverse()

}
function updateEventRank(data)
{
  

  var TmpArray=getTop3Array(data)
  darwEventRankChart(TmpArray)
}

function updatePredRank(data)
{
  var TmpArray=getTop3Array(data)
  darwPredRankChart(TmpArray)
}


function updateEvent()
{
    crashEvent=removeEvent(crashEvent)
    disableVehicle=removeEvent(disableVehicle)
    debrisOnRoadway=removeEvent(debrisOnRoadway)
    abandonedVehicle=removeEvent(abandonedVehicle)
    congestion=removeEvent(congestion)
    scheduledRoadWork=removeEvent(scheduledRoadWork)
    otherEvent=removeEvent(otherEvent)
    var jsonPath="http://10.32.93.91:8085/eventCCTV/getDataInMinutes/1"
    //var jsonPath="http://128.199.8.128/eventCCTV/many"
    queryData(function(json) {
    var data=JSON.parse(json);

      // console.log(data)
       for (var i = 0; i <data.length; i++)
     {
      if(data[i]["typeDesc"] !=undefined){
       var tmpLat=   data[i]["latitude"].toString() 
       var tmpLon=   data[i]["longitude"].toString()
       var tmpCarmaInfo=data[i]["cameras"]
      var tmpEvent = {type:data[i]["typeDesc"],lat:tmpLat, lon:tmpLon,mark:null, icon:null};

        var content=""
              content ="<h5>"+data[i]["typeDesc"]+"</h5>";
              content +="<p>source:"+data[i]["source"]+"</p>";
              content +="<p>start:"+data[i]["startTimestamp"]+"</p>";
              content +="<p>update:"+data[i]["updateTimestamp"]+"</p>";
              if(tmpCarmaInfo.length>0)
              {

                for (var j = 0; j <tmpCarmaInfo.length; j++) {

                      try{
                           content +="<img src="+tmpCarmaInfo[j].snapshot_path+" height=\"300\" width=\"400\">" + "<br/>";
                        }
                         catch(err) {
                              console.log(err)
                              }
                      }

             

              }
              else
                {
                  content +="<p>no camera</p>" + "<br/>";
                }







      switch(data[i]["typeDesc"]) {
        case "Disabled Vehicle":
                tmpEvent.icon={
          url: "./img/icon/Disable_Vehicle.png"      ,// url
          scaledSize: new google.maps.Size(30, 40), // scaled size
          // origin: new google.maps.Point(0,0), // origin
          // anchor: new google.maps.Point(0, 0) // anchor
      };
          var center = new google.maps.LatLng(tmpEvent.lat, tmpEvent.lon);
          tmpEvent.mark = new google.maps.Marker({
                map: map,
                draggable: false,
                icon:tmpEvent.icon,
          
                position: center,
                visible:disableVehicleVisible,
                title:content
              });
                var infoWindow = new google.maps.InfoWindow();
       google.maps.event.addListener(tmpEvent.mark ,"click",function(event)
       {
          var obj = this.getTitle();
         var content;
         content=obj
         infoWindow.setContent(content);
               infoWindow.setPosition(event.latLng);
               infoWindow.open(map);
       });
          disableVehicle.push(tmpEvent)
          break;
        case "Crash":
              tmpEvent.icon={
          url: "./img/icon/2nd_Crash_Event.png"      ,// url
          scaledSize: new google.maps.Size(30, 40), // scaled size
          // origin: new google.maps.Point(0,0), // origin
          // anchor: new google.maps.Point(30, 30) // anchor
      };
          var center = new google.maps.LatLng(tmpEvent.lat, tmpEvent.lon);
          tmpEvent.mark = new google.maps.Marker({
                map: map,
                draggable: false,
                icon:tmpEvent.icon,
         
                position: center,
                visible:crashEventVisible,
                title:content
              });

       var infoWindow = new google.maps.InfoWindow();
       google.maps.event.addListener(tmpEvent.mark ,"click",function(event)
       {
        console.log("click")
          var obj = this.getTitle();

         console.log(obj)
         infoWindow.setContent(obj);
        infoWindow.setPosition(event.latLng);
        infoWindow.open(map);
           });
          crashEvent.push(tmpEvent)
          break;

        case "Abandoned Vehicle":
        tmpEvent.icon={
          url: "./img/icon/Abandon_Car.png"       ,// url
          scaledSize: new google.maps.Size(30, 40), // scaled size
          // origin: new google.maps.Point(0,0), // origin
          // anchor: new google.maps.Point(30, 30) // anchor
      };
          var center = new google.maps.LatLng(tmpEvent.lat, tmpEvent.lon);
          tmpEvent.mark = new google.maps.Marker({
                map: map,
                draggable: false,
                icon:tmpEvent.icon,
          
                position: center,
                visible:abandonedVehicleVisible,
                title:content
              });
                          var infoWindow = new google.maps.InfoWindow();
       google.maps.event.addListener(tmpEvent.mark ,"click",function(event)
       {
          var obj = this.getTitle();
         var content;
         content=obj
         infoWindow.setContent(content);
               infoWindow.setPosition(event.latLng);
               infoWindow.open(map);
            });

          abandonedVehicle.push(tmpEvent)
          break;
        case "Road Work Scheduled":
    
        tmpEvent.icon={
          url: "./img/icon/Schedule_Road_work.png",// url
          scaledSize: new google.maps.Size(30, 40), // scaled size
          // origin: new google.maps.Point(0,0), // origin
          // anchor: new google.maps.Point(30, 30) // anchor
      };
          var center = new google.maps.LatLng(tmpEvent.lat, tmpEvent.lon);
          tmpEvent.mark = new google.maps.Marker({
                map: map,
                draggable: false,
                icon:tmpEvent.icon,
                position: center,
                visible:scheduledRoadWorkVisible,
                title:content
              });
                          var infoWindow = new google.maps.InfoWindow();
       google.maps.event.addListener(tmpEvent.mark ,"click",function(event)
       {
          var obj = this.getTitle();
         var content;
         content=obj
         infoWindow.setContent(content);
               infoWindow.setPosition(event.latLng);
               infoWindow.open(map);
            });

          scheduledRoadWork.push(tmpEvent)
          break;
        case "Congestion":
        tmpEvent.icon={
          url: "./img/icon/Congestion.png",// url
          scaledSize: new google.maps.Size(30, 40), // scaled size
          // origin: new google.maps.Point(0,0), // origin
          // anchor: new google.maps.Point(30, 30) // anchor
      };
          var center = new google.maps.LatLng(tmpEvent.lat, tmpEvent.lon);
          tmpEvent.mark = new google.maps.Marker({
                map: map,
                draggable: false,
                icon:tmpEvent.icon,
           
                position: center,
                visible:congestionVisible,
                title:content
              });
                          var infoWindow = new google.maps.InfoWindow();
       google.maps.event.addListener(tmpEvent.mark ,"click",function(event)
       {
          var obj = this.getTitle();
         var content;
         content=obj
         infoWindow.setContent(content);
               infoWindow.setPosition(event.latLng);
               infoWindow.open(map);
             });

          congestion.push(tmpEvent)
          break;
        case "Debris on Roadway":
        tmpEvent.icon={
          url: "./img/icon/Debris_On_Road.png",// url
          scaledSize: new google.maps.Size(30, 40), // scaled size
          // origin: new google.maps.Point(0,0), // origin
          // anchor: new google.maps.Point(0, 0) // anchor
      };
          var center = new google.maps.LatLng(tmpEvent.lat, tmpEvent.lon);
          tmpEvent.mark = new google.maps.Marker({
                map: map,
                draggable: false,
                icon:tmpEvent.icon,
              
                position: center,
                visible:debrisOnRoadwayVisible,
                title:content
              });
                          var infoWindow = new google.maps.InfoWindow();
       google.maps.event.addListener(tmpEvent.mark ,"click",function(event)
       {
          var obj = this.getTitle();
         var content;
         content=obj
         infoWindow.setContent(content);
               infoWindow.setPosition(event.latLng);
               infoWindow.open(map);
             });

          debrisOnRoadway.push(tmpEvent)
          break;
        default:
        tmpEvent.icon={
          url: "./img/icon/severecrash.png",// url
          scaledSize: new google.maps.Size(30, 40), // scaled size
          // origin: new google.maps.Point(0,0), // origin
          // anchor: new google.maps.Point(30, 30) // anchor
      };

        var center = new google.maps.LatLng(tmpEvent.lat, tmpEvent.lon);
          tmpEvent.mark = new google.maps.Marker({
                map: map,
                draggable: false,
                icon:tmpEvent.icon,
           
                position: center,
                visible:otherEventVisible,
                title:content
              });


                var infoWindow = new google.maps.InfoWindow();
       google.maps.event.addListener(tmpEvent.mark ,"click",function(event)
       {
          var obj = this.getTitle();
         var content;
         content=obj
         infoWindow.setContent(content);
               infoWindow.setPosition(event.latLng);
               infoWindow.open(map);
            

  });


        otherEvent.push(tmpEvent)
          // code block
      }
      }
     }
    // console.log(data)
    //weavingUpdated=true
    },jsonPath);
}




function displayEvent(type)
{
  for (var j = 0; j <type.length; j++)
  {
    type[j].mark.setVisible(true)
  }
}
function hideEvent(type)
{
  for (var j = 0; j <type.length; j++)
  {
    type[j].mark.setVisible(false)
  }
}
function removeEvent(type)
{
    for (var j = 0; j <type.length; j++)
  {
    type[j].mark.setMap(null)
  }
  return []
}
// function DrawEvent(data)
// {
//   for (var i = 0; i < data.length; i++)
//       {


//       google.maps.event.addListener(data.mark,"click",function(event) {
//                 var location = event.latLng

//                   })
//     }
// }










function updateWeaving(number)
{
    weavingUpdated=false
    var jsonPath="http://10.32.93.91:8085/weaving/getData/31"
    queryData(function(json) {
    //console.log("==============================")
    //console.log(weavingRedCount)
    var data=JSON.parse(json);
    var redCount=updateData("weaving",weavingArray,data,weavingRiskThreshold1,weavingRiskThreshold2,weavingSevereRiskThreshold1,weavingSevereRiskThreshold2,number)
    weavingRedCount=redCount[0]
    weavingSevereRedCount=redCount[1]
    //console.log("===========//////////==============")
    //console.log(weavingRedCount)
    weavingUpdated=true
    },jsonPath);
}
function updateArterial(number)
{
    arterialUpdated=false
    var jsonPath="hhttp://10.32.93.91:8085/arterial/getData/1367"
    queryData(function(json) {
    var data=JSON.parse(json);
    redCount=updateData("arterial",arterialArray,data,arterialRiskThreshold1,arterialRiskThreshold2,arterialSevereRiskThreshold1,arterialSevereRiskThreshold2,number)
    arterialRedCount=redCount[0]
    arterialSevereRedCount=redCount[1]
    arterialUpdated=true
    },jsonPath);
}
function updateRamp(number)
{
    rampUpdated=false
    var jsonPath="http://10.32.93.91:8085/ramp/getData/294"
    queryData(function(json) {
    var data=JSON.parse(json);
    var redCount=updateData("ramp",rampArray,data,rampRiskThreshold1,rampRiskThreshold2,rampSevereRiskThreshold1,rampSevereRiskThreshold2,number);
    rampRedCount=redCount[0]
    rampSevereRedCount=redCount[1]
    rampUpdated=true
    },jsonPath);
}
function updateBasic(number)
{
    basicUpdated=false
    var jsonPath="http://10.32.93.91:8085/basic/getData/938"
    queryData(function(json) {
    var data=JSON.parse(json);
    var redCount=updateData("basic",basicArray,data,basicRiskThreshold1,basicRiskThreshold2,basicSevereRiskThreshold1,basicSevereRiskThreshold2,number)
    basicRedCount=redCount[0]
    basicSevereRedCount=redCount[1]
    basicUpdated=true
    },jsonPath);
}
function updateColor(type,data,th1,th2)
{
  var color="green"
   if(type=="intersection")
  {
    var objectId=data.intersection
    var risk=data.crashRisk
    if(risk>=th1)
    {
      color="red"
      //console.log(type+"red")
    }
    else if(risk<=th2)
    {
      color="green"
    }
    else {
      color="yellow"
    }

    changePolyColor(intersection,objectId,color)
  }
  else {
    var objectId=data.allId1
    var index=data.allId1-1
    var risk=data.crashRisk
    // if(type=="arterial")
    // {

      if(objectId>=1 && objectId<=1367)
      {
            color="off"
            console.log("color off ")
      }
      else
      {
              if(risk>=th1)
            {
              color="red"
              // arterialRedCount+=1
            }
            else if(risk<=th2)
            {
              color="green"
            }
            else {
              color="yellow"
            }
      }



  changeLineColor(baseMap,index,objectId,color)
  }
  return color
}




function updateSevereColor(type,data,th1,th2)
{
  var color="green"
   if(type=="intersection")
  {
    var objectId=data.intersection
    var risk=data.severeCrashRisk
    if(risk>=th1)
    {
      color="red"
      plotSevereMakerOnMap(type,objectId)

    }
    else if(risk<=th2)
    {
      color="green"
    }
    else {
      color="yellow"
    }

    //changePolyColor(intersection,objectId,color)
  }
  else {
    var objectId=data.allId1
    var index=data.allId1-1
    var risk=data.severeCrashRisk
    // if(type=="arterial")
    // {
      if(risk>=th1)
      {
        color="red"
        plotSevereMakerOnMap(type,objectId)
        // arterialRedCount+=1
      }
      else if(risk<=th2)
      {
        color="green"
      }
      else {
        color="yellow"
      }


  //changeLineColor(baseMap,index,objectId,color)
  }
  return color
}

var severeMakerArray=[]
function plotSevereMakerOnMap(type,id)
{


  if($('#crashCheckBox:checked').val()=="")
  {
  //showCamera=true
  //displaySevereCrash()
  var displaySevereCrash=true
   //console.log("displaySevereCrash displaySevereCrash")
  // console.log(showCamera)
  }
  else
  {
    var displaySevereCrash=false
      //showCamera=false
      //hideSevereCrash()
      // console.log("showCamera showCamera")
      // console.log(showCamera)
  }
  var infowindow=null
    if(type=="intersection")
    {
      var geoXmlDoc = intersection.docs[0];

    }
    else {
      var geoXmlDoc = baseMap.docs[0];
  }
  //console.log(geoXmlDoc)
      for (var i = 0; i < geoXmlDoc.placemarks.length; i++)
      {
        //geoXmlDoc.placemarks[i].polyline.setOptions(option);
        if(geoXmlDoc.placemarks[i].name==id)
        {
        //  console.log(geoXmlDoc.placemarks[i].name)


        var icon = {
          url: "./img/icon/severecrash.png",// url
          scaledSize: new google.maps.Size(30, 40), // scaled size
          // origin: new google.maps.Point(0,0), // origin
          // anchor: new google.maps.Point(30, 30) // anchor
      };



          if(type=="intersection")
          {
            var lat=geoXmlDoc.placemarks[i].polygon.bounds.getCenter().lat()
            var lon=geoXmlDoc.placemarks[i].polygon.bounds.getCenter().lng()
            	  var center = new google.maps.LatLng(lat, lon);
            var severeMarker = new google.maps.Marker({
              map: map,
              icon:icon,
              draggable: false,
              animation: google.maps.Animation.BOUNCE,
              position: center,
              visible:displaySevereCrash,
              title:id.toString()
            });

            google.maps.event.addListener(severeMarker,"click",function(event) {
              var location = event.latLng
                // var rowElem = document.getElementById('row'+polynum);
                // if (rowElem) rowElem.style.backgroundColor = "#FFFA5E";
                  var content=severeMarker.title
                 //  infowindow = new google.maps.InfoWindow({
                 //     content: content,
                 //     position: location
                 //   });
                 // infowindow.open(map);

                 selectedIntersectionId=parseInt(severeMarker.title)
                 selectedRoadId=null
                 selectedbusId=null
                 openNav2()
                 closeNav3()
                 busSource=null
                 severeTag=true
                 updateChart(displayDataNumeber)

                 // document.getElementById('info-selectedRoad').textContent +="(High severe crash risk)"
                })



          }
          else {
            var lat=geoXmlDoc.placemarks[i].polyline.bounds.getCenter().lat()
              var lon=geoXmlDoc.placemarks[i].polyline.bounds.getCenter().lng()
              	  var center = new google.maps.LatLng(lat, lon);
              var severeMarker = new google.maps.Marker({
                map: map,
                draggable: false,
                icon:icon,
                animation: google.maps.Animation.BOUNCE,
                position: center,
                visible:displaySevereCrash,
                title:id.toString()
              });

              google.maps.event.addListener(severeMarker,"click",function(event) {
                var location = event.latLng
                  // var rowElem = document.getElementById('row'+polynum);
                  // if (rowElem) rowElem.style.backgroundColor = "#FFFA5E";
                    var content=severeMarker.title
                   //  infowindow = new google.maps.InfoWindow({
                   //     content: content,
                   //     position: location
                   //   });
                   // infowindow.open(map);
                   selectedIntersectionId=null
                   selectedRoadId=parseInt(severeMarker.title)
                   selectedbusId=null
                   openNav2()
                   closeNav3()
                   busSource=null
                    severeTag=true
                   updateChart(displayDataNumeber)


                  })
          }
          // console.log(lat)
          // console.log(lon)



      // // using global variable:

          severeMakerArray.push(severeMarker)
        }
      }
}



function displaySevereCrash()
{
  for (var j = 0; j <severeMakerArray.length; j++)
  {
    severeMakerArray[j].setVisible(true)
  }
}

function hideSevereCrash()
{
  for (var j = 0; j <severeMakerArray.length; j++)
  {
    severeMakerArray[j].setVisible(false)
  }
}







function getSevereCount()
{
  return rampSevereRedCount+basicSevereRedCount+weavingSevereRedCount+intersectionSevereRedCount+arterialSevereRedCount
}



function plotRampRisk(id)
{
  drawRiskChart()
}
function plotBasicRisk(id)
{
  drawRiskChart()
}
function plotBasicRisk(id)
{
  drawRiskChart()
}
function plotWeaingRisk(id)
{
  drawRiskChart()
}
function getFreewayCount()
{
  return rampRedCount+basicRedCount+weavingRedCount
}
function getBasicCount()
{
  return basicRedCount
}
function getRampCount()
{
  return rampRedCount
}
function getWeavingCount()
{
  return weavingRedCount
}
function getArterialCount()
{
  return arterialRedCount
}
function getIntersectionCount()
{
  return intersectionRedCount
}
function getRoadDataById(id,array)
{
  for (var j = 0; j <array.length; j++)
   {
     if(array[j][0].allId1==id)
     {
       return array[j]
     }
   }
  return array
}
function getIntersectionDataById(id,array)
{
  console.log(array)
  for (var j = 0; j <array.length; j++)
   {
     if(array[j][0].intersection==id)
     {
       return array[j]
     }
   }
  return null
}

function updateChart(number)
{
  //console.log(number)
  // dataArray=[]
  // initAllbus()
  // drawArterialChart()
  // drawFreewayChart()

  var link = document.getElementById('crashInfoZone');
    link.style.display = 'none';


  var link = document.getElementById('crashInfoRisk');
    link.style.display = 'inline';

  // document.getElementById('info-crashTime').textContent =""
  // document.getElementById('info-crashSeverity').textContent =""
  getCrashFromID(secondaryPred,selectedRoadId)
  // console.log(tmpSecondaryEventData)
   // if(tmpSecondaryPredData.length>0)
   // {
   //  console.log(tmpSecondaryPredData)

   // }
 getCrashFromID(secondaryEvent,selectedRoadId)
  // console.log(tmpSecondaryEventData)
  //  if(tmpSecondaryEventData.length>0)
  //  {
  //   console.log(tmpSecondaryEventData)

  //  }


  if(selectedRoadId!=null || selectedIntersectionId!=null || selectedbusId!=null)
  {

    if(selectedbusId!=null)
    {
      selectedRoadType="bus"

      //document.getElementById('info-selectedRoad').textContent =selectedbusId
      return

    }
    else if(selectedIntersectionId!=null)
    {
      selectedRoadType="intersection"
      document.getElementById('info-selectedRoad').textContent =selectedRoadType+" : "+getIntersrctionNameById(selectedIntersectionId)
      if(severeTag)
      {
          document.getElementById('info-selectedRoad').textContent +="(High severe crash risk)"
      }

      // if(intersectionArray.length>=number)
      // {
      //   console.log("----------------")
      //     dataArray=getIntersectionDataById(selectedIntersectionId,intersectionArray)
      // }
      // else {
        getDataById(dataArray,selectedRoadType,selectedIntersectionId,number)
        return
      // }
    }
    else if(selectedRoadId<=1367)
    {
      //var tmpArray=getPatmById(selectedRoadId)
      selectedRoadType="arterial"
      document.getElementById('info-selectedRoad').textContent ="Arterial : "+getRoadNameById(selectedRoadId)
      if(severeTag)
      {
          document.getElementById('info-selectedRoad').textContent +="(High severe crash risk)"
      }
      getDataById(dataArray,selectedRoadType,selectedRoadId,number)

      return

        //console.log(arterialArray)
    }
    else if(selectedRoadId<=2305&&selectedRoadId>=1368)
    {
      //var tmpArray=getPatmById(selectedRoadId)
      selectedRoadType="basic"
      document.getElementById('info-selectedRoad').textContent ="Basic : "+getRoadNameById(selectedRoadId)
      if(severeTag)
      {
          document.getElementById('info-selectedRoad').textContent +="(High severe crash risk)"
      }
      getDataById(dataArray,selectedRoadType,selectedRoadId,number)
      return
              //console.log(basicArray)
    }
    else if(selectedRoadId<=2336&&selectedRoadId>=2306)
    {
      //var tmpArray=getPatmById(selectedRoadId)
      selectedRoadType="weaving"
      // dataArray=getRoadDataById(selectedRoadId,weavingArray)
      // document.getElementById('info-selectedRoad').textContent =selectedRoadType+" : "+selectedRoadId
      document.getElementById('info-selectedRoad').textContent ="Weaving : "+getRoadNameById(selectedRoadId)
      if(severeTag)
      {
          document.getElementById('info-selectedRoad').textContent +="(High severe crash risk)"
      }
      getDataById(dataArray,selectedRoadType,selectedRoadId,number)
      return
        //console.log(weavingArray)
    }
    else if(selectedRoadId<=2630&&selectedRoadId>=2337)
    {

      selectedRoadType="ramp"
      document.getElementById('info-selectedRoad').textContent ="Ramp : "+getRoadNameById(selectedRoadId)
      if(severeTag)
      {
          document.getElementById('info-selectedRoad').textContent +="(High severe crash risk)"
      }
      getDataById(dataArray,selectedRoadType,selectedRoadId,number)
      return
      // dataArray=getRoadDataById(selectedRoadId,rampArray)
      // document.getElementById('info-selectedRoad').textContent =selectedRoadType+" : "+selectedRoadId
      //console.log(rampArray)
    }
    else {
      //var tmpArray=getPatmById(selectedRoadId)
      selectedRoadType="wrong Road Id"
      selectedRoadId=null
      document.getElementById('info-selectedRoad').textContent =selectedRoadType+" : "+getRoadNameById(selectedRoadId)

    }











//console.log(selectedRoadType)
    //console.log(dataArray)
 //drawOnChart(selectedRoadType,dataArray)

  }
  else {
    document.getElementById('info-selectedRoad').textContent ="Please select"
  }

}


function getCrashFromID(data,id)
{


  for (var j = 0; j <data.length; j++)
  {
     
    if(data[j].segmentId==id)

    {
      console.log("find match")
      console.log(data[j])
        var link = document.getElementById('crashInfoZone');
    link.style.display = 'inline';
          var link = document.getElementById('crashInfoRisk');
    link.style.display = 'none';
      // document.getElementById('info-crashTime').textContent ="Crash Time:"+data[j]["crashtime"]
      // document.getElementById('info-crashSeverity').textContent ="Severity  :"+data[j]["crashSeverity"]
        //d3.selectAll("#my_dataviz").remove();

        // getHeatMap()
      return data[j]
    }
  }
  return []

}
function findTopFive(array)
{
  var top1=array[0]
  var top2=array[0]
  var top3=array[0]
  // var top4=array[0]
  // var top5=array[0]
  var tmpArray=[]
  for (var j = 0; j <array.length; j++)
   {
     //console.log(array[j][array[j].length-1].crashRisk)
     //console.log(top1[top1.length-1].crashRisk)
     // var number=array[j].length-1
     // if(nu
     if(array[j][array[j].length-1].crashRisk>top1[top1.length-1].crashRisk)
     {
       top1=array[j]
     }
     else if(array[j][array[j].length-1].crashRisk>top2[top2.length-1].crashRisk)
     {
        top2=array[j]
     }
     else if(array[j][array[j].length-1].crashRisk>top3[top3.length-1].crashRisk)
     {
        top3=array[j]
     }
     // else if(array[j][array[j].length-1].crashRisk>top4[top4.length-1].crashRisk)
     // {
     //    top4=array[j]
     // }
     // else if(array[j][array[j].length-1].crashRisk>top5[top5.length-1].crashRisk)
     // {
     //    top5=array[j]
     // }
   }
   tmpArray.push(top1)
   tmpArray.push(top2)
   tmpArray.push(top3)
   // tmpArray.push(top4)
   // tmpArray.push(top5)

  return tmpArray
}
function updateRank()
{
  console.log("update rank")
  //updateTopFiveArterialChart()
  updateTopFiveBasicChart()
  updateTopFiveWeavingChart()
  updateTopFiveRampChart()
  //updateTopFiveIntersectionChart()
}
function updateTopFiveArterialChart()
{
  var top5array=findTopFive(arterialArray)
  drawArterialChart(top5array)
}
function updateTopFiveIntersectionChart()
{
  var top5array=findTopFive(intersectionArray)
  drawIntersectionChart(top5array)
}

function updateTopFiveBasicChart()
{
  var top5basic=findTopFive(basicArray)
  //console.log(top5basic)
  drawBasicChart(top5basic)
}
function updateTopFiveWeavingChart()
{
  var top5weaving=findTopFive(weavingArray)
  //console.log(top5weaving)
  drawWeavingChart(top5weaving)
}

function updateTopFiveRampChart()
{
  var top5ramp=findTopFive(rampArray)
  //console.log(top5ramp)
  drawRampChart(top5ramp)
}





function moveToLocation(type,id)
{
  var highlightOptionsRed=getHighlightOptionsRed()
  var highlightLineOptions =getHighLightLineOption()
  var highlightPolygonOptions=getHighlightPolygonOption()
  var highlightLineOptionsOff =getHighlightLineOptionsOff()
  var highlightPolygonOptionsOff =getHighlightPolygonOptionsOff();
//  c//onsole.log(id)
  var tmpArray=[]
  if(type=="intersection")
  {
    var geoXmlDoc = intersection.docs[0];

  }
  else {
    var geoXmlDoc = baseMap.docs[0];
}
//console.log(geoXmlDoc)
    for (var i = 0; i < geoXmlDoc.placemarks.length; i++)
    {
      //geoXmlDoc.placemarks[i].polyline.setOptions(option);
      if(geoXmlDoc.placemarks[i].name==id)
      {
      //  console.log(geoXmlDoc.placemarks[i].name)

        if(type=="intersection")
        {
          var lat=geoXmlDoc.placemarks[i].polygon.bounds.getCenter().lat()
          var lon=geoXmlDoc.placemarks[i].polygon.bounds.getCenter().lng()
          geoXmlDoc.placemarks[i].polygon.setOptions(highlightPolygonOptions);
          selectedIntersectionId=id
          selectedRoadId=null
          selectedbusId=null
        }
        else {
          var lat=geoXmlDoc.placemarks[i].polyline.bounds.getCenter().lat()
            var lon=geoXmlDoc.placemarks[i].polyline.bounds.getCenter().lng()
            geoXmlDoc.placemarks[i].polyline.setOptions(highlightLineOptions);
            selectedIntersectionId=null
            selectedRoadId=id
            selectedbusId=null
        }
        // console.log(lat)
        // console.log(lon)

	  var center = new google.maps.LatLng(lat, lon);
    // // using global variable:
     map.panTo(center);
      map.setZoom(17);

      }
    }
}
function drawOnChart(type,array)
{
  drawRiskChart(type,array)
  drawSpeedChart(type,array)
  drawVloumeChart(type,array)
}
function getDataById(array,type,id,number)
{
  var jsonPath="http://10.32.93.91:8085/"+type+"/getDataById/"+id.toString()+"/"+number
  queryData(function(json) {
  var data=JSON.parse(json);
  array=[]
  for (var i = 0; i <data.length; i++)
   {
     array.push(data[i])
   }
   drawOnChart(type,array.reverse())
     var d1 = new Date(array[array.length-1].currTimestamp );
   document.getElementById('info-timeStamp').textContent ="Current Data Feeds: "+String(d1.getHours()).padStart(2, '0')+":"+String(d1.getMinutes()).padStart(2, '0')

  var d2 = new Date ( );
      d2.setMinutes ( d1.getMinutes() + 5 );
      d2.setSeconds ( d1.getSeconds()  );
      var d3 = new Date ( );
          d3.setMinutes ( d1.getMinutes() + 10 );
            d3.setSeconds ( d1.getSeconds()  );
  document.getElementById('info-timeStamp2').textContent ="Prediction Period: "+String(d2.getHours()).padStart(2, '0')+":"+String(d2.getMinutes()).padStart(2, '0')+"-"+String(d3.getHours()).padStart(2, '0')+":"+String(d3.getMinutes()).padStart(2, '0')



   var color=getStatusById(type,id)

// if(type=="intersection"||type=="arterial"||color!="red")
// {
//    //document.getElementById('info-patm').textContent ="PATM strategy is not needed "
//    document.getElementById("patmbt").style.display = "none";
//    document.getElementById('info-img').innerHTML = ""
//   document.getElementById('info-patmSubset').innerHTML = ""
//      return
// }



//    var tmpArray=getPatmById(id)

//  // console.log("-----------------------------------------------------")
//  // console.log(id)
// document.getElementById('info-patmSubset').textContent=""
// document.getElementById('info-patm').textContent ="loading "
 // if(tmpArray==null)
 // {
 //     document.getElementById('info-patm').textContent ="PATM strategy recommendations are generating ..."
 //     document.getElementById("patmbt").style.display = "none";
 //        document.getElementById('info-img').innerHTML = ""
 //          document.getElementById('info-patmSubset').innerHTML = ""
 // }
 // else
 // {
 //   document.getElementById("patmbt").style.display = "";

 //   if(selectedRoadId!=null)
 //   {
 //     document.getElementById('info-patm-video-title').textContent=selectedRoadType+" : "+getRoadNameById(selectedRoadId)
 //   }
 //   else {
 //     document.getElementById('info-patmSubset').textContent="no vide"

 //   }


 //    console.log(tmpArray.recommendations)
 //    var allRecommendations=tmpArray.recommendations
 //    var tablestart="<table id='myTable' border=2>";
 //    var tableend = "</table>";
 //    var trstart = "<tr>";
 //    var trend = "</tr>";
 //    var tdstart = "<td>";
 //    var tdend = "</td>";
 //    var contentCell = "";
 //    var video = document.getElementById('info-patm-video');
 //    var source = document.createElement('source');
 //   for (var j = 0; j <allRecommendations.length; j++)
 //    {
 //      if(allRecommendations[j].allId1==-1)
 //      {
 //          document.getElementById('info-patm').textContent ="PATM strategy recommendation: "+allRecommendations[j].recommendation
 //          if (allRecommendations[j].recommendation == "Variable Speed Limit & Queue Warning") {
 //              document.getElementById('info-img').innerHTML = '<img src="/img/realTimeMap/VariableSpeedLimit_QueueWarning.png" style="width: 280px;">'
 //              source.setAttribute('src', 'http://smartsafesst.com/data/patm/	VariableSpeedLimit_QueueWarning.mp4');



 //          }

 //          if (allRecommendations[j].recommendation == "Ramp Metering") {
 //              document.getElementById('info-img').innerHTML = '<img src="/img/realTimeMap/RampMetering.png" style="width: 280px;">'
 //              source.setAttribute('src', 'http://smartsafesst.com/data/patm/RampMetering.mp4');
 //          }

 //          if (allRecommendations[j].recommendation == "Variable Speed Limit & Ramp Metering & Queue Warning") {
 //              document.getElementById('info-img').innerHTML = '<img src="/img/realTimeMap/VariableSpeedLimit_RampMetering_QueueWarning.png" style="width: 280px;">'
 //              source.setAttribute('src', 'http://smartsafesst.com/data/patm/VariableSpeedLimit_RampMetering_QueueWarning.mp4	');
 //          }

 //          if (allRecommendations[j].recommendation == "Variable Speed Limit & Ramp Metering") {
 //              document.getElementById('info-img').innerHTML = '<img src="/img/realTimeMap/VariableSpeedLimit_RampMetering.png" style="width: 280px;">'
 //              source.setAttribute('src', 'http://smartsafesst.com/data/patm/VariableSpeedLimit_RampMetering.mp4	');
 //          }

 //          if (allRecommendations[j].recommendation == "Variable Speed Limit") {
 //              document.getElementById('info-img').innerHTML = '<img src="/img/realTimeMap/VariableSpeedLimit.png" style="width: 280px;">'
 //              source.setAttribute('src', 'http://smartsafesst.com/data/patm/VariableSpeedLimit.mp4	');
 //          }
 //          if(selectedRoadType=="weaving")
 //          {
 //            source.setAttribute('src', 'http://smartsafesst.com/data/patm/	Weaving.mp4	');
 //          }
 //          video.appendChild(source);
 //          video.play();
 //      }
 //      else {
 //         // document.getElementById('info-patmSubset').textContent+=allRecommendations[j].allId1+":"+allRecommendations[j].recommendation+"\r\n "
 //         contentCell += trstart + tdstart + getRoadNameById(allRecommendations[j].allId1) + tdend + tdstart + allRecommendations[j].recommendation + tdend + trend
 //      }
 //    }

 //    document.getElementById('info-patmSubset').innerHTML = tablestart + contentCell + tableend;



 // }




  dataArray=array
  },jsonPath);
}

function getWeatherData()
{
  var jsonPath="https://api.openweathermap.org/data/2.5/weather?q=Orlando,US&appid=709e7c9577b9c150410952bb03bbfef5"
  queryData(function(json) {
  var data=JSON.parse(json);
  // console.log(data)
  document.getElementById('info-weather').textContent ="Weather: "+data.weather[0].main+" | Visibility: "+Math.round((data.visibility/1609.34) * 100) / 100+" miles"
  },jsonPath);

}
