console.log('Iniciando function de login');

const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
    const { username, password } = await JSON.parse(event.body);
    if (username && password) {
         const dynamo = await new AWS.DynamoDB.DocumentClient();

        try{
            const params = buildQueryParams(username);
            const result = await dynamo.get(params).promise();
            
            if(result.Item){
               if(bcrypt.compareSync(password, result.Item.password)) {
                    const token = jwt.sign({ username }, 'SECRET', {
                        expiresIn: 1200 // 
                    });
                    return buildAuthResponse(token);
                } else {
                    return buildResponse(403, 'Usuário/Senha inválidos');
                }
            } else {
                return buildResponse(200, 'Usuário não encontrado!');
            }

        } catch(error) {
            return buildResponse(500, 'Houve um erro ao realizar o login!');
        }    
    } else {
          return buildResponse(500, "Informe os parâmetros para o login");
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

function buildAuthResponse(token) {
    
    const body = {
        token: token
    };
    
    const response = {
        statusCode: 200,
        body:JSON.stringify(body)
    };
    return response;
}


