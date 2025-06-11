
const successResponse = (res, data = [], message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    status : 1,
    message,
    data
  });
};


const errorResponse = (res, message = "Something went wrong", statusCode = 500, error = null) => {
  return res.status(statusCode).json({
    status : 0,
    message,
    error: typeof error === "object" ? JSON.stringify(error, null, 2) : error
  });
};

module.exports = {
  successResponse,
  errorResponse
};
