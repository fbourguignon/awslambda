console.log('Iniciando function de listar os produtos');

var AWS = require('aws-sdk');
var dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context, callback){
    
    const query = event.query;
    var params = null;
    
    if(query != null && query != ""){
        params = { 
          ExpressionAttributeValues: {
            ':query':query 
          },
          KeyConditionExpression: 'product_name = :query',
          FilterExpression: 'contains (product_name, :query)',
          TableName: 'Products',
        }
    } else {
         params = { TableName: 'Products',};
    }
  
    return dynamo.scan(params, (error, data) => {
      if (error) {
        callback(error);
      }
      callback(error, data.Items);
    });
};