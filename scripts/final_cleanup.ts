
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = envContent.split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key && value) {
        acc[key.trim()] = value.trim();
    }
    return acc;
}, {} as Record<string, string>);

const supabase = createClient(envVars['VITE_SUPABASE_URL'], envVars['VITE_SUPABASE_ANON_KEY']);

async function finalCleanup() {
    console.log('Starting FINAL Cleanup...');

    // 1. Delete ALL 'Öğle' or 'Lunch' meals
    const { error: deleteError, count } = await supabase
        .from('menus')
        .delete({ count: 'exact' })
        .in('meal_type', ['Öğle', 'Lunch', 'Öğle Yemeği']);

    if (deleteError) console.error('Delete Error:', deleteError);
    else console.log(`Deleted ${count} Lunch records.`);

    // 2. Deduplicate
    // Strategy: Fetch all, find duplicates in JS, delete duplicates by ID.
    const { data: allMenus, error: fetchError } = await supabase
        .from('menus')
        .select('id, date, city, meal_type');

    if (fetchError || !allMenus) {
        console.error('Fetch Error:', fetchError);
        return;
    }

    const seen = new Set();
    const duplicatesToDelete: string[] = [];

    for (const m of allMenus) {
        const key = `${m.date}-${m.city}-${m.meal_type}`;
        if (seen.has(key)) {
            duplicatesToDelete.push(m.id);
        } else {
            seen.add(key);
        }
    }

    if (duplicatesToDelete.length > 0) {
        console.log(`Found ${duplicatesToDelete.length} duplicates. Deleting...`);
        const { error: dedupError } = await supabase
            .from('menus')
            .delete()
            .in('id', duplicatesToDelete);

        if (dedupError) console.error('Dedup Error:', dedupError);
        else console.log('Duplicates deleted.');
    } else {
        console.log('No duplicates found.');
    }
}

finalCleanup().catch(console.error);
