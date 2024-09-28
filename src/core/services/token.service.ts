import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createCipheriv, randomBytes, scrypt, randomUUID } from 'crypto';
import { RefreshToken } from 'src/modules/users/models/token.model';
import { User } from 'src/modules/users/models/user.model';
import { promisify } from 'util';
@Injectable()
export class TokenService {

    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ){}
    
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
            cipher.update(randomUUID()),
            cipher.final(),
        ]);
        
        return encryptedText.toString('hex');
    }

    public async generateTokenJWT(user: User): Promise<any> {

        try {
            const payload = { idUser: user.idUser, active: user.active, role: user.rolesUser.filter((role) => role.name === "cliente")[0].name };
            const accessToken = this.jwtService.sign(payload);
            const refreshToken = this.jwtService.sign(payload, { expiresIn: "1d" });
    
            await this.storeRefreshToken(refreshToken, user.idUser);

            return {
                accessToken,
                refreshToken
            };
        } catch (error) {

            throw new BadRequestException("Error al generar el token");
        }

        
    }

    public async storeRefreshToken(refreshToken: string, idUser: number): Promise<void> {

        const refreshTokenExists = await RefreshToken.findByPk(idUser);

        if(refreshTokenExists) await refreshTokenExists.destroy();

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 1);

        await RefreshToken.create({
            token: refreshToken,
            expiryDate,
            idRefreshToken: idUser
        })
        
    }

    
}
