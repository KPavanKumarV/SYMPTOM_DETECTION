import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { diseases } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Get single disease by ID
    const disease = await db.select()
      .from(diseases)
      .where(eq(diseases.id, parseInt(id)))
      .limit(1);

    if (disease.length === 0) {
      return NextResponse.json({ 
        error: 'Disease not found',
        code: 'DISEASE_NOT_FOUND' 
      }, { status: 404 });
    }

    return NextResponse.json(disease[0]);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if disease exists
    const existingDisease = await db.select()
      .from(diseases)
      .where(eq(diseases.id, parseInt(id)))
      .limit(1);

    if (existingDisease.length === 0) {
      return NextResponse.json({ 
        error: 'Disease not found',
        code: 'DISEASE_NOT_FOUND' 
      }, { status: 404 });
    }

    // Parse request body
    const body = await request.json();

    // Validate fields if provided
    if (body.diseaseName !== undefined) {
      if (typeof body.diseaseName !== 'string' || body.diseaseName.trim() === '') {
        return NextResponse.json({ 
          error: "Disease name must be a non-empty string",
          code: "INVALID_DISEASE_NAME" 
        }, { status: 400 });
      }
      body.diseaseName = body.diseaseName.trim();
    }

    if (body.medicineMeasures !== undefined) {
      if (typeof body.medicineMeasures !== 'string' || body.medicineMeasures.trim() === '') {
        return NextResponse.json({ 
          error: "Medicine measures must be a non-empty string",
          code: "INVALID_MEDICINE_MEASURES" 
        }, { status: 400 });
      }
      body.medicineMeasures = body.medicineMeasures.trim();
    }

    // Validate boolean symptoms if provided
    const symptomFields = [
      'fever', 'headache', 'cough', 'nausea', 'vomiting', 'chestPain',
      'breathlessness', 'abdominalPain', 'soreThroat', 'runnyNose', 'bodyAches', 'sweating'
    ];

    for (const field of symptomFields) {
      if (body[field] !== undefined && typeof body[field] !== 'boolean') {
        return NextResponse.json({ 
          error: `${field} must be a boolean value`,
          code: "INVALID_SYMPTOM_VALUE" 
        }, { status: 400 });
      }
    }

    // Prepare update data
    const updates: any = {
      ...body,
      updatedAt: new Date().toISOString()
    };

    // Remove id from updates if present
    delete updates.id;
    delete updates.createdAt;

    // Update disease
    const updatedDisease = await db.update(diseases)
      .set(updates)
      .where(eq(diseases.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedDisease[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if disease exists
    const existingDisease = await db.select()
      .from(diseases)
      .where(eq(diseases.id, parseInt(id)))
      .limit(1);

    if (existingDisease.length === 0) {
      return NextResponse.json({ 
        error: 'Disease not found',
        code: 'DISEASE_NOT_FOUND' 
      }, { status: 404 });
    }

    // Delete disease
    const deletedDisease = await db.delete(diseases)
      .where(eq(diseases.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Disease deleted successfully',
      deletedDisease: deletedDisease[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}