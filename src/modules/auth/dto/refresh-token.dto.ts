import { IsJWT, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {

    @IsNotEmpty()
    @IsJWT()
    readonly refreshToken: string;
}
