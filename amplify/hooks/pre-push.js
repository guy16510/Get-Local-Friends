const { execSync } = require('child_process');

try {
  // Get AWS account ID and region
  const AWS_ACCOUNT_ID = execSync('aws sts get-caller-identity --query Account --output text').toString().trim();
  const AWS_REGION = execSync('aws configure get region').toString().trim();

  if (!AWS_ACCOUNT_ID || !AWS_REGION) {
    throw new Error('Failed to get AWS account ID or region');
  }

  // Set environment variables
  process.env.AWS_ACCOUNT_ID = AWS_ACCOUNT_ID;
  process.env.AWS_REGION = AWS_REGION;

  console.log('AWS environment variables set successfully');
  console.log(`AWS_ACCOUNT_ID: ${AWS_ACCOUNT_ID}`);
  console.log(`AWS_REGION: ${AWS_REGION}`);
} catch (error) {
  console.error('Error in pre-push hook:', error);
  process.exit(1);
}
