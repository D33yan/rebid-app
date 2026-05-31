const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function testRegister() {
    console.log('--- Testing Supabase Auth registration workflow ---');
    const email = `test_user_${Date.now()}@gmail.com`;
    const password = 'Password123!';
    const firstName = 'Test';
    const lastName = 'User';

    try {
        console.log(`1. Attempting signUp for email: ${email}`);
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { first_name: firstName, last_name: lastName }
            }
        });

        if (authError) {
            console.error('❌ Supabase Auth signUp failed:', authError.message);
            return;
        }

        console.log('✅ Supabase Auth signUp succeeded! User ID:', authData.user.id);
        
        console.log('2. Attempting to sync profile in public.users table...');
        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert([
                {
                    id: authData.user.id,
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    verified: false
                }
            ])
            .select();

        if (insertError) {
            console.error('❌ Profile sync in public.users table FAILED!');
            console.error('Error Code:', insertError.code);
            console.error('Error Details:', insertError.details);
            console.error('Error Hint:', insertError.hint);
            console.error('Error Message:', insertError.message);
            return;
        }

        console.log('✅ Profile sync in public.users table SUCCEEDED!');
        console.log(JSON.stringify(newUser, null, 2));

    } catch (e) {
        console.error('❌ Script crashed with exception:', e.message);
    }
}

testRegister();
