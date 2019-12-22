console.log('Iniciando function de criar produto');

var AWS = require('aws-sdk');
var dynamo = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');

exports.handler = function(event, context, callback){
    const params = {
      Item: {
            id:uuid.v1(),
            product_name:event.product_name,
            manufacter:event.manufacter,
            image:event.image,
            description:event.description
        },
      TableName: 'Products'
    };
  
    dynamo.put(params, function(err,data){
        if(err) {
            callback(err, null)
        }else{
            const response = { 
               'status':200, 
               'mensagem':'Produto criado com sucesso!', 
          }
            callback(null, response)
        }
    });

};