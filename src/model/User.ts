

export class User{
    constructor(
        private id: string,
        private name: string,
        private email: string,
        private password: string
    ) {};

    getId() :string{
        return this.id;
    }
    
    getName(): string{
        return this.name;
    }

    getEmail(): string{
        return this.email;
    }

    getPassword(): string{
        return this.password;
    }

    setId(id: string): void{
        this.id = id;
    }
    
    setName(name: string): void{
        this.name = name;
    }

    setEmail(email: string): void{
        this.email = email;
    }

    setPassword(password: string): void{
        this.password = password;
    }
   
}

export interface CreateUserDTO {
    name: string,
    email: string,
    password: string
};

export interface GetFeedDTO {
    id: string,
    photo: string,
    description: string,
    type: string,
    createdAt: Date,
    id_user: string
}