# Generate embeddings for all businesses
# This script should be run after migration and seed

Write-Host "🤖 Starting embedding generation..." -ForegroundColor Green

# Get the backend pod name
Write-Host "`n🔍 Finding backend pod..." -ForegroundColor Cyan
$podName = kubectl get pods -n yellowbooks -l app=backend -o jsonpath='{.items[0].metadata.name}'

if (-not $podName) {
    Write-Host "❌ No backend pod found!" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Using pod: $podName" -ForegroundColor White

# Run the embedding generation script inside the backend pod
Write-Host "`n⚡ Running embedding generation in pod..." -ForegroundColor Cyan
kubectl exec -n yellowbooks $podName -- node -e "
const { PrismaClient } = require('@prisma/client');
const OpenAI = require('openai').default;

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateEmbedding(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });
  return response.data[0].embedding;
}

function createBusinessText(business) {
  return \`\${business.businessName} - \${business.category}. \${business.description || ''} Located at \${business.address}, \${business.city}, \${business.state} \${business.zipCode}.\`;
}

async function main() {
  console.log('🚀 Starting embedding generation...');
  
  const businesses = await prisma.yellowBook.findMany({
    where: { OR: [{ embedding: null }, { embedding: '' }] }
  });
  
  console.log(\`📊 Found \${businesses.length} businesses to process\`);
  
  for (const business of businesses) {
    try {
      const text = createBusinessText(business);
      const embedding = await generateEmbedding(text);
      
      await prisma.yellowBook.update({
        where: { id: business.id },
        data: { embedding: JSON.stringify(embedding) }
      });
      
      console.log(\`✅ Embedded: \${business.businessName}\`);
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(\`❌ Error: \${business.businessName} - \${error.message}\`);
    }
  }
  
  await prisma.\$disconnect();
  console.log('✅ Embedding generation complete!');
}

main().catch(console.error);
"

Write-Host "`n✅ Embedding generation complete!" -ForegroundColor Green
