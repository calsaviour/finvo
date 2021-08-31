import { v4 as uuid } from 'uuid';
import middleware from '../../../libs/middleware';
import dynamoDb from '../../../libs/dynamodb';
import { Responses } from '../../../libs/response';
import createError from 'http-errors';
import { validateField } from '../../../libs/validateField';

const createUser = async (event, context) => {

    const { username, email, password } = event.body;

    const usernameIsValid = await validateField({
        table: process.env.USERS_TABLE,
        column: "username",
        field: username
    });

    if(usernameIsValid) {
        throw new createError.Conflict(`The "${username}" already exists`);
    }

    const emailIsValid = await validateField({
        table: process.env.USERS_TABLE,
        column: "email",
        field: email
    });

    if(emailIsValid) {
        throw new createError.Conflict(`The "${email}" already exists`);
    }

    const user = {
        id: uuid(),
        username,
        email,
        password
    };

    try {
        await dynamoDb.put({
            TableName: process.env.USERS_TABLE,
            Item: user
        });
        return Responses.OK(user);
    } catch (error) {
        Responses.InternalServerError(error);
    }
};

export const handler = middleware(createUser);