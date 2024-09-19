import { BadRequestException, Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { TokenActivation } from '../models/token.model';
import { join } from 'path';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { v4 } from 'uuid';

@Injectable()
export class OtherFunctionsService {
    
    private resend: Resend;

    constructor(private readonly configService: ConfigService){
        this.resend = new Resend(configService.get("apiKeyResend"));
    }

    public loadTemplate(templatePath: string, replacements: { [key: string]: string }): string {

        const template = readFileSync(templatePath, 'utf8');
        return Object.keys(replacements).reduce(
            (updatedTemplate, key) => updatedTemplate.replace(new RegExp(`{{${key}}}`, 'g'), replacements[key]),
            template
        );
    }
    
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
    
    public async sendEmail(tokenActivation: TokenActivation, email: string, type: string){

        let templatePath: string;
        let htmlContent: string;

        if(type === "activationAcctount") {

            templatePath = join(__dirname, '..', '..', 'templates', 'activateAccount.html');

            htmlContent = this.loadTemplate(templatePath, {
                activation_link: `${this.configService.get('domainUrl')}activation/${tokenActivation.uuid}/${tokenActivation.token}`,
                privacy_policy_link: '',
                terms_link: ''
            });
        }
        
        if(type === "resetPassword") {
            templatePath = join(__dirname, '..', '..', 'templates', 'resetPassword.html');

            htmlContent = this.loadTemplate(templatePath, {
                reset_password_link: `${this.configService.get('domainUrl')}forgot-password/confirm/${tokenActivation.uuid}/${tokenActivation.token}`,
                privacy_policy_link: '',
                terms_link: ''
            });
        };
    
        try {

            const { data, error } = await this.resend.emails.send({
                from: "Acme <onboarding@resend.dev>",
                to: [email],
                subject: "Activacion de Cuenta",
                html: htmlContent,
            });
        
            if(error) throw new BadRequestException("El correo no se envio correctamente");
    
        } catch (error) {
    
            throw new BadRequestException('No se pudo enviar el correo de activación');
        }
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
