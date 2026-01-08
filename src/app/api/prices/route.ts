
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get('ids') || 'bitcoin,ethereum,solana,cardano'; // default coins
  const vsCurrency = searchParams.get('vs') || 'usd';

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${vsCurrency}&include_24hr_change=true`,
      {
        next: { revalidate: 60 }, // cache for 60 seconds (avoids hammering the free API)
      }
    );

    if (!res.ok) throw new Error('CoinGecko API error');

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch prices' },
      { status: 500 }
    );
  }
}