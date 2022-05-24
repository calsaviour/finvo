import * as sst from "@serverless-stack/resources";
import { ProjectionType, StreamViewType } from "aws-cdk-lib/aws-dynamodb";

export default class StorageStack extends sst.Stack {
    // Public reference to the table
    usersTable;
    accountsTable;
    transactionsTable;
    photosTable;
    bucket;

    constructor(scope, id, props) {
        super(scope, id, props);

        // Create the DynamoDB table
        this.usersTable = new sst.Table(this, "Users", {
            fields: {
                id: "string",
                email: "string",
                screenName: "string"
            },
            primaryIndex: { partitionKey: "id"},
            globalIndexes: { 
                byScreenName: { 
                    partitionKey: "screenName",
                    projection: "all"
                }
            },
            stream: "new_and_old_images"
        });

        this.accountsTable = new sst.Table(this, "Accounts", {
            fields: {
                id: "string",
                userId: "string"
            },
            primaryIndex: { partitionKey: "id", sortKey: "userId" },
        });

        this.transactionsTable = new sst.Table(this, "Transactions", {
            fields: {
                id: "string",
                accountId: "string",
            },
            primaryIndex: { partitionKey: "id", sortKey: "accountId" },
        });

        this.photosTable = new sst.Table(this, "Photos", {
            fields: {
                id: "string",
                eventId: "string",
            },
            primaryIndex: { partitionKey: "eventId", sortKey: "id" },
        });

        this.bucket = new sst.Bucket(this, "PhotosBucket", {
            cors: [
                {
                    allowedOrigins: ["*"],
                    allowedHeaders: ["*"],
                    allowedMethods: ["PUT"],
                },
            ],
            notifications: {
                s3ProcessUploadedPhoto: {
                    function: {
                        handler: "backend/services/photos/process-uploaded-photo.handler",
                        permissions: [this.bucket, this.photosTable]
                    },
                    events: ["object_created"],
                }
            }
        });
    }
}