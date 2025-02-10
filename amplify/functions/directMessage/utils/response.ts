export const successResponse = (data: any, statusCode = 200) => ({
    statusCode,
    body: JSON.stringify({ success: true, data }),
  });
  
  export const errorResponse = (message: string, statusCode = 500) => ({
    statusCode,
    body: JSON.stringify({ success: false, message }),
  });