import express from "express";
import { graphQLController } from "./graphql";

const app = express();

app.use(express.static("public"));
app.use(express.json());

app.get("/graphql", graphQLController);

const listener = app.listen(process.env.PORT || 8080, () => {
  console.log(`Listening on port ${(listener.address() as any).port}`);
});
