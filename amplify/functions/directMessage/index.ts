import { APIGatewayProxyHandler } from "aws-lambda";
import { createMessage, getMessages } from "./services/messageService";
import { createConversation, getConversations } from "./services/conversationService";
import { successResponse, errorResponse } from "./utils/response";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { operation, payload } = JSON.parse(event.body || "{}");

    switch (operation) {
      case "createConversation":
        return successResponse(await createConversation(payload));
      case "getConversations":
        return successResponse(await getConversations(payload.userId));
      case "createMessage":
        return successResponse(await createMessage(payload));
      case "getMessages":
        return successResponse(await getMessages(payload.conversationId));
      default:
        return errorResponse("Unsupported operation", 400);
    }
  } catch (error) {
    console.error("Error:", error);
    return errorResponse("Internal Server Error", 500);
  }
};