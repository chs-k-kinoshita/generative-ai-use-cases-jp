export default (): void => {
  console.log("\nSetup test environment");
  process.env.MODEL_REGION = 'us-east-1';
  process.env.MODEL_IDS = JSON.stringify([
    { "modelId": "us.anthropic.claude-3-7-sonnet-20250219-v1:0", "region": "us-east-1" }
  ]);
  return;
};