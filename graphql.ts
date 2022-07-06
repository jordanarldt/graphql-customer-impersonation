import { Request, Response } from "express";
import https from "https";

type AnyHeaders = {
  [key: string]: string;
};

const graphQLquery = `
query paginateProducts(
  $pageSize: Int = 25
  $cursor: String
) {
  site {
    products (first: $pageSize, after:$cursor) {
      pageInfo {
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          entityId
          name
        }
      }
    }
  }
}`;

export async function graphQLController(req: Request, res: Response) {
  const {
    impersonationToken,
    storeHash,
    channelId,
    customerId,
  } = req.query;

  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": `Bearer ${impersonationToken}`,
    "X-Bc-Customer-Id": customerId,
  } as AnyHeaders;

  const storeChannelUrl = Number(channelId) > 1
    ? `store-${storeHash}-${channelId}.mybigcommerce.com`
    : `store-${storeHash}.mybigcommerce.com`;

  const request = https.request({
    method: "POST",
    headers,
    host: storeChannelUrl,
    path: "/graphql",
    
  }, response => {
    response.setEncoding("utf-8");

    const chunks: string[] = [];

    // Listen for the data stream
    response.on("data", chunk => {
      chunks.push(chunk);
    });

    response.on("end", () => {
      const parsed = JSON.parse(chunks.join(""));
      res.json(parsed);
    });
  });

  // Write the body to the request to send it
  request.write(JSON.stringify({
    query: graphQLquery,
    variables: {}
  }));

  request.end();
}
