exports.handler = function(event, context, callback) {        
    
    const facebookToken = event.headers.auth;
    const appId = process.env.APP_ID;
    const appSecret = process.env.APP_SECRET;
    var url = 'https://graph.facebook.com/debug_token?input_token='+facebookToken+'&access_token='+ appId +'|'+ appSecret;
    
    var https = require('https');
    var userId = null;
 
    https.get(url, (res) => {
       res.on('data', (d) => {
           var json = JSON.parse(d);
           var isValid = json.data.is_valid;
           userId = json.data.user_id;
 
           if(isValid === true){
                 callback(null, generateAllow(userId, event.methodArn));
           }else{
                 callback(null,generateDeny(userId, event.methodArn));
           }
       });
     }).on('error', (e) => {
          callback(null,generateDeny(userId, event.methodArn));
     });
 }
      
 var generatePolicy = function(principalId, effect, resource) {
     var authResponse = {};
     authResponse.principalId = principalId;
     if (effect && resource) {
         var policyDocument = {};
         policyDocument.Version = '2012-10-17'; 
         policyDocument.Statement = [];
         var statementOne = {};
         statementOne.Action = 'execute-api:Invoke'; 
         statementOne.Effect = effect;
         statementOne.Resource = resource;
         policyDocument.Statement[0] = statementOne;
         authResponse.policyDocument = policyDocument;
     }
     
     return authResponse;
 }
      
 var generateAllow = function(principalId, resource) {
     return generatePolicy(principalId, 'Allow', resource);
 }
      
 var generateDeny = function(principalId, resource) {
     return generatePolicy(principalId, 'Deny', resource);
 }