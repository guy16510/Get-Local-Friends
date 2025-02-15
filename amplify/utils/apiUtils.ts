import {
    RestApi,
    LambdaIntegration,
    AuthorizationType,
    CognitoUserPoolsAuthorizer,
    MethodOptions,
  } from "aws-cdk-lib/aws-apigateway";
  
  /**
   * Utility function to build API Gateway responses in Lambda functions.
   */
  export const buildResponse = (statusCode: number, body: any) => {
    return {
      statusCode,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify(body),
    };
  };
  
  /**
   * Utility to add an endpoint to a RestApi with common configuration.
   */
  export function addEndpoint(
    api: RestApi,
    path: string,
    lambdaIntegration: LambdaIntegration,
    methods: string[],
    options?: {
      authorizationType?: AuthorizationType;
      authorizer?: CognitoUserPoolsAuthorizer;
    }
  ) {
    const resource = api.root.addResource(path);
    methods.forEach((method) => {
      const methodOptions: MethodOptions = {
        authorizationType: options?.authorizationType || AuthorizationType.NONE,
        authorizer: options?.authorizer,
      };
      resource.addMethod(method, lambdaIntegration, methodOptions);
    });
    return resource;
  }

  