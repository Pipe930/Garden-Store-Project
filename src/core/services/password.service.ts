import { Injectable } from '@nestjs/common';
import { hash, genSalt, compare } from 'bcrypt';

@Injectable()
export class PasswordService {

    async passwordEncrypted(password: string): Promise<string>{
        const genSaltNumber = await genSalt();
        return await hash(password, genSaltNumber);
    }

    async checkPassword(password: string, passwordHash: string): Promise<boolean>{
        return await compare(password, passwordHash);
    }
}
