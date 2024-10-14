import * as bcrypt from 'bcrypt';

export class EncryptService {
    
    private bcryptService = bcrypt; 

    constructor(){}

    async hashPassword(value: string): Promise<string>{
        return this.bcryptService.hashSync(value, 10);
    }

    async comparePassword(value: string, hashed: string): Promise<boolean>{
        try {
            this.bcryptService.compareSync(value, hashed);
            return true;
        } catch (error) {
            return false;
        }
    }
}