const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function createDemoUser() {
    console.log('--- Registering pre-seeded demo user in Supabase Auth ---');
    const email = 'garba.audu@rebid.com';
    const password = 'password123';
    const firstName = 'Garba';
    const lastName = 'Audu';

    try {
        console.log(`1. Creating account for email: ${email}`);
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { first_name: firstName, last_name: lastName }
            }
        });

        if (authError) {
            console.error('❌ Supabase Auth signUp failed:', authError.message);
            if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
                console.log('💡 Note: The user seems to already exist in Supabase Auth. Proceeding to profile check...');
            } else {
                return;
            }
        }

        const userId = authData?.user?.id;
        if (!userId) {
            console.error('❌ Failed to retrieve user ID from Auth session.');
            return;
        }

        console.log('✅ Supabase Auth user created successfully! ID:', userId);

        // 2. Synchronize profile in public.users table (Delete old record and insert linked record)
        console.log('2. Synchronizing profile in public.users table...');
        
        // Remove old custom-generated id row if any
        await supabase.from('users').delete().eq('email', email);

        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert([
                {
                    id: userId,
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    verified: true,
                    bank_name: 'GTBANK NIGERIA',
                    account_number: '0123456789',
                    membership_tier: 'ELITE'
                }
            ])
            .select();

        if (insertError) {
            console.error('❌ Profile sync failed:', insertError.message);
        } else {
            console.log('✅ Profile synchronized successfully in public.users!');
            console.log(JSON.stringify(newUser, null, 2));
        }

    } catch (e) {
        console.error('❌ Script encountered error:', e.message);
    }
}

createDemoUser();
