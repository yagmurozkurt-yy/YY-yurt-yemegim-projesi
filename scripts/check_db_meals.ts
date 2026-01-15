
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

async function checkMeals() {
    console.log('Checking meal types in database...');

    // Get distinct meal types by grouping (simulated since Supabase simple client doesn't do GROUP BY easily without rpc)
    // We'll just fetch all meal_types properly efficiently? 
    // actually, let's just fetch all and count in JS, 5000 is small enough.

    const { data, error } = await supabase
        .from('menus')
        .select('meal_type, city')
        .limit(10000); // Should cover our 5022 rows

    if (error) {
        console.error('Error fetching menus:', error);
        return;
    }

    const counts: Record<string, number> = {};
    data.forEach(row => {
        counts[row.meal_type] = (counts[row.meal_type] || 0) + 1;
    });

    console.log('Meal Type Counts:', counts);

    const lunchCount = counts['Öğle'] || counts['Lunch'] || 0;
    if (lunchCount > 0) {
        console.log(`FOUND ${lunchCount} Lunch/Öğle records!`);
    } else {
        console.log('No Lunch/Öğle records found in database.');
    }
}

checkMeals().catch(console.error);
