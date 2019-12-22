const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');

exports.handler = async (event) => {
    
    const { name, mail, password } = await JSON.parse(event.body);

    if (name && mail && password) {
        const dynamo = await new AWS.DynamoDB.DocumentClient();

        try{
            
            const params = await buildQueryParams(mail);
            const result = await dynamo.get(params).promise();
            
            if(result.Item){
                return buildResponse(422, 'O email informado já existe');
            } else {

                const params = await buildInsertParams(name, mail, password);
                const put = await dynamo.put(params).promise();
                return buildResponse(200,"Usuário registrado com sucesso!");
            }
            
        } catch(error) {
            return buildResponse(500,error);
        }    
        
    } else {
       return buildResponse(400, "Informe os parâmetros para o registro");
    }
};

function buildQueryParams(mail) {
    
   const params = {
    TableName: 'Users',
        Key:{
            "mail": mail,
        }
    };
        
    return params;
}

function buildInsertParams(name, mail, password) {
    let hash = bcrypt.hashSync(password, 10);

    const params = {
              Item: {
                    name:name,
                    mail:mail,
                    password: hash
                },
              TableName: 'Users'
    };  
        
    return params;
}


function buildResponse(code, text) {
    
    const body = {
        message: text
    };
    
    const response = {
        statusCode: code,
        body:JSON.stringify(body)
    };
    return response;
}

