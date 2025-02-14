import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Stack } from "aws-cdk-lib";

/**
 * Utility function to create an IAM policy for API Gateway invoke permissions.
 * @param stack - The CDK stack.
 * @param restApi - The API Gateway instance.
 * @param paths - An array of resource paths (e.g., ["/geo", "/contact", "/chat"]).
 * @param stage - The API stage name.
 * @returns The created IAM Policy.
 */
export function createApiPolicy(
  stack: Stack,
  restApi: RestApi,
  paths: string[],
  stage: string
) {
  const resources = paths.flatMap((path) => [
    restApi.arnForExecuteApi("*", path, stage),
    restApi.arnForExecuteApi("*", `${path}/*`, stage),
  ]);
  return new Policy(stack, "RestApiPolicy", {
    statements: [
      new PolicyStatement({
        actions: ["execute-api:Invoke"],
        resources,
      }),
    ],
  });
}