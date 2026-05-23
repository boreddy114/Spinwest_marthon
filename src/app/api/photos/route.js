export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

global.photos = global.photos || [];

export async function GET() {
  try {
    const headers = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('event_photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const parsedPhotos = data.map(p => ({
          url: p.url,
          name: p.id,
          time: new Date(p.created_at).getTime()
        }));
        return NextResponse.json({ success: true, photos: parsedPhotos }, { headers });
      }
    }
    
    return NextResponse.json({ success: true, photos: global.photos }, { headers });
  } catch (error) {
    console.error("Photos Error:", error);
    return NextResponse.json({ success: true, photos: global.photos }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  }
}

export async function DELETE(request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
    }

    if (supabase) {
      const { error } = await supabase
        .from('event_photos')
        .delete()
        .eq('url', url);

      if (error) {
        throw error;
      }
    } else {
      global.photos = global.photos.filter(p => p.url !== url);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Photo Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


