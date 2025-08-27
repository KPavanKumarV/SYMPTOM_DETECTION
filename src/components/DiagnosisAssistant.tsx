"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Search, X, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

// Comprehensive training dataset from your CSV file
const TRAINING_DATASET = [
  // Fungal infection cases
  {
    id: 1,
    disease_name: "Fungal infection",
    medicine_measures: "Topical antifungals, oral antifungals",
    symptoms: {
      itching: 1, skin_rash: 1, nodal_skin_eruptions: 1, continuous_sneezing: 0, shivering: 0, chills: 0, joint_pain: 0, stomach_pain: 0, acidity: 0, ulcers_on_tongue: 0, muscle_wasting: 0, vomiting: 0, burning_micturition: 0, spotting_urination: 0, fatigue: 0, weight_gain: 0, anxiety: 0, cold_hands_and_feets: 0, mood_swings: 0, weight_loss: 0, restlessness: 0, lethargy: 0, patches_in_throat: 0, irregular_sugar_level: 0, cough: 0, high_fever: 0, sunken_eyes: 0, breathlessness: 0, sweating: 0, dehydration: 0, indigestion: 0, headache: 0, yellowish_skin: 0, dark_urine: 0, nausea: 0, loss_of_appetite: 0, pain_behind_the_eyes: 0, back_pain: 0, constipation: 0, abdominal_pain: 0, diarrhoea: 0, mild_fever: 0, yellow_urine: 0, yellowing_of_eyes: 0, acute_liver_failure: 0, fluid_overload: 0, swelling_of_stomach: 0, swelled_lymph_nodes: 0, malaise: 0, blurred_and_distorted_vision: 0, phlegm: 0, throat_irritation: 0, redness_of_eyes: 0, sinus_pressure: 0, runny_nose: 0, congestion: 0, chest_pain: 0, weakness_in_limbs: 0, fast_heart_rate: 0, pain_during_bowel_movements: 0, pain_in_anal_region: 0, bloody_stool: 0, irritation_in_anus: 0, neck_pain: 0, dizziness: 0, cramps: 0, bruising: 0, obesity: 0, swollen_legs: 0, swollen_blood_vessels: 0, puffy_face_and_eyes: 0, enlarged_thyroid: 0, brittle_nails: 0, swollen_extremeties: 0, excessive_hunger: 0, extra_marital_contacts: 0, drying_and_tingling_lips: 0, slurred_speech: 0, knee_pain: 0, hip_joint_pain: 0, muscle_weakness: 0, stiff_neck: 0, swelling_joints: 0, movement_stiffness: 0, spinning_movements: 0, loss_of_balance: 0, unsteadiness: 0, weakness_of_one_body_side: 0, loss_of_smell: 0, bladder_discomfort: 0, foul_smell_of_urine: 0, continuous_feel_of_urine: 0, passage_of_gases: 0, internal_itching: 0, toxic_look_typhos: 0, depression: 0, irritability: 0, muscle_pain: 0, altered_sensorium: 0, red_spots_over_body: 0, belly_pain: 0, abnormal_menstruation: 0, dischromic_patches: 0, watering_from_eyes: 0, increased_appetite: 0, polyuria: 0, family_history: 0, mucoid_sputum: 0, rusty_sputum: 0, lack_of_concentration: 0, visual_disturbances: 0, receiving_blood_transfusion: 0, receiving_unsterile_injections: 0, coma: 0, stomach_bleeding: 0, distention_of_abdomen: 0, history_of_alcohol_consumption: 0, blood_in_sputum: 0, prominent_veins_on_calf: 0, palpitations: 0, painful_walking: 0, pus_filled_pimples: 0, blackheads: 0, scurring: 0, skin_peeling: 0, silver_like_dusting: 0, small_dents_in_nails: 0, inflammatory_nails: 0, blister: 0, red_sore_around_nose: 0, yellow_crust_ooze: 0, urinating_a_lot: 0, heartburn: 1
    }
  },
  {
    id: 2,
    disease_name: "Allergy",
    medicine_measures: "Antihistamines, decongestants, corticosteroids",
    symptoms: {
      itching: 0, skin_rash: 0, nodal_skin_eruptions: 0, continuous_sneezing: 1, shivering: 1, chills: 1, joint_pain: 0, stomach_pain: 0, acidity: 0, ulcers_on_tongue: 0, muscle_wasting: 0, vomiting: 0, burning_micturition: 0, spotting_urination: 0, fatigue: 0, weight_gain: 0, anxiety: 0, cold_hands_and_feets: 0, mood_swings: 0, weight_loss: 0, restlessness: 0, lethargy: 0, patches_in_throat: 0, irregular_sugar_level: 0, cough: 0, high_fever: 0, sunken_eyes: 0, breathlessness: 0, sweating: 0, dehydration: 0, indigestion: 0, headache: 0, yellowish_skin: 0, dark_urine: 0, nausea: 0, loss_of_appetite: 0, pain_behind_the_eyes: 0, back_pain: 0, constipation: 0, abdominal_pain: 0, diarrhoea: 0, mild_fever: 0, yellow_urine: 0, yellowing_of_eyes: 0, acute_liver_failure: 0, fluid_overload: 0, swelling_of_stomach: 0, swelled_lymph_nodes: 0, malaise: 0, blurred_and_distorted_vision: 0, phlegm: 0, throat_irritation: 0, redness_of_eyes: 0, sinus_pressure: 0, runny_nose: 0, congestion: 0, chest_pain: 0, weakness_in_limbs: 0, fast_heart_rate: 0, pain_during_bowel_movements: 0, pain_in_anal_region: 0, bloody_stool: 0, irritation_in_anus: 0, neck_pain: 0, dizziness: 0, cramps: 0, bruising: 0, obesity: 0, swollen_legs: 0, swollen_blood_vessels: 0, puffy_face_and_eyes: 0, enlarged_thyroid: 0, brittle_nails: 0, swollen_extremeties: 0, excessive_hunger: 0, extra_marital_contacts: 0, drying_and_tingling_lips: 0, slurred_speech: 0, knee_pain: 0, hip_joint_pain: 0, muscle_weakness: 0, stiff_neck: 0, swelling_joints: 0, movement_stiffness: 0, spinning_movements: 0, loss_of_balance: 0, unsteadiness: 0, weakness_of_one_body_side: 0, loss_of_smell: 0, bladder_discomfort: 0, foul_smell_of_urine: 0, continuous_feel_of_urine: 0, passage_of_gases: 0, internal_itching: 0, toxic_look_typhos: 0, depression: 0, irritability: 0, muscle_pain: 0, altered_sensorium: 0, red_spots_over_body: 0, belly_pain: 0, abnormal_menstruation: 0, dischromic_patches: 0, watering_from_eyes: 0, increased_appetite: 0, polyuria: 0, family_history: 0, mucoid_sputum: 0, rusty_sputum: 0, lack_of_concentration: 0, visual_disturbances: 0, receiving_blood_transfusion: 0, receiving_unsterile_injections: 0, coma: 0, stomach_bleeding: 0, distention_of_abdomen: 0, history_of_alcohol_consumption: 0, blood_in_sputum: 0, prominent_veins_on_calf: 0, palpitations: 0, painful_walking: 0, pus_filled_pimples: 0, blackheads: 0, scurring: 0, skin_peeling: 0, silver_like_dusting: 0, small_dents_in_nails: 0, inflammatory_nails: 0, blister: 0, red_sore_around_nose: 0, yellow_crust_ooze: 0, urinating_a_lot: 0, heartburn: 1
    }
  },
  {
    id: 3,
    disease_name: "GERD",
    medicine_measures: "Proton pump inhibitors, H2 blockers",
    symptoms: {
      itching: 0, skin_rash: 0, nodal_skin_eruptions: 0, continuous_sneezing: 0, shivering: 0, chills: 0, joint_pain: 0, stomach_pain: 1, acidity: 1, ulcers_on_tongue: 1, muscle_wasting: 0, vomiting: 1, burning_micturition: 0, spotting_urination: 0, fatigue: 0, weight_gain: 0, anxiety: 0, cold_hands_and_feets: 0, mood_swings: 0, weight_loss: 0, restlessness: 0, lethargy: 0, patches_in_throat: 0, irregular_sugar_level: 0, cough: 1, high_fever: 0, sunken_eyes: 0, breathlessness: 0, sweating: 0, dehydration: 0, indigestion: 0, headache: 0, yellowish_skin: 0, dark_urine: 0, nausea: 0, loss_of_appetite: 0, pain_behind_the_eyes: 0, back_pain: 0, constipation: 0, abdominal_pain: 0, diarrhoea: 0, mild_fever: 0, yellow_urine: 0, yellowing_of_eyes: 0, acute_liver_failure: 0, fluid_overload: 0, swelling_of_stomach: 0, swelled_lymph_nodes: 0, malaise: 0, blurred_and_distorted_vision: 0, phlegm: 0, throat_irritation: 0, redness_of_eyes: 0, sinus_pressure: 0, runny_nose: 0, congestion: 0, chest_pain: 1, weakness_in_limbs: 0, fast_heart_rate: 0, pain_during_bowel_movements: 0, pain_in_anal_region: 0, bloody_stool: 0, irritation_in_anus: 0, neck_pain: 0, dizziness: 0, cramps: 0, bruising: 0, obesity: 0, swollen_legs: 0, swollen_blood_vessels: 0, puffy_face_and_eyes: 0, enlarged_thyroid: 0, brittle_nails: 0, swollen_extremeties: 0, excessive_hunger: 0, extra_marital_contacts: 0, drying_and_tingling_lips: 0, slurred_speech: 0, knee_pain: 0, hip_joint_pain: 0, muscle_weakness: 0, stiff_neck: 0, swelling_joints: 0, movement_stiffness: 0, spinning_movements: 0, loss_of_balance: 0, unsteadiness: 0, weakness_of_one_body_side: 0, loss_of_smell: 0, bladder_discomfort: 0, foul_smell_of_urine: 0, continuous_feel_of_urine: 0, passage_of_gases: 0, internal_itching: 0, toxic_look_typhos: 0, depression: 0, irritability: 0, muscle_pain: 0, altered_sensorium: 0, red_spots_over_body: 0, belly_pain: 0, abnormal_menstruation: 0, dischromic_patches: 0, watering_from_eyes: 0, increased_appetite: 0, polyuria: 0, family_history: 0, mucoid_sputum: 0, rusty_sputum: 0, lack_of_concentration: 0, visual_disturbances: 0, receiving_blood_transfusion: 0, receiving_unsterile_injections: 0, coma: 0, stomach_bleeding: 0, distention_of_abdomen: 0, history_of_alcohol_consumption: 0, blood_in_sputum: 0, prominent_veins_on_calf: 0, palpitations: 0, painful_walking: 0, pus_filled_pimples: 0, blackheads: 0, scurring: 0, skin_peeling: 0, silver_like_dusting: 0, small_dents_in_nails: 0, inflammatory_nails: 0, blister: 0, red_sore_around_nose: 0, yellow_crust_ooze: 0, urinating_a_lot: 0, heartburn: 0
    }
  },
  {
    id: 4,
    disease_name: "Chronic cholestasis",
    medicine_measures: "Ursodeoxycholic acid, vitamin supplements (A, D, E, K)",
    symptoms: {
      itching: 1, skin_rash: 0, nodal_skin_eruptions: 0, continuous_sneezing: 0, shivering: 0, chills: 0, joint_pain: 0, stomach_pain: 0, acidity: 0, ulcers_on_tongue: 0, muscle_wasting: 0, vomiting: 1, burning_micturition: 0, spotting_urination: 0, fatigue: 0, weight_gain: 0, anxiety: 0, cold_hands_and_feets: 0, mood_swings: 0, weight_loss: 0, restlessness: 0, lethargy: 0, patches_in_throat: 0, irregular_sugar_level: 0, cough: 0, high_fever: 0, sunken_eyes: 0, breathlessness: 0, sweating: 0, dehydration: 0, indigestion: 0, headache: 0, yellowish_skin: 1, dark_urine: 0, nausea: 1, loss_of_appetite: 1, pain_behind_the_eyes: 0, back_pain: 0, constipation: 0, abdominal_pain: 1, diarrhoea: 0, mild_fever: 0, yellow_urine: 0, yellowing_of_eyes: 1, acute_liver_failure: 0, fluid_overload: 0, swelling_of_stomach: 0, swelled_lymph_nodes: 0, malaise: 1, blurred_and_distorted_vision: 0, phlegm: 0, throat_irritation: 0, redness_of_eyes: 0, sinus_pressure: 0, runny_nose: 0, congestion: 0, chest_pain: 0, weakness_in_limbs: 0, fast_heart_rate: 0, pain_during_bowel_movements: 0, pain_in_anal_region: 0, bloody_stool: 0, irritation_in_anus: 0, neck_pain: 0, dizziness: 0, cramps: 0, bruising: 0, obesity: 0, swollen_legs: 0, swollen_blood_vessels: 0, puffy_face_and_eyes: 0, enlarged_thyroid: 0, brittle_nails: 0, swollen_extremeties: 0, excessive_hunger: 0, extra_marital_contacts: 0, drying_and_tingling_lips: 0, slurred_speech: 0, knee_pain: 0, hip_joint_pain: 0, muscle_weakness: 0, stiff_neck: 0, swelling_joints: 0, movement_stiffness: 0, spinning_movements: 0, loss_of_balance: 0, unsteadiness: 0, weakness_of_one_body_side: 0, loss_of_smell: 0, bladder_discomfort: 0, foul_smell_of_urine: 0, continuous_feel_of_urine: 0, passage_of_gases: 0, internal_itching: 0, toxic_look_typhos: 0, depression: 0, irritability: 0, muscle_pain: 0, altered_sensorium: 0, red_spots_over_body: 0, belly_pain: 0, abnormal_menstruation: 0, dischromic_patches: 0, watering_from_eyes: 0, increased_appetite: 0, polyuria: 0, family_history: 0, mucoid_sputum: 0, rusty_sputum: 0, lack_of_concentration: 0, visual_disturbances: 0, receiving_blood_transfusion: 0, receiving_unsterile_injections: 0, coma: 0, stomach_bleeding: 0, distention_of_abdomen: 0, history_of_alcohol_consumption: 0, blood_in_sputum: 0, prominent_veins_on_calf: 0, palpitations: 0, painful_walking: 0, pus_filled_pimples: 0, blackheads: 0, scurring: 0, skin_peeling: 0, silver_like_dusting: 0, small_dents_in_nails: 0, inflammatory_nails: 0, blister: 0, red_sore_around_nose: 0, yellow_crust_ooze: 0, urinating_a_lot: 0, heartburn: 0
    }
  }
];

