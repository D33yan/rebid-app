const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function inspect() {
    console.log('--- Inspecting Supabase users table ---');
    try {
        const { data, error } = await supabase.from('users').select('*').limit(1);
        if (error) {
            console.error('Error fetching user:', error);
            return;
        }
        if (data && data.length > 0) {
            console.log('Sample user record from DB:');
            console.log(JSON.stringify(data[0], null, 2));
            console.log('Type of id:', typeof data[0].id);
        } else {
            console.log('Users table is empty!');
        }
    } catch (e) {
        console.error('Inspection failed:', e.message);
    }
}

inspect();
