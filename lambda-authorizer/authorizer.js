const SOME_SECRET_CODE = 'some-secret-code';

export default function (event, context, callback) {
  console.log('Received event:', JSON.stringify(event, null, 2));

  // A simple REQUEST authorizer example to demonstrate how to use request
  // parameters to allow or deny a request. In this example, a request is
  // authorized if the client-supplied auth header, login query parameter
  // in the request context all match
  // specified values of 'secret-code-1234', 'true' respectively.

  // Retrieve request parameters from the Lambda function input:
  const headers = event.headers;
  const queryStringParameters = event.queryStringParameters;
  const pathParameters = event.pathParameters;
  const stageconstiables = event.stageconstiables;
  const requestContext = event.requestContext;

  // Parse the input for the parameter values
  const tmp = event.methodArn.split(':');
  const apiGatewayArnTmp = tmp[5].split('/');
  const awsAccountId = tmp[4];
  const region = tmp[3];
  const restApiId = apiGatewayArnTmp[0];
  const stage = apiGatewayArnTmp[1];
  const method = apiGatewayArnTmp[2];
  let resource = '/'; // root resource
  if (apiGatewayArnTmp[3]) {
    resource += apiGatewayArnTmp[3];
  }

  // Perform authorization to return the Allow policy for correct parameters and
  // the 'Unauthorized' error, otherwise.
  const authResponse = {};
  const condition = {};
  condition.IpAddress = {};

  if (headers.auth === SOME_SECRET_CODE && queryStringParameters.login === 'true') {
    callback(null, generateAllow('me', event.methodArn));
  } else {
    callback('Unauthorized');
  }
}

// Help function to generate an IAM policy
const generatePolicy = (principalId, effect, resource) => {

  // Required output:
  const authResponse = {};

  authResponse.principalId = principalId;

  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17'; // default version
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke'; // default action
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  // Optional output with custom properties of the String, Number or Boolean type.
  authResponse.context = {
    'stringKey': 'stringval',
    'numberKey': 123,
    'booleanKey': true,
  };

  return authResponse;
};

const generateAllow = (principalId, resource) => generatePolicy(principalId, 'Allow', resource);

const generateDeny = (principalId, resource) => generatePolicy(principalId, 'Deny', resource);
