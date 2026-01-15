
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

async function cleanupMeals() {
    console.log('Cleaning up invalid meal types...');

    // Delete everything that is NOT Kahvaltı AND NOT Akşam
    const { data, error, count } = await supabase
        .from('menus')
        .delete({ count: 'exact' })
        .neq('meal_type', 'Kahvaltı')
        .neq('meal_type', 'Akşam');

    if (error) {
        console.error('Error cleaning up:', error);
    } else {
        console.log(`Deleted ${count} invalid records.`);
    }

    // Also verify what remains
    const { count: remaining } = await supabase
        .from('menus')
        .select('*', { count: 'exact', head: true });

    console.log(`Remaining valid records: ${remaining}`);
}

cleanupMeals().catch(console.error);
