import { Injectable } from '@nestjs/common';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';

@Injectable()
export class PasswordService {

    public passwordEncrypted(password: string): string{
        return hashSync(password, genSaltSync());
    }

    public checkPassword(password: string, passwordHash: string): boolean{
        return compareSync(password, passwordHash);
    }
}
