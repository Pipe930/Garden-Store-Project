import { Injectable } from '@nestjs/common';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';

@Injectable()
export class PasswordService {

    /**
     * 
     * @param string $password 
     * @returns string
     * 
     * @description Funcion de encriptacion de contraseñas
     */
    public passwordEncrypted(password: string): string{
        return hashSync(password, genSaltSync());
    }

    /**
     * 
     * @param string $password 
     * @param string $passwordHash 
     * @returns boolean
     * 
     * @description Funcion de comparacion de contraseñas
     */
    public checkPassword(password: string, passwordHash: string): boolean{
        return compareSync(password, passwordHash);
    }
}
