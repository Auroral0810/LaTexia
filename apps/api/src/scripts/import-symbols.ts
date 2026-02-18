
import { db } from '../db';
import { latexSymbols } from '../db/schema';
import fs from 'fs';
import path from 'path';
import { sql } from 'drizzle-orm';

async function main() {
  console.log('🚀 Starting import of LaTeX symbols (V2 with Unicode)...');

  try {
    // 1. Delete existing data
    console.log('🗑️  Deleting existing symbols...');
    await db.delete(latexSymbols);
    console.log('✅ Existing symbols deleted.');

    // 2. Read JSON file
    const paramsPath = path.resolve(__dirname, '../../../../scripts/merged-symbols.json');
    console.log(`📖 Reading symbols from: ${paramsPath}`);
    
    if (!fs.existsSync(paramsPath)) {
      throw new Error(`File not found: ${paramsPath}`);
    }

    const fileContent = fs.readFileSync(paramsPath, 'utf-8');
    const symbolsData = JSON.parse(fileContent);

    // 3. Transform data
    const entries = Object.entries(symbolsData);
    console.log(`📊 Found ${entries.length} symbols to import.`);

    const records = entries.map(([latexCode, data]: [string, any], index) => {
      return {
        name: data.name || latexCode.replace(/\\/g, ''),
        latexCode: latexCode,
        unicode: data.unicode || null, // Import unicode
        category: data.category || 'other',
        description: data.description || '',
        example: data.example || '',
        sortOrder: index + 1,
      };
    });

    // 4. Insert in chunks
    const CHUNK_SIZE = 500;
    const totalChunks = Math.ceil(records.length / CHUNK_SIZE);

    console.log(`📦 Importing in ${totalChunks} chunks...`);

    for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = start + CHUNK_SIZE;
        const chunk = records.slice(start, end);
        
        await db.insert(latexSymbols).values(chunk);
        console.log(`   - Chunk ${i + 1}/${totalChunks} inserted (${chunk.length} records)`);
    }

    // 5. Verify count
    const result = await db.execute(sql`SELECT COUNT(*) FROM ${latexSymbols}`);
    const count = result.rows[0].count;
    
    console.log(`✅ Import completed successfully! Total records in DB: ${count}`);

  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
