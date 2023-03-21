import { Auth, Config, StackContext, use } from "sst/constructs";
import { API } from "./ApiStack";

export function AUTH({ stack }: StackContext) {

    const api = use(API);

    const GOOGLE_CLIENT_ID = new Config.Secret(stack, "GOOGLE_CLIENT_ID");

    const auth = new Auth(stack, "auth", {
        authenticator: {
            handler: "packages/functions/src/auth.handler",
            bind: [api, GOOGLE_CLIENT_ID],
        }
    });

    api.bind([GOOGLE_CLIENT_ID]);

    auth.attach(stack, {
        api: api,
        prefix: "/auth"
    })
}