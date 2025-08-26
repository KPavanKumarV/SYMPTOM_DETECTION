import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { diseases } from '@/db/schema';
import { eq, like, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');

    let query = db.select().from(diseases);
    
    if (search) {
      query = query.where(
        like(diseases.diseaseName, `%${search}%`)
      );
    }

    const results = await query.limit(limit).offset(offset);
    return NextResponse.json(results);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      diseaseName, 
      medicineMeasures, 
      fever = false,
      headache = false,
      cough = false,
      nausea = false,
      vomiting = false,
      chestPain = false,
      breathlessness = false,
      abdominalPain = false,
      soreThroat = false,
      runnyNose = false,
      bodyAches = false,
      sweating = false
    } = body;

    // Validate required fields
    if (!diseaseName || typeof diseaseName !== 'string' || diseaseName.trim() === '') {
      return NextResponse.json({ 
        error: "Disease name is required and must be a non-empty string",
        code: "MISSING_DISEASE_NAME" 
      }, { status: 400 });
    }

    if (!medicineMeasures || typeof medicineMeasures !== 'string' || medicineMeasures.trim() === '') {
      return NextResponse.json({ 
        error: "Medicine measures is required and must be a non-empty string",
        code: "MISSING_MEDICINE_MEASURES" 
      }, { status: 400 });
    }

    // Create new disease record
    const newDisease = await db.insert(diseases)
      .values({
        diseaseName: diseaseName.trim(),
        medicineMeasures: medicineMeasures.trim(),
        fever: Boolean(fever),
        headache: Boolean(headache),
        cough: Boolean(cough),
        nausea: Boolean(nausea),
        vomiting: Boolean(vomiting),
        chestPain: Boolean(chestPain),
        breathlessness: Boolean(breathlessness),
        abdominalPain: Boolean(abdominalPain),
        soreThroat: Boolean(soreThroat),
        runnyNose: Boolean(runnyNose),
        bodyAches: Boolean(bodyAches),
        sweating: Boolean(sweating),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newDisease[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if record exists
    const existingRecord = await db.select()
      .from(diseases)
      .where(eq(diseases.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ 
        error: 'Disease not found' 
      }, { status: 404 });
    }

    const body = await request.json();
    const updates: any = {};

    // Validate and prepare updates
    if (body.diseaseName !== undefined) {
      if (typeof body.diseaseName !== 'string' || body.diseaseName.trim() === '') {
        return NextResponse.json({ 
          error: "Disease name must be a non-empty string",
          code: "INVALID_DISEASE_NAME" 
        }, { status: 400 });
      }
      updates.diseaseName = body.diseaseName.trim();
    }

    if (body.medicineMeasures !== undefined) {
      if (typeof body.medicineMeasures !== 'string' || body.medicineMeasures.trim() === '') {
        return NextResponse.json({ 
          error: "Medicine measures must be a non-empty string",
          code: "INVALID_MEDICINE_MEASURES" 
        }, { status: 400 });
      }
      updates.medicineMeasures = body.medicineMeasures.trim();
    }

    // Update boolean symptom fields if provided
    const symptomFields = [
      'fever', 'headache', 'cough', 'nausea', 'vomiting', 'chestPain', 
      'breathlessness', 'abdominalPain', 'soreThroat', 'runnyNose', 
      'bodyAches', 'sweating'
    ];

    symptomFields.forEach(field => {
      if (body[field] !== undefined) {
        updates[field] = Boolean(body[field]);
      }
    });

    // Always update timestamp
    updates.updatedAt = new Date().toISOString();

    const updated = await db.update(diseases)
      .set(updates)
      .where(eq(diseases.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if record exists
    const existingRecord = await db.select()
      .from(diseases)
      .where(eq(diseases.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ 
        error: 'Disease not found' 
      }, { status: 404 });
    }

    const deleted = await db.delete(diseases)
      .where(eq(diseases.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Disease deleted successfully',
      deleted: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}