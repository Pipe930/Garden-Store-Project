import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Resend } from 'resend';
import { TokenActivation } from '../../modules/users/models/token.model';

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

    /**
     * 
     * @param TokenActivation $tokenActivation 
     * @param string $email
     * @param string $type
     * @returns void
     * 
     * @description Envia un correo de activacion de cuenta o recuperar contraseña
     */
    public async sendEmail(tokenActivation: TokenActivation, email: string, type: string): Promise<void>{

        let templatePath: string;
        let htmlContent: string;
        let subject: string;

        if(type === "activationAcctount") {

            templatePath = join(__dirname, '..', '..', 'templates', 'activateAccount.html');

            htmlContent = this.loadTemplate(templatePath, {
                activation_link: `${this.configService.get('domainUrl')}auth/activate/account/${tokenActivation.uuid}/${tokenActivation.token}`,
                privacy_policy_link: '',
                terms_link: ''
            });

            subject = "Activacion de Cuenta";
        }
        
        if(type === "resetPassword") {
            templatePath = join(__dirname, '..', '..', 'templates', 'resetPassword.html');

            htmlContent = this.loadTemplate(templatePath, {
                reset_password_link: `${this.configService.get('domainUrl')}auth/forgot-password/confirm/${tokenActivation.uuid}/${tokenActivation.token}`,
                privacy_policy_link: '',
                terms_link: ''
            });

            subject = "Recuperar Contraseña";
        }
    
        try {
            console.log(htmlContent);
            //const { data, error } = await this.resend.emails.send({
            //    from: "Acme <onboarding@resend.dev>",
            //    to: [email],
            //    subject,
            //    html: htmlContent,
            //});
        
            //if(error) throw new BadRequestException("El correo no se envio correctamente");
    
        } catch (error) {
    
            throw new BadRequestException('No se pudo enviar el correo de activación');
        }
    }

    /**
     * 
     * @param string $email
     * @param string $otp
     * @returns void
     * 
     * @description Envia un correo con el OTP
     */

    public async sendEmailOTP(email: string, otp: string): Promise<void>{

        const templatePath = join(__dirname, '..', '..', 'templates', 'sendOPT.html');

        const htmlContent = this.loadTemplate(templatePath, {
            verification_code: otp,
            privacy_policy_link: '',
            terms_link: ''
        });

        const subject = "Verificar Correo";

        try {

            console.log(htmlContent);

            //const { data, error } = await this.resend.emails.send({
            //    from: "Acme <onboarding@resend.dev>",
            //    to: [email],
            //    subject,
            //    html: htmlContent,
            //});
        
            //if(error) throw new BadRequestException("El correo no se envio correctamente");
        } catch (error) {
            throw new BadRequestException('No se pudo enviar el correo de activación');
        }
    }
}
