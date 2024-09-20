import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { v4 } from 'uuid';

@Injectable()
export class TokenService {

    constructor(private readonly configService: ConfigService){}
    
    public getUuidToken(): string {
    
        const listLetters = ['m', 'n', 'q', 'g', 'l', 'k'];
        let token = '';
        
        for (let i = 0; i < 2; i++) {

            const randomIndex = Math.floor(Math.random() * listLetters.length);
            let letter = listLetters[randomIndex];
        
            if (Math.random() > 0.5) {
            letter = letter.toUpperCase();
            }
        
            token += letter;
        }
        
        return token;
    }

    public async encryptedString():Promise<string>{

        const iv = randomBytes(16);
        const key = (await promisify(scrypt)(this.configService.get("keyCrypto"), 'salt', 32)) as Buffer;
        const cipher = createCipheriv('aes-256-cbc', key, iv);

        const encryptedText = Buffer.concat([
            cipher.update(v4()),
            cipher.final(),
        ]);
        
        return encryptedText.toString('hex');
    }
}
