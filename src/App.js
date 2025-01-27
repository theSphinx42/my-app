import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AppBuilder() {
  const [appName, setAppName] = useState("");
  const [appDescription, setAppDescription] = useState("");
  const [featureList, setFeatureList] = useState([""]);
  const [generatedCode, setGeneratedCode] = useState("");
  const [platform, setPlatform] = useState("Vercel");

  const templates = {
    Blog: {
      appName: "My Blog",
      appDescription: "A blogging platform to share posts and articles.",
      featureList: ["Create posts", "Edit posts", "Comment system"],
    },
    ECommerce: {
      appName: "ShopEasy",
      appDescription: "An online store to sell products.",
      featureList: ["Product catalog", "Shopping cart", "Checkout system"],
    },
  };

  const deploymentSteps = {
    Vercel: [
      "Sign up or log in to Vercel.",
      "Connect your GitHub repository.",
      "Configure build settings and deploy.",
      "Your app is live on a custom Vercel URL.",
    ],
    Netlify: [
      "Sign up or log in to Netlify.",
      "Drag and drop your build folder or connect a GitHub repository.",
      "Configure settings and deploy.",
      "Your app is live on a Netlify URL.",
    ],
    AWS: [
      "Create an AWS account and set up a server (EC2) or Lambda function.",
      "Install and configure the AWS CLI.",
      "Deploy your app using the AWS CLI or Elastic Beanstalk.",
      "Your app is live on an AWS-hosted domain.",
    ],
  };

  const handleGenerateApp = async () => {
    const response = await fetch("/api/generate-app", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appName,
        appDescription,
        featureList,
      }),
    });

    const data = await response.json();
    setGeneratedCode(data.code);
  };

  const handleSuggestFeatures = async () => {
    const response = await fetch("/api/suggest-features", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appDescription }),
    });

    const data = await response.json();
    setFeatureList(data.features || [""]);
  };

  const addFeature = () => setFeatureList([...featureList, ""]);

  const updateFeature = (index, value) => {
    const newFeatures = [...featureList];
    newFeatures[index] = value;
    setFeatureList(newFeatures);
  };

  const loadTemplate = (templateName) => {
    const template = templates[templateName];
    if (template) {
      setAppName(template.appName);
      setAppDescription(template.appDescription);
      setFeatureList(template.featureList);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">AI App Builder</h1>
      <Card>
        <CardContent>
          <Input
            placeholder="App Name"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
          />
          <Textarea
            placeholder="App Description"
            value={appDescription}
            onChange={(e) => setAppDescription(e.target.value)}
            className="mt-4"
          />
          <Button onClick={handleSuggestFeatures} className="mt-4">
            Suggest Features
          </Button>
          <h2 className="text-lg font-bold mt-4">Features</h2>
          {featureList.map((feature, index) => (
            <Input
              key={index}
              placeholder={`Feature ${index + 1}`}
              value={feature}
              onChange={(e) => updateFeature(index, e.target.value)}
              className="mt-2"
            />
          ))}
          <Button onClick={addFeature} className="mt-4">
            Add Another Feature
          </Button>
          <Button onClick={handleGenerateApp} className="mt-4">
            Generate App
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent>
          <h2 className="text-lg font-bold">Select a Template</h2>
          <select
            onChange={(e) => loadTemplate(e.target.value)}
            className="mt-4 p-2 border rounded"
          >
            <option value="">Select a Template</option>
            {Object.keys(templates).map((templateName) => (
              <option key={templateName} value={templateName}>
                {templateName}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {generatedCode && (
        <Card className="mt-6">
          <CardContent>
            <h2 className="text-lg font-bold">Generated Code</h2>
            <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto">
              {generatedCode}
            </pre>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardContent>
          <h2 className="text-lg font-bold">Steps to Deploy</h2>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="mt-4 p-2 border rounded"
          >
            <option value="Vercel">Vercel</option>
            <option value="Netlify">Netlify</option>
            <option value="AWS">AWS</option>
          </select>
          <ol className="list-decimal list-inside space-y-2 mt-2">
            {deploymentSteps[platform].map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
