import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { AuthService } from "../auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService
    ) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID'), // Corrected: clientID
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'), // Corrected: clientSecret
            callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'), // Corrected: callbackURL
            scope: ['profile', 'email'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
        const user = await this.authService.validateGoogleUser({
            username: profile.displayName,
            email: profile.emails[0].value,
            password: "",
            provider: 'google'
        });

        done(null, user);
    }
}