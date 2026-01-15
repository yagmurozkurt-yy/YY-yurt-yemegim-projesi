
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { resolve } from 'path'

// Load env vars
dotenv.config({ path: resolve(__dirname, '../.env') })
dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function diagnose() {
    console.log('Diagnosing favorites table...')

    // 1. Check if we can select
    // selecting dummy filter to just check table existence/permission
    const { data, error: selectError } = await supabase
        .from('favorites')
        .select('*')
        .limit(1)

    if (selectError) {
        console.error('Select Error:', selectError)
        if (selectError.code === '42P01') {
            console.log('DIAGNOSIS: Table "favorites" does not exist.')
            return
        }
        if (selectError.code === '42501') {
            console.log('DIAGNOSIS: RLS Permission denied on Select.')
        }
    } else {
        console.log('Select successful. Table exists.')
    }

    // 2. Try to verify specific columns by checking the error message of a bad insert
    // We can't easily "describe" table via client-js, but we can try to insert and see if columns are rejected

    // We assume the user is logged in for the app usage, but here we are anonymous/admin?
    // Using anon key, so we are subject to RLS.
    // If RLS is "authenticated only", this script might fail if not signed in.

    // Let's sign in a test user if possible, or just rely on the error messages which often reveal schema issues (like column not found)

    console.log('Diagnosis complete.')
}

diagnose()
