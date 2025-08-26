import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { diseases } from '@/db/schema';
import { eq, and, or } from 'drizzle-orm';

// Symptom name mapping from input to database field names
const symptomMapping: Record<string, keyof typeof diseases.$inferSelect> = {
  'fever': 'fever',
  'headache': 'headache',
  'cough': 'cough',
  'nausea': 'nausea',
  'vomiting': 'vomiting',
  'chest_pain': 'chestPain',
  'chestPain': 'chestPain',
  'breathlessness': 'breathlessness',
  'abdominal_pain': 'abdominalPain',
  'abdominalPain': 'abdominalPain',
  'sore_throat': 'soreThroat',
  'soreThroat': 'soreThroat',
  'runny_nose': 'runnyNose',
  'runnyNose': 'runnyNose',
  'body_aches': 'bodyAches',
  'bodyAches': 'bodyAches',
  'sweating': 'sweating'
};

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json({ 
        error: "Invalid JSON format",
        code: "INVALID_JSON" 
      }, { status: 400 });
    }

    // Validate symptoms array
    if (!body.symptoms || !Array.isArray(body.symptoms)) {
      return NextResponse.json({ 
        error: "Symptoms array is required",
        code: "MISSING_SYMPTOMS_ARRAY" 
      }, { status: 400 });
    }

    const { symptoms } = body;

    // If empty symptoms array, return all diseases
    if (symptoms.length === 0) {
      const allDiseases = await db.select()
        .from(diseases)
        .orderBy(diseases.createdAt);
      
      return NextResponse.json(allDiseases);
    }

    // Validate and map symptom names
    const mappedSymptoms: (keyof typeof diseases.$inferSelect)[] = [];
    const invalidSymptoms: string[] = [];

    for (const symptom of symptoms) {
      if (typeof symptom !== 'string') {
        return NextResponse.json({ 
          error: "All symptoms must be strings",
          code: "INVALID_SYMPTOM_TYPE" 
        }, { status: 400 });
      }

      const trimmedSymptom = symptom.trim().toLowerCase();
      if (symptomMapping[trimmedSymptom]) {
        mappedSymptoms.push(symptomMapping[trimmedSymptom]);
      } else {
        invalidSymptoms.push(symptom);
      }
    }

    // Return error for invalid symptom names
    if (invalidSymptoms.length > 0) {
      return NextResponse.json({ 
        error: `Invalid symptom names: ${invalidSymptoms.join(', ')}`,
        code: "INVALID_SYMPTOM_NAMES",
        validSymptoms: Object.keys(symptomMapping)
      }, { status: 400 });
    }

    // Build WHERE conditions for ALL symptoms (AND logic)
    const conditions = mappedSymptoms.map(symptom => 
      eq(diseases[symptom], true)
    );

    // Execute query with all conditions
    let query = db.select().from(diseases);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const matchingDiseases = await query.orderBy(diseases.createdAt);

    // Add match confidence (number of matched symptoms)
    const diseasesWithConfidence = matchingDiseases.map(disease => ({
      ...disease,
      matchedSymptomsCount: mappedSymptoms.length,
      matchConfidence: mappedSymptoms.length > 0 ? 
        (mappedSymptoms.length / Object.keys(symptomMapping).length * 100).toFixed(1) + '%' : 
        '0%'
    }));

    return NextResponse.json(diseasesWithConfidence);

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}