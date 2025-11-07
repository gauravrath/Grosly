class AppError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
		this.isOperational = true;

		console.log("messagessss", message);

		Error.captureStackTrace(this, this.constructor);
	}
}

catchAsync = (fn) => {
	return (req, res, next) => {
		fn(req, res, next).catch((err) => {
			console.log("errrrorrr", err);

			next(err);
		});
	};
};

export { AppError, catchAsync };
