import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Load .env.local manually without dotenv
const envContent = fs.readFileSync('.env.local', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1]] = match[2].replace(/^"|"$/g, '').trim(); // Remove quotes
  }
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Seeding started...");
  
  // 1. Seed Site Content (Travel)
  const travelContent = {
    heroTitle: "BEYOND THE ORDINARY",
    heroDescription: "Experience bespoke travel designed for the modern explorer. Uncover hidden gems and create unforgettable memories.",
  };

  const { error: e1 } = await supabase.from('site_content').upsert({
    id: 'travel_page',
    content: travelContent
  });
  if (e1) console.error("Error travel content:", e1.message);

  // 2. Seed Site Content (Retreats)
  const retreatsContent = {
    heroTitle: "RECONNECT WITH YOURSELF IN TOTAL SERENITY",
    introSubtitle: "Meet Aruna Retreats",
    introTitle: "ESCAPE THE NOISE AND RECONNECT WITH YOUR INNER SELF. ARUNA RETREATS OFFERS CURATED WELLNESS JOURNEYS DESIGNED TO RESTORE YOUR MIND, BODY, AND SPIRIT IN NATURE'S MOST TRANQUIL SANCTUARIES.",
    ctaTitle: "DON'T WANNA MISS A THING?"
  };

  const { error: e2 } = await supabase.from('site_content').upsert({
    id: 'retreats_page',
    content: retreatsContent
  });
  if (e2) console.error("Error retreats content:", e2.message);

  // 3. Seed Retreat Destinations
  const experiences = [
    {
      title: "Destination 1",
      date: "Aug 15 - Aug 20, 2026",
      description: "Immerse yourself in lush greenery and find inner peace with daily yoga and meditation sessions.",
      image_url: "http://placehold.co/800x800.png",
      link: "/retreats/destination-1",
      sort_order: 1
    },
    {
      title: "Destination 2",
      date: "Sep 01 - Sep 07, 2026",
      description: "A vibrant blend of wellness and surf culture, perfect for the energetic and adventurous soul.",
      image_url: "http://placehold.co/800x800.png",
      link: "/retreats/destination-2",
      sort_order: 2
    },
    {
      title: "Destination 3",
      date: "Oct 10 - Oct 15, 2026",
      description: "Disconnect from the world and rejuvenate on this pristine island with crystal clear waters.",
      image_url: "http://placehold.co/800x800.png",
      link: "/retreats/destination-3",
      sort_order: 3
    },
    {
      title: "Destination 4",
      date: "Nov 05 - Nov 12, 2026",
      description: "Experience untamed beauty and cultural richness while restoring your body and mind.",
      image_url: "http://placehold.co/800x800.png",
      link: "/retreats/destination-4",
      sort_order: 4
    }
  ];

  for (const exp of experiences) {
    const { error } = await supabase.from('retreats_destinations').insert(exp);
    if (error) console.error("Error destination:", error.message);
  }

  // 4. Seed Reviews (Travel & Retreats)
  const reviews = [
    { name: "Sarah Jenkins", location: "New York, USA", quote: "A life-changing experience. The serenity and care were beyond anything I expected.", category: "retreat", sort_order: 1 },
    { name: "Michael Chen", location: "Singapore", quote: "The perfect balance of wellness and adventure. I returned home completely renewed.", category: "retreat", sort_order: 2 },
    { name: "Emma Thompson", location: "London, UK", quote: "Every detail was flawlessly executed. It truly felt like a sanctuary for the soul.", category: "retreat", sort_order: 3 },
    { name: "David Miller", location: "Los Angeles", quote: "The most seamless and breathtaking travel experience of my life.", category: "travel", sort_order: 1 },
    { name: "Sophia Rossi", location: "Milan", quote: "Every detail was curated to perfection. A truly bespoke journey.", category: "travel", sort_order: 2 },
    { name: "James Carter", location: "London", quote: "Unforgettable landscapes and impeccable service from start to finish.", category: "travel", sort_order: 3 }
  ];

  for (const review of reviews) {
    const { error } = await supabase.from('reviews').insert(review);
    if (error) console.error("Error review:", error.message);
  }

  console.log("Seeding complete!");
}

seed();
