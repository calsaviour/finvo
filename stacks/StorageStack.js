import * as sst from "@serverless-stack/resources";

export default class StorageStack extends sst.Stack {
    // Public reference to the table
    table;
    bucket;

    constructor(scope, id, props) {
        super(scope, id, props);

        // Create the DynamoDB table
        const userTable = new sst.Table(this, "Users", {
            billingMode: sst.dynamodb.BillingMode.PAY_PER_REQUEST, // Use on-demand billing mode
            fields: {
                userId: sst.TableFieldType.STRING,
            },
            primaryIndex: { partitionKey: "userId", sortKey: "noteId" },
        });

        // Create an S3 bucket
        this.bucket = new sst.Bucket(this, "Uploads", {
            s3Bucket: {
                // Allow client side access to the bucket from a different domain
                cors: [
                    {
                        maxAge: 3000,
                        allowedOrigins: ["*"],
                        allowedHeaders: ["*"],
                        allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
                    },
                ],
            }
        });
    }
}