const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.use(express.json());

// Token generated from the /storefront/api-token-customer-impersonation endpoint
const impersonationToken = "impersonation token";
const storeHash = "store hash"; // Store hash goes here
const channelId = 9999;  // Channel ID goes here
const customerId = 1; // Customer ID to mimic, leave as 0 to ignore the header

app.get("/", (req, res) => {
  const gQuery = `
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
    }
  `;

  const headers = customerId > 0 ? {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${impersonationToken}`,
    "X-Bc-Customer-Id": customerId
  } : {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${impersonationToken}`,
  };

  fetch(`https://store-${storeHash}-${channelId}.mybigcommerce.com/graphql`, {
    method: "POST",
    credentials: "include",
    mode: "cors",
    headers,
    body: JSON.stringify({ query: gQuery })
  })
  .then(data => data.json())
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.send(err);
  });
});

let listener = app.listen(process.env.PORT || 8080, () => {
  console.log(`Listening on port ${listener.address().port}`);
});
