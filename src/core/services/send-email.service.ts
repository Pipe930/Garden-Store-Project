import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Resend } from 'resend';
import { TokenActivation } from '../models/token.model';

@Injectable()
export class SendEmailService {

    private resend: Resend;

    constructor(private readonly configService: ConfigService){
        this.resend = new Resend(configService.get("apiKeyResend"));
    }

    private loadTemplate(templatePath: string, replacements: { [key: string]: string }): string {

        const template = readFileSync(templatePath, 'utf8');
        return Object.keys(replacements).reduce(
            (updatedTemplate, key) => updatedTemplate.replace(new RegExp(`{{${key}}}`, 'g'), replacements[key]),
            template
        );
    }

    public async sendEmail(tokenActivation: TokenActivation, email: string, type: string): Promise<void>{

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
}
