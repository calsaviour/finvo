import { v4 as uuid } from 'uuid';
import middleware from '../../../libs/middleware';
import dynamoDb from '../../../libs/dynamodb';
import { Responses } from '../../../libs/response';
import { getAccountById } from '../../accounts/handlers/retrieve';
import { updateAmountAndBuildAccountForUpdate } from '../../accounts/handlers/update';

async function createTransaction(event) {

    const { amount, accountId, type, date = new Date().toISOString().split('T')[0], comment, userId } = event.body;

    let account = await getAccountById(accountId, userId);

    const transaction = {
        id: uuid(),
        amount,
        accountId,
        type,
        date,
        comment,
        userId
    };

    try {
        await dynamoDb.put({
            TableName: process.env.TRANSACTIONS_TABLE,
            Item: transaction
        });

        await updateAmountAndBuildAccountForUpdate(transaction, account);

        Responses.OK(transaction);
    } catch (error) {
        Responses.InternalServerError(error);
    }
}

export const handler = middleware(createTransaction);