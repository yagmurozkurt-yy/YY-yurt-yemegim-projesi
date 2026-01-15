
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Read .env file manually
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = envContent.split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key && value) {
        acc[key.trim()] = value.trim();
    }
    return acc;
}, {} as Record<string, string>);

const supabaseUrl = envVars['VITE_SUPABASE_URL'];
const supabaseKey = envVars['VITE_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const menus = [
    // Dinner (Akşam)
    { date: '2026-01-01', meal_type: 'Akşam', content: 'Mercimek Çorbası, Izgara Köfte+Piyaz, Soslu Makarna, Kereviz Salatası', calories: '800-1200 kcal' },
    { date: '2026-01-02', meal_type: 'Akşam', content: 'Ezogelin Çorba, Kuru Soslu Tavuk Kavurma, Bulgur Pilavı, Çoban Salata', calories: '800-1200 kcal' },
    { date: '2026-01-03', meal_type: 'Akşam', content: 'Mercimek Çorbası, Kuru Fasulye, Şehriyeli Pirinç Pilavı, Cacık', calories: '800-1200 kcal' },
    { date: '2026-01-04', meal_type: 'Akşam', content: 'Ezogelin Çorba, Pilav Üstü Tavuk/Sarma, Turşu, Tulumba Tatlısı', calories: '800-1200 kcal' },
    { date: '2026-01-05', meal_type: 'Akşam', content: 'Mercimek Çorbası, Et Sote/Ratatuy, Bulgur Pilavı, Havuç Tarator', calories: '800-1200 kcal' },
    { date: '2026-01-06', meal_type: 'Akşam', content: 'Ezogelin Çorba, Çıtır Tavuk+Patates, Şehriyeli Pirinç Pilavı, Koslov Salata', calories: '800-1200 kcal' },
    { date: '2026-01-07', meal_type: 'Akşam', content: 'Mercimek Çorbası, İzmir Köfte, Soslu Makarna, Browni', calories: '800-1200 kcal' },
    { date: '2026-01-08', meal_type: 'Akşam', content: 'Ezogelin Çorba, Nohut Tava, Pirinç Pilavı, Karışık Salata', calories: '800-1200 kcal' },
    { date: '2026-01-09', meal_type: 'Akşam', content: 'Mercimek Çorbası, Piliç Külbastı, Cevizli Erişte, Portakal', calories: '800-1200 kcal' },
    { date: '2026-01-10', meal_type: 'Akşam', content: 'Ezogelin Çorba, Kağıt Kebabı, Bulgur Pilavı, Ayran', calories: '800-1200 kcal' },
    { date: '2026-01-11', meal_type: 'Akşam', content: 'Mercimek Çorbası, Tavuk Burger, Çiğ Köfte, Supangle', calories: '800-1200 kcal' },
    { date: '2026-01-12', meal_type: 'Akşam', content: 'Ezogelin Çorba, Sultan Kebabı, Pirinç Pilavı, Ayran', calories: '800-1200 kcal' },
    { date: '2026-01-13', meal_type: 'Akşam', content: 'Mercimek Çorbası, Pilav Üzeri Tavuk, Turşu, Kıbrıs Tatlısı', calories: '800-1200 kcal' },
    { date: '2026-01-14', meal_type: 'Akşam', content: 'Ezogelin Çorba, İnegöl Köfte, Peynirli Makarna, Çiğ Köfte', calories: '800-1200 kcal' },
    { date: '2026-01-15', meal_type: 'Akşam', content: 'Mercimek Çorbası, Tas Kebabı, Bulgur Pilavı, Karışık Salata', calories: '800-1200 kcal' },
    { date: '2026-01-16', meal_type: 'Akşam', content: 'Ezogelin Çorba, Çıtır Tavuk, Şehriyeli Pilav, Rus Salatası', calories: '800-1200 kcal' },
    { date: '2026-01-17', meal_type: 'Akşam', content: 'Mercimek Çorbası, Kuru Fasulye, Pirinç Pilavı, Kadayıf', calories: '800-1200 kcal' },
    { date: '2026-01-18', meal_type: 'Akşam', content: 'Ezogelin Çorba, Tavuk Sote, Bulgur Pilavı, Havuç Tarator', calories: '800-1200 kcal' },
    { date: '2026-01-19', meal_type: 'Akşam', content: 'Mercimek Çorbası, Karnıyarık, Şehriyeli Pirinç Pilavı, Cacık', calories: '800-1200 kcal' },
    { date: '2026-01-20', meal_type: 'Akşam', content: 'Ezogelin Çorba, Tavuk Burger, Çiğ Köfte, Supangle', calories: '800-1200 kcal' },
    { date: '2026-01-21', meal_type: 'Akşam', content: 'Mercimek Çorbası, Nohut Yemeği, Pirinç Pilavı, Karışık Salata', calories: '800-1200 kcal' },
    { date: '2026-01-22', meal_type: 'Akşam', content: 'Ezogelin Çorba, Tavuk Fajita, Şehriyeli Pilav, Haydari', calories: '800-1200 kcal' },
    { date: '2026-01-23', meal_type: 'Akşam', content: 'Mercimek Çorbası, Et Tantuni Dürüm, Bulgur Pilavı, Bisküvi Pastası', calories: '800-1200 kcal' },
    { date: '2026-01-24', meal_type: 'Akşam', content: 'Ezogelin Çorba, Piliç Külbastı, Şehriyeli Pirinç Pilavı, Salata', calories: '800-1200 kcal' },
    { date: '2026-01-25', meal_type: 'Akşam', content: 'Mercimek Çorbası, Akçaabat Köfte, Soslu Makarna, Ayran', calories: '800-1200 kcal' },
    { date: '2026-01-26', meal_type: 'Akşam', content: 'Mercimek Çorbası, Nohut Tava, Pirinç Pilavı, Revani, Cacık', calories: '800-1200 kcal' },
    { date: '2026-01-27', meal_type: 'Akşam', content: 'Mercimek Çorbası, Çin Usulü Tavuk, Soslu Mantı, Roka', calories: '800-1200 kcal' },
    { date: '2026-01-28', meal_type: 'Akşam', content: 'Ezogelin Çorba, Çökertme Kebabı, Şehriyeli Bulgur Pilavı, Kaşık Salata', calories: '800-1200 kcal' },
    { date: '2026-01-29', meal_type: 'Akşam', content: 'Mercimek Çorbası, Izgara Tavuk Baget, Soslu Makarna, Sütlaç', calories: '800-1200 kcal' },
    { date: '2026-01-30', meal_type: 'Akşam', content: 'Ezogelin Çorba, Fideli Soslu Köfte, Pirinç Pilavı, Muz', calories: '800-1200 kcal' },
    { date: '2026-01-31', meal_type: 'Akşam', content: 'Mercimek Çorbası, Fırında Uskumru, Soslu Makarna, İrmik Helvası', calories: '800-1200 kcal' },

    // Breakfast (Kahvaltı)
    { date: '2026-01-01', meal_type: 'Kahvaltı', content: 'Pişi, Haşlanmış Yumurta, Peynir/Zeytin/Reçel', calories: '600-800 kcal' },
    { date: '2026-01-02', meal_type: 'Kahvaltı', content: 'Peynirli Omlet, Sade Poğaça, Peynir/Zeytin/Bal-Tereyağı', calories: '600-800 kcal' },
    { date: '2026-01-03', meal_type: 'Kahvaltı', content: 'Patates Kızartması, Haşlanmış Yumurta, Peynir/Zeytin/Tahin Pekmez', calories: '600-800 kcal' },
    { date: '2026-01-04', meal_type: 'Kahvaltı', content: 'Sucuklu Yumurta, Kakaolu Kek, Peynir/Zeytin/Mevsim Sebzeleri', calories: '600-800 kcal' },
    { date: '2026-01-05', meal_type: 'Kahvaltı', content: 'Karışık Pizza, Haşlanmış Yumurta, Peynir/Zeytin/Reçel', calories: '600-800 kcal' },
    { date: '2026-01-06', meal_type: 'Kahvaltı', content: 'Sebzeli Omlet, Dere Otlu Poğaça, Peynir/Zeytin/Sürülebilir Çikolata', calories: '600-800 kcal' },
    { date: '2026-01-07', meal_type: 'Kahvaltı', content: 'Karışık Kızartma, Haşlanmış Yumurta, Labne/Peynir/Zeytin', calories: '600-800 kcal' },
    { date: '2026-01-08', meal_type: 'Kahvaltı', content: 'Kaşarlı Omlet, Patates Kroket, Peynir/Zeytin/Helva', calories: '600-800 kcal' },
    { date: '2026-01-09', meal_type: 'Kahvaltı', content: 'Zeytinli Peynirli Açma, Haşlanmış Yumurta, Peynir/Zeytin/Bal-Tereyağı', calories: '600-800 kcal' },
    { date: '2026-01-10', meal_type: 'Kahvaltı', content: 'Peynirli Omlet, Çikolatalı Milföy, Peynir/Zeytin/Tahin Pekmez', calories: '600-800 kcal' },
    { date: '2026-01-11', meal_type: 'Kahvaltı', content: 'Patates Kızartması, Haşlanmış Yumurta, Peynir/Zeytin/Mevsim Sebzeleri', calories: '600-800 kcal' },
    { date: '2026-01-12', meal_type: 'Kahvaltı', content: 'Sucuklu Yumurta, Patates Salatası, Peynir/Zeytin/Muz', calories: '600-800 kcal' },
    { date: '2026-01-13', meal_type: 'Kahvaltı', content: 'Patatesli Börek, Haşlanmış Yumurta, Peynir/Zeytin/Sürülebilir Çikolata', calories: '600-800 kcal' },
    { date: '2026-01-14', meal_type: 'Kahvaltı', content: 'Sade Omlet, Simit, Peynir/Zeytin/Reçel/Mandalina', calories: '600-800 kcal' },
    { date: '2026-01-15', meal_type: 'Kahvaltı', content: 'Patates Kızartması, Haşlanmış Yumurta, Peynir/Zeytin/Reçel', calories: '600-800 kcal' },
    { date: '2026-01-16', meal_type: 'Kahvaltı', content: 'Kaşarlı Omlet, Patates Kroket, Peynir/Zeytin/Tahin Pekmez', calories: '600-800 kcal' },
    { date: '2026-01-17', meal_type: 'Kahvaltı', content: 'Karışık Pizza, Haşlanmış Yumurta, Peynir/Zeytin/Mevsim Sebzeleri', calories: '600-800 kcal' },
    { date: '2026-01-18', meal_type: 'Kahvaltı', content: 'Patatesli Yumurta, Çikolatalı Milföy, Peynir/Zeytin/Sürülebilir Çikolata', calories: '600-800 kcal' },
    { date: '2026-01-19', meal_type: 'Kahvaltı', content: 'Pişi, Haşlanmış Yumurta, Peynir/Zeytin/Bal-Tereyağı', calories: '600-800 kcal' },
    { date: '2026-01-20', meal_type: 'Kahvaltı', content: 'Peynirli Omlet, Patates Kroket, Peynir/Zeytin/Mevsim Sebzeleri', calories: '600-800 kcal' },
    { date: '2026-01-21', meal_type: 'Kahvaltı', content: 'Patates Kızartması, Haşlanmış Yumurta, Peynir/Zeytin/Reçel', calories: '600-800 kcal' },
    { date: '2026-01-22', meal_type: 'Kahvaltı', content: 'Sucuklu Yumurta, Simit, Peynir/Zeytin/Helva', calories: '600-800 kcal' },
    { date: '2026-01-23', meal_type: 'Kahvaltı', content: 'Peynirli Börek, Haşlanmış Yumurta, Peynir/Zeytin/Mevsim Sebzeleri', calories: '600-800 kcal' },
    { date: '2026-01-24', meal_type: 'Kahvaltı', content: 'Kaşarlı Omlet, Sade Kek, Peynir/Zeytin/Sürülebilir Çikolata', calories: '600-800 kcal' },
    { date: '2026-01-25', meal_type: 'Kahvaltı', content: 'Patates Kızartması, Haşlanmış Yumurta, Peynir/Zeytin/Tahin Pekmez', calories: '600-800 kcal' },
    { date: '2026-01-26', meal_type: 'Kahvaltı', content: 'Sade Omlet, Peynirli Milföy Börek, Peynir/Zeytin/Mevsim Sebzeleri', calories: '600-800 kcal' },
    { date: '2026-01-27', meal_type: 'Kahvaltı', content: 'Karışık Pizza, Haşlanmış Yumurta, Peynir/Zeytin/Reçel', calories: '600-800 kcal' },
    { date: '2026-01-28', meal_type: 'Kahvaltı', content: 'Menemen, Simit, Peynir/Zeytin/Sürülebilir Çikolata', calories: '600-800 kcal' },
    { date: '2026-01-29', meal_type: 'Kahvaltı', content: 'Patatesli Peynirli Kalem Börek, Haşlanmış Yumurta, Peynir/Zeytin/Bal-Tereyağı', calories: '600-800 kcal' },
    { date: '2026-01-30', meal_type: 'Kahvaltı', content: 'Sucuklu Yumurta, Sade Poğaça/Açma, Peynir/Zeytin/Mevsim Sebzeleri', calories: '600-800 kcal' },
    { date: '2026-01-31', meal_type: 'Kahvaltı', content: 'Patates Kızartması, Haşlanmış Yumurta, Peynir/Zeytin/Mandalina', calories: '600-800 kcal' },
];

// Single city import
async function importMenus() {
    const city = 'İstanbul';
    console.log(`Starting import of menus for ${city} (Single City Mode)...`);

    const dataToInsert = menus.map(item => ({
        ...item,
        city
    }));

    // With the table truncated/dropped, we just insert.
    // Ideally, user has run 'delete' or dropped table, so we just insert.

    const { data, error } = await supabase
        .from('menus')
        .insert(dataToInsert)
        .select();

    if (error) {
        console.error('Error inserting menus:', error.message);
    } else {
        console.log(`Successfully inserted ${data.length} menu items for ${city}.`);
    }
}

importMenus().catch(err => console.error('Unexpected error:', err));
