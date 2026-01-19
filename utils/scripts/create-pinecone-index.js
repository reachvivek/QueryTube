// Script to create Pinecone index programmatically
require('dotenv').config({ path: '.env.local' });

async function createPineconeIndex() {
  console.log('\n🔧 Creating Pinecone Index...\n');

  try {
    const { Pinecone } = require('@pinecone-database/pinecone');

    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    console.log('📡 Creating serverless index: youtube-qa');
    console.log('   Dimensions: 1024 (for Mistral embeddings)');
    console.log('   Region: us-east-1 (AWS)');
    console.log('   Metric: cosine\n');

    await pc.createIndex({
      name: 'youtube-qa',
      dimension: 1024,  // For Mistral embeddings
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1'
        }
      }
    });

    console.log('✅ Index created successfully!');
    console.log('\n⏳ Wait ~1-2 minutes for index to initialize...');
    console.log('\nThen you can:');
    console.log('   1. Refresh QueryTube in your browser');
    console.log('   2. Click "Process Transcript for Q&A"');
    console.log('   3. Watch it upload 1726 vectors!\n');

  } catch (error) {
    if (error.message.includes('ALREADY_EXISTS')) {
      console.log('✅ Index "youtube-qa" already exists!');
      console.log('\nYou can proceed to upload your vectors.');
      console.log('Go back to QueryTube and click "Process Transcript for Q&A"\n');
    } else {
      console.error('❌ Error creating index:', error.message);
      console.error('\nTroubleshooting:');
      console.error('   1. Check your PINECONE_API_KEY in .env.local');
      console.error('   2. Verify you\'re on the free tier (us-east-1 only)');
      console.error('   3. Try creating via UI: https://app.pinecone.io\n');
    }
  }
}

createPineconeIndex();
