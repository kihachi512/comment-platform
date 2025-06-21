"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// pages/api/posts.ts
var posts_exports = {};
__export(posts_exports, {
  default: () => handler
});
module.exports = __toCommonJS(posts_exports);
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var import_util_dynamodb = require("@aws-sdk/util-dynamodb");
var client = new import_client_dynamodb.DynamoDBClient({ region: "ap-northeast-1" });
async function handler(req, res) {
  try {
    const result = await client.send(new import_client_dynamodb.ScanCommand({ TableName: "Posts" }));
    const items = result.Items?.map((item) => (0, import_util_dynamodb.unmarshall)(item));
    res.status(200).json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F" });
  }
}
//# sourceMappingURL=posts.js.map
