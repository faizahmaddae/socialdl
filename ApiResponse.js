class ApiResponse {
    static success(res, message = "Success", data = {}) {
      res.status(200).json({
        status: "success",
        message,
        data,
      });
    }
  
    static error(res, message = "Error", statusCode = 400) {
      res.status(statusCode).json({
        status: "error",
        message,
      });
    }
  
    static notFound(res, message = "Not Found") {
      this.error(res, message, 404);
    }
  
    static internalServerError(res, message = "Internal Server Error") {
      this.error(res, message, 500);
    }
  }
  
  module.exports = ApiResponse;
  