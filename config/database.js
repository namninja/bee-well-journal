"use strict";
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb+srv://zero-user:zero-user@cluster0-pfvwv.mongodb.net/bee-well-journal?retryWrites=true';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb+srv://zero-user:zero-user@cluster0-pfvwv.mongodb.net/test-bee-well-journal?retryWrites=true';
exports.PORT = process.env.PORT || 8080;
