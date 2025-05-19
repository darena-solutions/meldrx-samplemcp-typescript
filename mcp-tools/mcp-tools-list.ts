import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { Request, Response } from "express";
import { findPatientIdToolInitializer } from "./find-patient-id-tool";
import { readFhirResourceToolInitializer } from "./read-fhir-resource-tool";

const initializers: ((
  server: McpServer,
  req: Request,
  res: Response
) => void)[] = [];

initializers.push(findPatientIdToolInitializer);
initializers.push(readFhirResourceToolInitializer);

export { initializers };
