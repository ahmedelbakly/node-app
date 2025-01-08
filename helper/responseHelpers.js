// Success Response
export const successResponse = (res, message, data = {}, statusCode = 200) => {
    return res.status(statusCode).json({ success: true, message, data });
  };
  
  // Error Response
  export const errorResponse = (res, message, statusCode = 400) => {
    return res.status(statusCode).json({ success: false, message });
  };

  