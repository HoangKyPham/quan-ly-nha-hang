


export class EntityError extends Error {
    fields : {message : string, field : string}[]
    status : number = 422
    constructor(fields : {message : string, field : string}[]) {
        super("Lỗi xác thực dữ liệu")
        this.fields = fields
    }
}

export class AuthError extends Error {
    status : number = 401
    constructor(message : string) {
        super(message)
    }
}
