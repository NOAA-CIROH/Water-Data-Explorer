/*

************ FUNCTION NAME: SELECT_VARIABLE_CHANGE **********************
************ PURPOSE: SELECT A VARIABLE FROM A DROPDOWN AND CHANGE THE GRAPH ***********
*/

select_variable_change = function(){
  console.log("new change on this");
  console.log(this);
  let arrayTime = [];
  let object_request_variable={};
  let start_date_object =  $('#datetimepicker6').datepicker('getDates')[0];

  let start_date_string = start_date_object.toISOString().split("T")[0]
  let end_date_object = $('#datetimepicker7').datepicker('getDates')[0];

  let end_date_string = end_date_object.toISOString().split("T")[0]


  let chart_type= $("#type_graph_select2")['0'].value;
  let selectedItem = $('#variables_graph')['0'].value;
  let selectedItemText = $('#variables_graph')['0'].text;

  arrayTime.push(start_date_string);
  arrayTime.push(end_date_string);
  // object_request_graphs['timeFrame'] = arrayTime;
  object_request_variable['timeFrame'] = arrayTime;

  // object_request_graphs['actual_method'] = object_request_graphs['methodsIDs'][object_request_graphs['variables_array'][selectedItem-1]];
  object_request_variable['actual_method'] = object_request_graphs['methodsIDs'][object_request_graphs['variables_array'][selectedItem-1]];
  // console.log(object_request_graphs['actual_method']);
  // console.log(object_request_graphs);

  if(chart_type == "Scatter" || chart_type =="Whisker and Box"){
    // $("#type_graph_select")['0'].disabled = false;

    // console.log(selectedItem);

    object_request_graphs['variable']=selectedItem;
    // object_request_variable['variable']=selectedItem;
    // object_request_graphs['code_variable']= codes_variables_array[`${selectedItem}`-1];
    object_request_variable['code_variable']= codes_variables_array[`${selectedItem}`-1];
    object_request_variable['hs_url'] =  object_request_graphs['hs_url'];
    object_request_variable['code'] =  object_request_graphs['code'];
    object_request_variable['network'] =  object_request_graphs['network'];
    // console.log(object_request_graphs);
    console.log(object_request_variable);
    console.log(typeof(selectedItem));

    if(selectedItem !== "0"){
      $("#graphAddLoading").css({left:'50%',bottom:"15%", position:'absolute',"z-index": 9999});
      $("#graphAddLoading").removeClass("hidden");
      $.ajax({
        type:"GET",
        url: `get-values-graph-hs`,
        dataType: "JSON",
        data: object_request_variable,
        success: function(result1){
          console.log(result1);
          if(result1.graphs !== undefined){
            console.log(result1);
            let time_series_array = result1['graphs']['values2'];
            let time_series_array_interpolation = result1['graphs']['interpolation'];
            console.log(time_series_array);

            let x_array = [];
            time_series_array.forEach(function(x){
              x_array.push(x[0]);
            })
            let y_array=[]
            time_series_array.forEach(function(y){
              // console.log(y[1]);
              if(y[1]===-9999){
                y_array.push(null)
              }
              else{
                y_array.push(y[1]);
              }

            })
            let x_array_interpolation = [];
            time_series_array_interpolation.forEach(function(x){
              x_array_interpolation.push(x[0]);
            })
            let y_array_interpolation=[]
            time_series_array_interpolation.forEach(function(y){
              y_array_interpolation.push(y[1]);
            })
            console.log(x_array);
            console.log(y_array);
            let title_graph = `${result1['graphs']['title']}`;
            let units_x = `${result1['graphs']['unit']}` ;
            let units_y = "Time";
            let variable_name_legend = `${result1['graphs']['variable']}`;
            let type= "scatter";
            active_map_feature_graphs['scatter']['x_array'] = x_array;
            active_map_feature_graphs['scatter']['y_array'] = y_array;
            active_map_feature_graphs['scatter']['x_array_interpolation'] = x_array_interpolation;
            active_map_feature_graphs['scatter']['y_array_interpolation'] = y_array_interpolation;
            active_map_feature_graphs['scatter']['title_graph'] = title_graph;
            active_map_feature_graphs['scatter']['units_x'] = units_x;
            active_map_feature_graphs['scatter']['units_y'] = units_y;
            active_map_feature_graphs['scatter']['variable_name_legend'] = variable_name_legend;
            active_map_feature_graphs['scatter']['type'] = type;

            // defining the Whiskers and plot //
            active_map_feature_graphs['whisker']['y_array'] = y_array;
            active_map_feature_graphs['whisker']['title_graph'] = title_graph;
            active_map_feature_graphs['whisker']['type'] = "whisker";

            if(chart_type ==="Scatter"){
              console.log("it is an scatter plot for the variable change");
              initialize_graphs(x_array,y_array,title_graph,units_y, units_x,variable_name_legend,type,x_array_interpolation,y_array_interpolation);
            }
            if(chart_type ==="Whisker and Box"){
              console.log("it is an whisker and box plot for the variable change");

              initialize_graphs(undefined,y_array,title_graph,undefined, undefined,undefined,"whisker");
            }
            $("#graphAddLoading").addClass("hidden")

         }
         else{
           let title_graph=  `${object_request_graphs['site_name']} - ${selectedItemText}
           No Data Available`
           initialize_graphs([],[],title_graph,"","","","scatter");
           $("#graphAddLoading").addClass("hidden")
           $.notify(
               {
                   message: `There is no data for this variable, Sorry`
               },
               {
                   type: "danger",
                   allow_dismiss: true,
                   z_index: 20000,
                   delay: 5000
               }
           )

         }
        }
      })

    }



  }

}
$("#variables_graph").change(select_variable_change);
$("#update_graphs").on("click",select_variable_change);
/*
************ FUNCTION NAME: CHANGE_TYPE_GRAPHS_GROUP **********************
************ PURPOSE: CHANGE THE GRAPHS THAT ARE PART OF THE ***********
*/
change_type_graphs_group = function(){
  // let chart_type= $("#type_graph_select")['0'].value;

  if(chart_type === "Bar"){
    console.log("inside the bar type");
    // $("#variables_graph")['0'].disabled = true;
    $('#variables_graph').selectpicker('setStyle', 'btn-info');


    if(active_map_feature_graphs['bar'].hasOwnProperty('y_array')){
      if(active_map_feature_graphs['bar']['y_array'].length > 0){

        initialize_graphs(active_map_feature_graphs['bar']['x_array'],active_map_feature_graphs['bar']['y_array'],active_map_feature_graphs['bar']['title_graph'],undefined,undefined,undefined,active_map_feature_graphs['bar']['type']);
        console.log("the graph has been change to bar");
      }
    }

    else{
      $.notify(
          {
              message: `Click on one of the hydroserver data points to retrieve a Bar plot`
          },
          {
              type: "danger",
              allow_dismiss: true,
              z_index: 20000,
              delay: 5000
          }
      )


    }

  }

  if(chart_type === "Pie"){
    console.log("inside the pie char");
    // $("#variables_graph")['0'].disabled = true;
    $('#variables_graph').selectpicker('setStyle', 'btn-info');

    if(active_map_feature_graphs['pie'].hasOwnProperty('y_array')){
      if(active_map_feature_graphs['pie']['y_array'].length > 0){

        console.log(active_map_feature_graphs['pie']);
        if (active_map_feature_graphs['pie']['check_none'].includes(true)){
          initialize_graphs(active_map_feature_graphs['pie']['x_array'],active_map_feature_graphs['pie']['y_array'],active_map_feature_graphs['pie']['title_graph'], undefined, undefined, undefined,active_map_feature_graphs['pie']['type']);
          console.log("change to pie chart");

        }
        else{
          initialize_graphs(['no variable has data'],[1],active_map_feature_graphs['pie']['title_graph'], undefined, undefined, undefined,active_map_feature_graphs['pie']['type']);
          console.log("change to pie chart");

        }
      }
    }

    else{
      $.notify(
          {
              message: `Click on one of the hydroserver data points to retrieve a Pie plot`
          },
          {
              type: "danger",
              allow_dismiss: true,
              z_index: 20000,
              delay: 5000
          }
      )


    }

  }

}
// $("#type_graph_select").change(change_type_graphs_group)
// $("#type_graph_select2").change(change_type_graphs_individual)