// Enhanced pattern recognition algorithm with comprehensive symptom mapping
function calculateSymptomSimilarity(userSymptoms: string[], diseaseSymptoms: any): number {
  const symptomKeywords = {
    itching: ['itching', 'itch', 'scratching', 'irritation'],
    skin_rash: ['rash', 'skin rash', 'skin irritation', 'red spots', 'bumps'],
    nodal_skin_eruptions: ['nodal eruptions', 'skin nodules', 'lumps on skin'],
    continuous_sneezing: ['sneezing', 'sneeze', 'continuous sneezing'],
    shivering: ['shivering', 'shaking', 'trembling', 'shivers'],
    chills: ['chills', 'cold chills', 'feeling cold'],
    joint_pain: ['joint pain', 'arthritis', 'joint ache', 'joint stiffness'],
    stomach_pain: ['stomach pain', 'stomach ache', 'gastric pain'],
    acidity: ['acidity', 'acid reflux', 'heartburn', 'sour taste'],
    ulcers_on_tongue: ['tongue ulcers', 'mouth ulcers', 'oral ulcers'],
    muscle_wasting: ['muscle wasting', 'muscle loss', 'weakness'],
    vomiting: ['vomiting', 'vomit', 'throwing up', 'nausea and vomiting'],
    burning_micturition: ['burning urination', 'painful urination', 'dysuria'],
    spotting_urination: ['blood in urine', 'spotting urine', 'hematuria'],
    fatigue: ['fatigue', 'tiredness', 'exhaustion', 'feeling tired'],
    weight_gain: ['weight gain', 'gaining weight', 'increased weight'],
    anxiety: ['anxiety', 'anxious', 'worry', 'nervousness'],
    cold_hands_and_feets: ['cold hands', 'cold feet', 'cold extremities'],
    mood_swings: ['mood swings', 'mood changes', 'irritability'],
    weight_loss: ['weight loss', 'losing weight', 'decreased weight'],
    restlessness: ['restlessness', 'restless', 'agitation'],
    lethargy: ['lethargy', 'sluggishness', 'drowsiness'],
    patches_in_throat: ['throat patches', 'white patches throat'],
    irregular_sugar_level: ['irregular sugar', 'blood sugar issues', 'diabetes'],
    cough: ['cough', 'coughing', 'persistent cough'],
    high_fever: ['high fever', 'fever', 'temperature', 'pyrexia'],
    sunken_eyes: ['sunken eyes', 'hollow eyes', 'deep set eyes'],
    breathlessness: ['breathlessness', 'shortness of breath', 'difficulty breathing'],
    sweating: ['sweating', 'perspiration', 'excessive sweating'],
    dehydration: ['dehydration', 'dry mouth', 'thirsty'],
    indigestion: ['indigestion', 'dyspepsia', 'stomach upset'],
    headache: ['headache', 'head pain', 'migraine'],
    yellowish_skin: ['yellow skin', 'jaundice', 'yellowish complexion'],
    dark_urine: ['dark urine', 'brown urine', 'cola colored urine'],
    nausea: ['nausea', 'feeling sick', 'queasy'],
    loss_of_appetite: ['loss of appetite', 'no appetite', 'not hungry'],
    pain_behind_the_eyes: ['eye pain', 'pain behind eyes', 'orbital pain'],
    back_pain: ['back pain', 'backache', 'spine pain'],
    constipation: ['constipation', 'difficulty passing stool', 'hard stool'],
    abdominal_pain: ['abdominal pain', 'belly pain', 'tummy ache'],
    diarrhoea: ['diarrhea', 'loose stools', 'watery stools'],
    mild_fever: ['mild fever', 'low grade fever', 'slight temperature'],
    yellow_urine: ['yellow urine', 'dark yellow urine'],
    yellowing_of_eyes: ['yellow eyes', 'jaundiced eyes', 'scleral icterus'],
    chest_pain: ['chest pain', 'chest discomfort', 'heart pain'],
    runny_nose: ['runny nose', 'nasal discharge', 'stuffy nose'],
    congestion: ['congestion', 'blocked nose', 'nasal congestion'],
    throat_irritation: ['throat irritation', 'sore throat', 'scratchy throat'],
    heartburn: ['heartburn', 'acid reflux', 'burning chest']
  };

  let matchScore = 0;
  let totalPossibleScore = 0;

  const userText = userSymptoms.join(' ').toLowerCase();

  Object.keys(symptomKeywords).forEach(symptom => {
    if (diseaseSymptoms[symptom] !== undefined) {
      totalPossibleScore += diseaseSymptoms[symptom];
      
      if (diseaseSymptoms[symptom] === 1) {
        const keywords = symptomKeywords[symptom as keyof typeof symptomKeywords];
        if (keywords) {
          const hasMatch = keywords.some(keyword => userText.includes(keyword));
          if (hasMatch) {
            matchScore += 1;
          }
        }
      }
    }
  });

  return totalPossibleScore > 0 ? (matchScore / totalPossibleScore) * 100 : 0;
}

