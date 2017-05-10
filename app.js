var express = require('express'); 
var bodyParser = require('body-parser'); 

//
//  Global variables 
var app = express();  


// create application/json parser
var jsonParser = bodyParser.json() 
  
// create application/x-www-form-urlencoded parser  
var urlencodedParser = bodyParser.urlencoded({ extended: false })    

app.use(express.static(__dirname + '/public'));  
  
 

//   
//  request initilization   
//   
app.post('/initAlgo',  jsonParser, function(req, res) {   

    if (!req.body) return res.sendStatus(400);  
 
    console.log(' ------- initAlgo request ------- ' ); 

    var name = req.body['username']
    theModel.setModelName( name ); 

    for(var key in req.body.objectives )
    {    
	var obj = req.body.objectives[key] ;
        theModel.setObject( String(key),  parseFloat( obj ) );
        // PASS 
        console.log('     init design objective: ', parseFloat( obj ) );
    }

    for(var key in req.body.designvariables )
    {
        theModel.setVariable( key , parseFloat( req.body.designvariables[key]['value'] ) ) ;
        theModel.setVariableLowerLimit( key ,  parseFloat( req.body.designvariables[key]['lowLimit'] )  ) ;
        theModel.setVariableUpperLimit( key ,  parseFloat( req.body.designvariables[key]['upperLimit'] )  ) ;

        // PASS 
        // console.log( key , parseFloat( req.body.designvariables[key]['value'] ) ) ;
    }


    console.log('             model name: ' + name );
    console.log('      objectives number: ' +  theModel.getObjectsNumber() ); 
    console.log('design variables number: ' +  theModel.getVariablesNumber() ); 
    for(var i = 0; i < theModel.getVariablesNumber(); i++ )
    {
         console.log( 'design variable', i, '=', theModel.getVariable( i ) )
         console.log( '     UpperLimit', '=', theModel.getVariableUpperLimit( i ) )
         console.log( '     LowerLimit', '=', theModel.getVariableLowerLimit( i ) )
    }
    Solver.initialize( theModel ); 

    req.body.isComplete = false;
    res.send( req.body ); 

}); 


//   
//  request update 
//   
app.post('/update',  jsonParser, function(req, res) {    
    if (!req.body) return res.sendStatus(400);  
  
    console.log(' ------- update request ------- ' ); 


    var name = req.body['username']
    console.log('             model name: ' + name );

    console.log('objects: ' + JSON.stringify( req.body.objectives ) );  
    console.log('constraints: ' + JSON.stringify(req.body.constraints) );  
    console.log('designvariables: ' + JSON.stringify(req.body.designvariables) );  
  

    // updating objectives 
    for(var key in req.body.objectives )
    {    
	var obj = req.body.objectives[key] ;
        // 
        console.log('     updated design objective ', parseFloat( obj ) );
        theModel.setObject( String(key),  parseFloat( obj ) );
    }

    Solver.renewModel( theModel ); 

    for(var key in req.body.designvariables )
    {
	var theValue = theModel.getVariable( String(key) );
        //
        console.log('     updated design variable ', key, theValue );
	req.body.designvariables[key]['value'] = theValue ;
    }

   console.log('         Solver.isComplete = ', Solver.isComplete() );        
   req.body.isComplete = Solver.isComplete();

   res.send( req.body );    
});  
 

app.listen(80);  


 
  
 
  
