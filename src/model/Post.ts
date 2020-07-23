export class Post {
    constructor(
        private id: string, 
        private photo: string, 
        private description: string,
        private type: string, 
        private id_user: string
    ) {};

    getId(): string {
        return this.id;
    };

    getPhoto(): string {
        return this.photo;
    };

    getDescription(): string {
        return this.description;
    };

    getType(): string {
        return this.type;
    };

    getIdUser(): string {
        return this.id_user;
    };

    setId(id: string): string {
        return this.id = id;
    };

    setPhoto(photo: string): string {
        return this.photo = photo;
    };

    setDescription(description: string): string {
        return this.description = description;
    };

    setType(type: string): string {
        return this.type = type;
    };

    setIdUser(id_user: string): string {
        return this.id_user = id_user;
    };
};

export interface CreatePostDTO {
    photo: string,
    description: string,
    type: string
};

export interface GetByTypeDTO {
    id: string,
    photo: string,
    description: string,
    type: string,
    createdAt: Date,
    id_user: string
};