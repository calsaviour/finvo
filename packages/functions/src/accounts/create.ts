import { Account, AccountDTO } from "@finance-service/core/domain/account";
import { randomUUID } from "crypto";
import { ApiHandler, useJsonBody } from "sst/node/api";
import * as yup from "yup";

const schema = yup.object().shape({
    balance: yup.number(),
    name: yup.string().required(),
    userId: yup.string().required(),
});

export const handler = ApiHandler(async () => {
    try {
        const { userId, balance, name }: AccountDTO = await schema.validate(useJsonBody());
        const account = new Account(randomUUID(), name, userId,  balance!);
        console.log(account);

        await account.save();

        return {
            statusCode: 200,
            body: JSON.stringify(account),
        };
    } catch (error: any) {
        console.error(error);

        return {
            statusCode: error.status || 500,
            body: JSON.stringify({
                message: error.message || 'Internal Server Error',
            }),
        };
    }
});