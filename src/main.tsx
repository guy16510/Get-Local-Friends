import ReactDOM from "react-dom/client";
import App from "./App.tsx"; // or TestPage.tsx if that's your component
import "./index.css";
import { Amplify } from "aws-amplify";
import { parseAmplifyConfig } from "aws-amplify/utils";


// Extract your REST API settings from the outputs
import outputs from '../amplify_outputs.json';

const amplifyConfig = parseAmplifyConfig(outputs);

Amplify.configure({
  ...amplifyConfig,
  API: {
    ...amplifyConfig.API,
    REST: outputs.custom.API,
  },
});


ReactDOM.createRoot(document.getElementById("root")!).render(<App />);