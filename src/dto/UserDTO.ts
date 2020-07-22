export interface SignupInputDTO {
    name: string,
    email: string,
    password: string,
    role: string
}

export interface GetUserByIdInputDTO {
id: string
}