class AppError extends Error{
    constructor(message, statusCode){
        super(message);

        this.statusCode = statusCode;
        // Error.AppError(this,this.constuctor)
    }
}

export default AppError;