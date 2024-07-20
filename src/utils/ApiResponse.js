class ApiResponse {
    constructor(statusCode,data,message = "Sucess"){
        this.statusCode = statusCode,
        this.data = data,
        this.message = message,
        this.success = statusCode < 400
    }
}

export {ApiResponse}

//memo mein sabh kuch hota hai jo companies mein hota hai