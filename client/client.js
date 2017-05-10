const http = require('http');  
  
function theObj( xList )
{
    var  theMass = (parseFloat(xList[0]) - 4) * (2 * parseFloat(xList[0]) - 1) + xList[1];
    return theMass
}

var x = [ 0.1, 1.1 ];
var OBJECTIVE = theObj( x );

var optModel = 
{   
        "username":"andy",   
        "objectives": {'obj_1':OBJECTIVE },   
        "constraints":{},  
        "designvariables": { 'var_1': { 'lowLimit': 0.0, 'upperLimit': 10.0, 'value': x[0] },
                             'var_2': { 'lowLimit': 0.0, 'upperLimit': 10.0, 'value': x[1] },
                            },
        "isComplete":false,    
} 

 
function update()  
{  
    console.log(' ------- update  ------- ' ); 
    console.log( ' OBJECTIVE ',  OBJECTIVE );

    var postData = JSON.stringify( optModel );

    var headers = {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    };

    var options = {    
        method: "POST",    
        host: "localhost",    
        port: 80,    
        path: "/update",    
        headers: headers   
    };    
    
    var body = '';   
    var request = http.request( options, function(res) {    
        // show results    
        console.log('STATUS: ' + res.statusCode);      
        res.setEncoding('utf8');    
        res.on('data', function(chunk) {    
            body += chunk;  
		
            var jsonData =  JSON.parse(body);	

            var x = []
            for(var key in jsonData.designvariables )
            {       
                 console.log( 'variable ', key,  parseFloat( jsonData.designvariables[key]['value'] )  ); 
                 x.push(  parseFloat( jsonData.designvariables[key]['value'] ) );
            }

            OBJECTIVE = theObj( x );

            console.log( ' OBJECTIVE ',  OBJECTIVE );

            optModel['objectives']['obj_1'] = parseFloat( OBJECTIVE).toFixed(4);
            headers['Content-Length'] = JSON.stringify( optModel ).length;

            console.log( JSON.stringify( optModel ) );

	    if( Boolean( jsonData.isComplete ) )  
            {
                    console.log( 'Optimization process is complete.');
             }else {
                   update(); 
            }

        });    
    
        res.on('end', function(err) {    
            console.log( ' complete.');    
        });    
    });    
        request.on("error", function(e) {    
            console.log('upload Error: ' + e.message);    
        })    
     
    request.write( postData );  
    request.end();   

}


function initAlgo()  
{ 
    var postData = JSON.stringify( optModel );

    var headers = {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    };

    var options = {    
        method: "POST",    
        host: "localhost",    
        port: 80,    
        path: "/initAlgo",    
        headers: headers   
    };  

    var body = '';   
    var request = http.request( options, function(res) {    
        // show results    
        console.log('STATUS: ' + res.statusCode);      
        res.setEncoding('utf8');    
        res.on('data', function(chunk) {    
            body += chunk;  

            var jsonData = JSON.parse( body );

            for(var key in jsonData )
            {
                 console.log( key, jsonData[key] )
            }
        });    
    
        res.on('end', function(err) {    
            console.log( ' complete.');    
        });    
    });    
        request.on("error", function(e) {    
            console.log('upload Error: ' + e.message);    
        })    
     
    request.write( postData );  
    request.end();  

}


initAlgo(); 

update();



  