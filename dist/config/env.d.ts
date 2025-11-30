export declare const config: {
    port: number;
    nodeEnv: string;
    jwt: {
        secret: string;
        refreshSecret: string;
        expiresIn: string;
        refreshExpiresIn: string;
    };
    cors: {
        origin: string;
    };
    storage: {
        path: string;
        encryptionKey: string;
    };
    email: {
        service: string;
        smtp: {
            host: string | undefined;
            port: number;
            user: string | undefined;
            password: string | undefined;
        };
        from: string;
    };
    sms: {
        twilioAccountSid: string | undefined;
        twilioAuthToken: string | undefined;
        twilioPhoneNumber: string | undefined;
    };
    aws: {
        accessKeyId: string | undefined;
        secretAccessKey: string | undefined;
        region: string;
    };
    gps: {
        verificationRadius: number;
    };
    rateLimit: {
        windowMs: number;
        maxRequests: number;
    };
};
//# sourceMappingURL=env.d.ts.map