/**
 * Clean Database Script
 *
 * Deletes all data from the database for fresh testing.
 * Run with: npx tsx scripts/clean-database.ts
 */

import prisma from '@/lib/db';

async function cleanDatabase() {
  console.log('🗑️  Starting database cleanup...\n');

  try {
    // Delete in correct order (due to foreign key constraints)

    // 1. Delete Analytics (references Video)
    const analyticsCount = await prisma.analytics.deleteMany({});
    console.log(`✅ Deleted ${analyticsCount.count} analytics records`);

    // 2. Delete MacroChunks (references Video)
    const macroChunksCount = await prisma.macroChunk.deleteMany({});
    console.log(`✅ Deleted ${macroChunksCount.count} macro chunks`);

    // 3. Delete Chunks (references Video)
    const chunksCount = await prisma.chunk.deleteMany({});
    console.log(`✅ Deleted ${chunksCount.count} chunks`);

    // 4. Delete Videos (parent table)
    const videosCount = await prisma.video.deleteMany({});
    console.log(`✅ Deleted ${videosCount.count} videos`);

    console.log('\n✨ Database cleaned successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Videos: ${videosCount.count}`);
    console.log(`   - Chunks: ${chunksCount.count}`);
    console.log(`   - Macro Chunks: ${macroChunksCount.count}`);
    console.log(`   - Analytics: ${analyticsCount.count}`);
    console.log(`   - Total records deleted: ${videosCount.count + chunksCount.count + macroChunksCount.count + analyticsCount.count}`);

  } catch (error) {
    console.error('❌ Error cleaning database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
