"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Search, X, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

// Training dataset - you can replace this with your own dataset
const TRAINING_DATASET = [
  {
    id: 1,
    disease_name: "Common Cold",
    medicine_measures: "Rest and fluids. Take paracetamol for symptoms. Use nasal decongestants.",
    symptoms: {
      fever: 0, headache: 1, cough: 1, nausea: 0, vomiting: 0, 
      chest_pain: 0, breathlessness: 0, abdominal_pain: 0, 
      sore_throat: 1, runny_nose: 1, body_aches: 1, sweating: 0
    }
  },
  {
    id: 2,
    disease_name: "Influenza",
    medicine_measures: "Antiviral medications within 48 hours. Rest and increase fluid intake.",
    symptoms: {
      fever: 1, headache: 1, cough: 1, nausea: 1, vomiting: 0,
      chest_pain: 0, breathlessness: 0, abdominal_pain: 0,
      sore_throat: 1, runny_nose: 1, body_aches: 1, sweating: 1
    }
  },
  {
    id: 3,
    disease_name: "Food Poisoning",
    medicine_measures: "Stay hydrated with clear fluids. Avoid solid foods initially. Seek medical help if severe.",
    symptoms: {
      fever: 1, headache: 0, cough: 0, nausea: 1, vomiting: 1,
      chest_pain: 0, breathlessness: 0, abdominal_pain: 1,
      sore_throat: 0, runny_nose: 0, body_aches: 1, sweating: 1
    }
  },
  {
    id: 4,
    disease_name: "Pneumonia",
    medicine_measures: "Antibiotics prescribed by doctor. Rest and adequate hydration. Monitor breathing.",
    symptoms: {
      fever: 1, headache: 1, cough: 1, nausea: 0, vomiting: 0,
      chest_pain: 1, breathlessness: 1, abdominal_pain: 0,
      sore_throat: 0, runny_nose: 0, body_aches: 1, sweating: 1
    }
  },
  {
    id: 5,
    disease_name: "Migraine",
    medicine_measures: "Pain relievers and rest in dark, quiet room. Avoid triggers like bright lights.",
    symptoms: {
      fever: 0, headache: 1, cough: 0, nausea: 1, vomiting: 1,
      chest_pain: 0, breathlessness: 0, abdominal_pain: 0,
      sore_throat: 0, runny_nose: 0, body_aches: 0, sweating: 0
    }
  },
  {
    id: 6,
    disease_name: "Gastroenteritis",
    medicine_measures: "Oral rehydration solutions. Avoid dairy and fatty foods. Gradual return to normal diet.",
    symptoms: {
      fever: 1, headache: 1, cough: 0, nausea: 1, vomiting: 1,
      chest_pain: 0, breathlessness: 0, abdominal_pain: 1,
      sore_throat: 0, runny_nose: 0, body_aches: 1, sweating: 0
    }
  },
  {
    id: 7,
    disease_name: "Bronchitis",
    medicine_measures: "Cough suppressants and expectorants. Stay hydrated. Avoid smoke and irritants.",
    symptoms: {
      fever: 1, headache: 1, cough: 1, nausea: 0, vomiting: 0,
      chest_pain: 1, breathlessness: 1, abdominal_pain: 0,
      sore_throat: 1, runny_nose: 0, body_aches: 1, sweating: 0
    }
  },
  {
    id: 8,
    disease_name: "Angina",
    medicine_measures: "Immediate rest and medication as prescribed. Seek urgent medical attention for chest pain.",
    symptoms: {
      fever: 0, headache: 0, cough: 0, nausea: 1, vomiting: 0,
      chest_pain: 1, breathlessness: 1, abdominal_pain: 0,
      sore_throat: 0, runny_nose: 0, body_aches: 0, sweating: 1
    }
  }
];

// Pattern recognition algorithm for symptom matching
function calculateSymptomSimilarity(userSymptoms: string[], diseaseSymptoms: any): number {
  const symptomKeywords = {
    fever: ['fever', 'hot', 'temperature', 'burning', 'heat'],
    headache: ['headache', 'head pain', 'migraine', 'head ache'],
    cough: ['cough', 'coughing', 'throat clearing'],
    nausea: ['nausea', 'nauseous', 'sick', 'queasy'],
    vomiting: ['vomiting', 'vomit', 'throw up', 'throwing up'],
    chest_pain: ['chest pain', 'chest ache', 'heart pain', 'chest discomfort'],
    breathlessness: ['breathless', 'shortness of breath', 'breathing difficulty', 'cannot breathe'],
    abdominal_pain: ['stomach ache', 'abdominal pain', 'belly pain', 'stomach pain'],
    sore_throat: ['sore throat', 'throat pain', 'throat ache'],
    runny_nose: ['runny nose', 'nasal discharge', 'stuffy nose', 'blocked nose'],
    body_aches: ['body aches', 'muscle pain', 'joint pain', 'body pain'],
    sweating: ['sweating', 'perspiration', 'sweats', 'night sweats']
  };

  let matchScore = 0;
  let totalPossibleScore = 0;

  const userText = userSymptoms.join(' ').toLowerCase();

  Object.keys(symptomKeywords).forEach(symptom => {
    totalPossibleScore += diseaseSymptoms[symptom];
    
    if (diseaseSymptoms[symptom] === 1) {
      const keywords = symptomKeywords[symptom as keyof typeof symptomKeywords];
      const hasMatch = keywords.some(keyword => userText.includes(keyword));
      if (hasMatch) {
        matchScore += 1;
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
    
    // Pattern recognition analysis
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
      }).filter(result => result.similarity > 10)
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
        const message = `Based on your symptoms, the most likely condition is ${topResult.disease_name} with ${topResult.similarity}% similarity. ${topResult.medicine_measures} Please consult a healthcare provider for proper diagnosis.`;
        
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(message);
          utterance.rate = 0.9;
          utterance.pitch = 1;
          speechSynthesis.speak(utterance);
        }
        
        toast.success(`Analysis complete - ${analysisResults.length} potential matches found`);
      } else {
        toast.warning('No clear matches found. Please try describing symptoms differently.');
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
                  placeholder="Example: I have fever, headache, and cough for 2 days..."
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
                <>Analyzing symptoms...</>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze Symptoms
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
              Analysis Results ({results.length} matches found)
            </h3>
            <div className="space-y-4">
              {results.map((result) => (
                <div key={result.id} className="border rounded-lg p-4 bg-slate-50/50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-800">{result.disease_name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={result.confidence === 'High' ? 'default' : 'secondary'}>
                          {result.similarity}% Match
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