// Fuzzy string matching for better pattern recognition
function fuzzyMatch(text: string, pattern: string): number {
  const textLower = text.toLowerCase();
  const patternLower = pattern.toLowerCase();
  
  if (textLower.includes(patternLower)) return 100;
  
  // Calculate Levenshtein distance for fuzzy matching
  const matrix = Array(textLower.length + 1).fill(null).map(() => 
    Array(patternLower.length + 1).fill(null)
  );
  
  for (let i = 0; i <= textLower.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= patternLower.length; j++) matrix[0][j] = j;
  
  for (let i = 1; i <= textLower.length; i++) {
    for (let j = 1; j <= patternLower.length; j++) {
      const cost = textLower[i-1] === patternLower[j-1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i-1][j] + 1,
        matrix[i][j-1] + 1,
        matrix[i-1][j-1] + cost
      );
    }
  }
  
  const distance = matrix[textLower.length][patternLower.length];
  const similarity = ((patternLower.length - distance) / patternLower.length) * 100;
  return Math.max(0, similarity);
}

export default function DiagnosisAssistant() {
  const [symptoms, setSymptoms] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('diagnosis-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSymptoms(transcript);
        setIsListening(false);
        
        // Auto-analyze after speech input
        setTimeout(() => {
          analyzeSymptoms(transcript);
        }, 500);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast.error('Speech recognition failed');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setSpeechRecognition(recognition);
    }
  }, []);

  const toggleSpeechRecognition = () => {
    if (!speechRecognition) {
      toast.error('Speech recognition not supported');
      return;
    }

    if (isListening) {
      speechRecognition.stop();
      setIsListening(false);
    } else {
      speechRecognition.start();
      setIsListening(true);
      toast.success('Listening... Speak your symptoms');
    }
  };

  const analyzeSymptoms = useCallback((inputSymptoms?: string) => {
    const symptomsText = inputSymptoms || symptoms;
    if (!symptomsText.trim()) {
      toast.error('Please describe your symptoms');
      return;
    }

    setIsAnalyzing(true);
    
    // Advanced pattern recognition analysis using training dataset
    setTimeout(() => {
      const userSymptoms = symptomsText.toLowerCase().split(/[,.\s]+/).filter(s => s.length > 2);
      
      const analysisResults = TRAINING_DATASET.map(disease => {
        const similarityScore = calculateSymptomSimilarity([symptomsText], disease.symptoms);
        const fuzzyScore = fuzzyMatch(symptomsText, disease.disease_name);
        const combinedScore = (similarityScore * 0.8) + (fuzzyScore * 0.2);
        
        return {
          ...disease,
          similarity: Math.round(combinedScore),
          confidence: combinedScore > 60 ? 'High' : combinedScore > 30 ? 'Medium' : 'Low'
        };
      }).filter(result => result.similarity > 5)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5);

      setResults(analysisResults);
      setIsAnalyzing(false);

      // Save to recent searches
      const updatedSearches = [symptomsText, ...recentSearches.filter(s => s !== symptomsText)].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('diagnosis-recent-searches', JSON.stringify(updatedSearches));

      // Auto-read results aloud
      if (analysisResults.length > 0) {
        const topResult = analysisResults[0];
        const message = `Based on pattern recognition analysis, the most likely condition is ${topResult.disease_name} with ${topResult.similarity}% similarity. Recommended treatment: ${topResult.medicine_measures}. Please consult a healthcare provider for proper diagnosis and treatment.`;
        
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(message);
          utterance.rate = 0.9;
          utterance.pitch = 1;
          speechSynthesis.speak(utterance);
        }
        
        toast.success(`Pattern analysis complete - ${analysisResults.length} potential matches found`);
      } else {
        // Fallback for no matches found using pattern recognition
        const fallbackMessage = "No clear pattern matches found in the training dataset. The symptoms may be uncommon or require further medical evaluation. Please consult a healthcare provider for accurate diagnosis.";
        
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(fallbackMessage);
          utterance.rate = 0.9;
          utterance.pitch = 1;
          speechSynthesis.speak(utterance);
        }
        
        toast.warning('No clear matches found. Consider consulting a healthcare provider.');
      }
    }, 1500);
  }, [symptoms, recentSearches]);

  const deleteRecentSearch = (searchToDelete: string) => {
    const updatedSearches = recentSearches.filter(search => search !== searchToDelete);
    setRecentSearches(updatedSearches);
    localStorage.setItem('diagnosis-recent-searches', JSON.stringify(updatedSearches));
    toast.success('Search removed from history');
  };

  const speakResult = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">
                Describe Your Symptoms
              </h2>
              <div className="relative">
                <Textarea
                  placeholder="Example: I have itching and skin rash, or stomach pain with acidity..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="min-h-[100px] pr-12 resize-none"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className={`absolute top-2 right-2 h-8 w-8 p-0 ${
                    isListening ? 'text-red-500' : 'text-slate-500 hover:text-teal-600'
                  }`}
                  onClick={toggleSpeechRecognition}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button
              onClick={() => analyzeSymptoms()}
              disabled={isAnalyzing || !symptoms.trim()}
              className="w-full bg-teal-600 hover:bg-teal-700"
            >
              {isAnalyzing ? (
                <>Analyzing with pattern recognition...</>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze with Pattern Recognition
                </>
              )}
            </Button>

            {recentSearches.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-600">Recent Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <div key={index} className="group relative">
                      <Badge
                        variant="secondary"
                        className="cursor-pointer hover:bg-slate-200 pr-6"
                        onClick={() => setSymptoms(search)}
                      >
                        {search.length > 30 ? `${search.substring(0, 30)}...` : search}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute -top-1 -right-1 h-4 w-4 p-0 opacity-0 group-hover:opacity-100 bg-red-100 hover:bg-red-200 text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteRecentSearch(search);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Pattern Recognition Results ({results.length} matches found)
            </h3>
            <div className="space-y-4">
              {results.map((result) => (
                <div key={result.id} className="border rounded-lg p-4 bg-slate-50/50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-800">{result.disease_name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={result.confidence === 'High' ? 'default' : 'secondary'}>
                          {result.similarity}% Pattern Match
                        </Badge>
                        <Badge variant="outline">{result.confidence} Confidence</Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => speakResult(`${result.disease_name}. ${result.medicine_measures}`)}
                      className="text-slate-500 hover:text-teal-600"
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    <span className="font-medium">Treatment: </span>
                    {result.medicine_measures}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}