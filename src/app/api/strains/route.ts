import { NextResponse } from 'next/server';
import { createStrain, getStrains } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const strains = await getStrains();
    return NextResponse.json(strains);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch strains' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    const strain = await createStrain({
      name: body.name,
      type: body.type ?? 'Hybrid',
      effects: body.effects ?? '',
      price: parseFloat(body.price) || 0,
      rating: Math.min(5, Math.max(0, parseInt(body.rating) || 0)),
      image_url: body.image_url,
      cbd_percent:
        body.cbd_percent === null || body.cbd_percent === undefined || body.cbd_percent === ''
          ? null
          : parseFloat(body.cbd_percent),
      makes_high: body.makes_high !== false,
    });
    return NextResponse.json(strain, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create strain' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    const { updateStrain } = await import('@/lib/db');
    const strain = await updateStrain(body.id, {
      name: body.name,
      type: body.type,
      effects: body.effects,
      price: parseFloat(body.price) || 0,
      rating: Math.min(5, Math.max(0, parseInt(body.rating) || 0)),
      image_url: body.image_url,
      cbd_percent:
        body.cbd_percent === null || body.cbd_percent === undefined || body.cbd_percent === ''
          ? null
          : parseFloat(body.cbd_percent),
      makes_high: body.makes_high !== false,
    });
    if (!strain) {
      return NextResponse.json({ error: 'Strain not found' }, { status: 404 });
    }
    return NextResponse.json(strain);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update strain' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    const { deleteStrain } = await import('@/lib/db');
    await deleteStrain(body.id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete strain' }, { status: 500 });
  }
}