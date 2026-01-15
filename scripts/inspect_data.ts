
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

async function inspectContent() {
    const { data, error } = await supabase
        .from('menus')
        .select('id, date, meal_type, content')
        .eq('city', 'İstanbul')
        .limit(3);

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Sample Data:');
    data.forEach(m => {
        console.log(`--- ${m.date} (${m.meal_type}) ---`);
        console.log('Raw Content:', JSON.stringify(m.content));
        console.log('-----------------------------');
    });
}

inspectContent();
