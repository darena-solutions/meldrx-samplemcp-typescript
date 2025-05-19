import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp";
import express from "express";
import { initializers } from "./mcp-tools/mcp-tools-list";

const app = express();
const port = 3000;

app.use(express.json());

app.post("/mcp", async (req, res) => {
  try {
    const server = new McpServer({
      name: "Typescript Template",
      version: "1.0.0",
    });

    for (const initializer of initializers) {
      initializer(server, req, res);
    }

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    res.on("close", () => {
      console.log("Request closed");

      transport.close();
      server.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.log("Error handling MCP request:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: null,
      });
    }
  }
});

app.listen(port, () => {
  console.log(`MCP server listening on port ${port}`);
});
