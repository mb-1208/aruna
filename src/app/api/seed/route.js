import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  try {
    // 1. Seed Site Content (Travel)
    const travelContent = {
      heroTitle: "BEYOND THE ORDINARY",
      heroDescription: "Experience bespoke travel designed for the modern explorer. Uncover hidden gems and create unforgettable memories.",
    };

    await supabaseAdmin.from('site_content').upsert({
      id: 'travel_page',
      content: travelContent
    });

    // 2. Seed Site Content (Retreats)
    const retreatsContent = {
      heroTitle: "RECONNECT WITH YOURSELF IN TOTAL SERENITY",
      introSubtitle: "Meet Aruna Retreats",
      introTitle: "ESCAPE THE NOISE AND RECONNECT WITH YOUR INNER SELF. ARUNA RETREATS OFFERS CURATED WELLNESS JOURNEYS DESIGNED TO RESTORE YOUR MIND, BODY, AND SPIRIT IN NATURE'S MOST TRANQUIL SANCTUARIES.",
      ctaTitle: "DON'T WANNA MISS A THING?"
    };

    await supabaseAdmin.from('site_content').upsert({
      id: 'retreats_page',
      content: retreatsContent
    });

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
      await supabaseAdmin.from('retreats_destinations').insert(exp);
    }

    // 4. Seed Reviews (Travel & Retreats)
    const reviews = [
      // Retreats Reviews
      { name: "Sarah Jenkins", location: "New York, USA", quote: "A life-changing experience. The serenity and care were beyond anything I expected.", category: "retreat", sort_order: 1 },
      { name: "Michael Chen", location: "Singapore", quote: "The perfect balance of wellness and adventure. I returned home completely renewed.", category: "retreat", sort_order: 2 },
      { name: "Emma Thompson", location: "London, UK", quote: "Every detail was flawlessly executed. It truly felt like a sanctuary for the soul.", category: "retreat", sort_order: 3 },
      // Travel Reviews
      { name: "David Miller", location: "Los Angeles", quote: "The most seamless and breathtaking travel experience of my life.", category: "travel", sort_order: 1 },
      { name: "Sophia Rossi", location: "Milan", quote: "Every detail was curated to perfection. A truly bespoke journey.", category: "travel", sort_order: 2 },
      { name: "James Carter", location: "London", quote: "Unforgettable landscapes and impeccable service from start to finish.", category: "travel", sort_order: 3 }
    ];

    for (const review of reviews) {
      await supabaseAdmin.from('reviews').insert(review);
    }

    return NextResponse.json({ success: true, message: "Database seeded successfully!" });

  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
