import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import { configDotenv } from "dotenv";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

class LangflowClient {
  constructor(baseURL, applicationToken) {
    this.baseURL = baseURL;
    this.applicationToken = applicationToken;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.applicationToken}`,
    };
  }

  async post(endpoint, body, headers = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const mergedHeaders = { ...this.defaultHeaders, ...headers };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: mergedHeaders,
        body: JSON.stringify(body),
      });

      const responseMessage = await response.json();
      if (!response.ok) {
        throw new Error(
          `${response.status} ${response.statusText} - ${JSON.stringify(
            responseMessage
          )}`
        );
      }
      return responseMessage;
    } catch (error) {
      console.error("Request Error:", error.message);
      throw error;
    }
  }

  async initiateSession({
    flowId,
    langflowId,
    inputValue,
    inputType = "chat",
    outputType = "chat",
    stream = false,
    tweaks = {},
  }) {
    const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`;
    return this.post(endpoint, {
      input_value: inputValue,
      input_type: inputType,
      output_type: outputType,
      tweaks,
    });
  }

  async runFlow({
    flowIdOrName,
    langflowId,
    inputValue,
    inputType = "chat",
    outputType = "chat",
    tweaks = {},
    stream = false,
  }) {
    try {
      const initResponse = await this.initiateSession({
        flowId: flowIdOrName,
        langflowId,
        inputValue,
        inputType,
        outputType,
        stream,
        tweaks,
      });

      if (!stream && initResponse?.outputs && initResponse.outputs[0]) {
        const flowOutputs = initResponse.outputs[0];
        const firstComponentOutputs = flowOutputs.outputs[0];

        // Now, properly extract the message
        const message =
          firstComponentOutputs?.results?.text?.text || "No message found";
        return message;
      } else {
        return "Stream initiated";
      }
    } catch (error) {
      console.error("Error running flow:", error);
      throw new Error("Error initiating session");
    }
  }
}

const flowIdOrName = "60abd8b1-0641-456d-8a70-a3c1cf397c71";
const langflowId = "408100d8-bf77-4c52-9e3d-884294054b14";
const applicationToken = process.env.APP_TOKEN;
const langflowClient = new LangflowClient(
  "https://api.langflow.astra.datastax.com",
  applicationToken
);

app.post("/runFlow", async (req, res) => {
  const {
    inputValue,
    inputType = "chat",
    outputType = "chat",
    stream = false,
  } = req.body;
  const tweaks = {
    "AstraDBCQLToolComponent-4thc6": {},
    "TextOutput-cDlS0": {},
    "ChatInput-oBuHh": {},
    "Agent-hCYZ0": {},
  };

  try {
    const response = await langflowClient.runFlow({
      flowIdOrName,
      langflowId,
      inputValue,
      inputType,
      outputType,
      tweaks,
      stream,
    });

    res.status(200).send({ message: response });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});