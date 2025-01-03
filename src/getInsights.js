// Note: Replace **<YOUR_APPLICATION_TOKEN>** with your actual Application token

class LangflowClient {
    constructor(baseURL, applicationToken) {
        this.baseURL = baseURL;
        this.applicationToken = applicationToken;
    }
    async post(endpoint, body, headers = { "Content-Type": "application/json" }) {
        headers["Authorization"] = `Bearer ${this.applicationToken}`;
        headers["Content-Type"] = "application/json";
        const url = `${this.baseURL}${endpoint}`;

        try {
            // Log the request details
            console.log('Making request to:', url);
            console.log('Request method:', 'POST');
            console.log('Request headers:', headers);

            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body),
                // Add these options for CORS
                mode: 'cors',
                credentials: 'include'  // If you need to send cookies
            });

            // Log response details
            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers));

            if (response.status === 405) {
                console.error('405 Method Not Allowed - Available methods:', response.headers.get('Allow'));
                throw new Error(`HTTP method POST not allowed for ${endpoint}. Allowed methods: ${response.headers.get('Allow')}`);
            }

            // Rest of your error handling...
            const responseMessage = await response.json();
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText} - ${JSON.stringify(responseMessage)}`);
            }
            return responseMessage;
        } catch (error) {
            console.error('Request Failed:', {
                url,
                status: error.status,
                message: error.message,
                endpoint,
                baseURL: this.baseURL
            });
            throw error;
        }
    }

    async initiateSession(flowId, langflowId, inputValue, inputType = 'chat', outputType = 'chat', stream = false, tweaks = {}) {
        const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`;
        return this.post(endpoint, { input_value: inputValue, input_type: inputType, output_type: outputType, tweaks: tweaks });
    }

    handleStream(streamUrl, onUpdate, onClose, onError) {
        const eventSource = new EventSource(streamUrl);

        eventSource.onmessage = event => {
            const data = JSON.parse(event.data);
            onUpdate(data);
        };

        eventSource.onerror = event => {
            console.error('Stream Error:', event);
            onError(event);
            eventSource.close();
        };

        eventSource.addEventListener("close", () => {
            onClose('Stream closed');
            eventSource.close();
        });

        return eventSource;
    }

    async runFlow(flowIdOrName, langflowId, inputValue, inputType = 'chat', outputType = 'chat', tweaks = {}, stream = false, onUpdate, onClose, onError) {
        try {
            const initResponse = await this.initiateSession(flowIdOrName, langflowId, inputValue, inputType, outputType, stream, tweaks);
            console.log('Init Response:', initResponse);
            if (stream && initResponse && initResponse.outputs && initResponse.outputs[0].outputs[0].artifacts.stream_url) {
                const streamUrl = initResponse.outputs[0].outputs[0].artifacts.stream_url;
                console.log(`Streaming from: ${streamUrl}`);
                this.handleStream(streamUrl, onUpdate, onClose, onError);
            }
            return initResponse;
        } catch (error) {
            console.error('Error running flow:', error);
            onError('Error initiating session');
        }
    }
}

export default async function getInsights(inputValue, inputType = 'chat', outputType = 'chat', stream = false) {

    const flowIdOrName = '5d664ca6-224d-4112-b143-d31786f9a046';
    const langflowId = 'aa552875-56d4-431d-94bd-389aa1c8d68f';
    const applicationToken = import.meta.env.VITE_MODEL_TOKEN;
    const langflowClient = new LangflowClient('/api',
        applicationToken);

    try {
        const tweaks = {
            "Agent-C6mqP": {},
            "ChatInput-X4siD": {},
            "ChatOutput-XzlpZ": {},
            "URL-DITVH": {},
            "CalculatorTool-euMKt": {},
            "AstraDBCQLToolComponent-GXZ2B": {},
            "AstraDBCQLToolComponent-pSzNq": {}
        };
        let response = await langflowClient.runFlow(
            flowIdOrName,
            langflowId,
            inputValue,
            inputType,
            outputType,
            tweaks,
            stream,
            (data) => console.log("Received:", data.chunk), // onUpdate
            (message) => console.log("Stream Closed:", message), // onClose
            (error) => console.log("Stream Error:", error) // onError
        );
        if (!stream && response && response.outputs) {
            const flowOutputs = response.outputs[0];
            const firstComponentOutputs = flowOutputs.outputs[0];
            const output = firstComponentOutputs.outputs.message;

            return output.message.text;
        }
    } catch (error) {
        console.error('Main Error', error.message);
    }
}