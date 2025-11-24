/// <reference path="./.sst/platform/config.d.ts" />


export default $config({
    app(input) {
        return {
            name: "pastebin",
            removal: input?.stage === "production" ? "retain" : "remove",
            home: "aws",
        };
    },
    async run() {
        const commonEnv = {
            NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
            NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
            SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
            // Add other shared env vars here
        };

        const api = new sst.aws.Function("Api", {
            handler: "apps/api/src/lambda.handler",
            url: true,
            environment: {
                ...commonEnv,
                // API specific env vars
                PORT: "3001",
            },
            nodejs: {
                install: ["@nestjs/microservices", "@nestjs/websockets"], // Exclude if not needed, or include criticals
            }
        });

        const web = new sst.aws.Nextjs("Web", {
            path: "apps/web",
            environment: {
                ...commonEnv,
                NEXT_PUBLIC_API_URL: api.url,
            },
        });

        const docs = new sst.aws.Nextjs("Docs", {
            path: "apps/docs",
        });

        const raw = new sst.aws.Nextjs("Raw", {
            path: "apps/raw",
            environment: {
                ...commonEnv,
                NEXT_PUBLIC_API_URL: api.url,
            },
        });

        return {
            ApiUrl: api.url,
            WebUrl: web.url,
            DocsUrl: docs.url,
            RawUrl: raw.url,
        };
    },
});
