"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Stethoscope, 
  SearchX, 
  Clipboard, 
  Component, 
  Thermometer,
  TextSearch,
  ScanHeart,
  Expand,
  PanelRight,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  RefreshCw,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface DiseaseData {
  id: number;
  diseaseName: string;
  medicineMeasures: string;
  fever: boolean;
  headache: boolean;
  cough: boolean;
  nausea: boolean;
  vomiting: boolean;
  chestPain: boolean;
  breathlessness: boolean;
  abdominalPain: boolean;
  soreThroat: boolean;
  runnyNose: boolean;
  bodyAches: boolean;
  sweating: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MatchResult {
  disease: DiseaseData;
  score: number;
  matchedSymptoms: string[];
}

const EXAMPLE_PROMPTS = [
  "I have a high fever, headache, and body aches for the past 2 days",
  "Experiencing chest pain, shortness of breath, and sweating",
  "Stomach pain, nausea, and vomiting after eating",
  "Persistent cough, sore throat, and runny nose"
];

const SYMPTOM_SYNONYMS: Record<string, string[]> = {
  'fever': ['high_fever', 'mild_fever', 'temperature', 'hot'],
  'headache': ['head_pain', 'migraine', 'head_ache'],
  'cough': ['persistent_cough', 'dry_cough', 'wet_cough'],
  'nausea': ['sick', 'queasy', 'upset_stomach'],
  'vomiting': ['throwing_up', 'puking', 'sick'],
  'pain': ['ache', 'hurt', 'sore'],
  'breathing': ['breathlessness', 'shortness_of_breath', 'difficulty_breathing'],
  'stomach': ['abdominal_pain', 'belly', 'tummy'],
  'throat': ['sore_throat', 'throat_pain'],
  'chest': ['chest_pain', 'chest_discomfort'],
  'sweating': ['perspiration', 'sweat'],
  'runny_nose': ['nasal_discharge', 'stuffy_nose']
};

// Map component field names to API field names
const SYMPTOM_FIELD_MAPPING: Record<string, string> = {
  'fever': 'fever',
  'headache': 'headache',
  'cough': 'cough',
  'nausea': 'nausea',
  'vomiting': 'vomiting',
  'chest_pain': 'chestPain',
  'breathlessness': 'breathlessness',
  'abdominal_pain': 'abdominalPain',
  'sore_throat': 'soreThroat',
  'runny_nose': 'runnyNose',
  'body_aches': 'bodyAches',
  'sweating': 'sweating'
};

export default function DiagnosisAssistant() {
  const [diseases, setDiseases] = useState<DiseaseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>([]);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [selectedDisease, setSelectedDisease] = useState<MatchResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showAllResults, setShowAllResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  // Speech Recognition States
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognition | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  
  // Text-to-Speech States
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);

  // Initialize Speech Recognition and Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Speech Recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
          setIsListening(true);
          toast.info('Listening... Speak your symptoms now');
        };
        
        recognition.onresult = (event) => {
          const transcript = event.results[0].transcript;
          setPrompt(transcript);
          toast.success('Speech recognized! Analyzing...');
          
          // Auto-analyze after speech recognition
          setTimeout(() => {
            analyzeSymptoms(transcript);
          }, 500);
        };
        
        recognition.onerror = (event) => {
          setIsListening(false);
          toast.error(`Speech recognition error: ${event.error}`);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        setSpeechRecognition(recognition);
        setSpeechSupported(true);
      }
      
      // Speech Synthesis
      if ('speechSynthesis' in window) {
        setSpeechSynthesis(window.speechSynthesis);
      }
    }
  }, []);

  // Speech Recognition Functions
  const startListening = useCallback(() => {
    if (speechRecognition && !isListening) {
      speechRecognition.start();
    }
  }, [speechRecognition, isListening]);

  const stopListening = useCallback(() => {
    if (speechRecognition && isListening) {
      speechRecognition.stop();
      setIsListening(false);
    }
  }, [speechRecognition, isListening]);

  // Text-to-Speech Functions
  const speakAnalysis = useCallback((matchResults: MatchResult[]) => {
    if (!speechSynthesis || isSpeaking) return;

    let message = "Analysis complete. ";
    
    if (matchResults.length === 0) {
      message += "No specific disease matches found for your symptoms. Please consult a healthcare professional for proper evaluation.";
    } else {
      const topResult = matchResults[0];
      message += `Based on your symptoms, the most likely condition is ${topResult.disease.diseaseName} with a ${Math.round(topResult.score * 100)}% match. `;
      message += `Recommended treatment: ${topResult.disease.medicineMeasures} `;
      message += "Please remember, this is only a suggestion. Always consult with a healthcare professional for proper diagnosis and treatment.";
    }

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to use a pleasant voice
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Samantha') ||
      voice.name.includes('Karen') ||
      voice.gender === 'female'
    ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      toast.success('Reading analysis aloud...');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      toast.error('Speech synthesis failed');
    };

    speechSynthesis.speak(utterance);
  }, [speechSynthesis, isSpeaking]);

  const stopSpeaking = useCallback(() => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [speechSynthesis]);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem('diagnosis-recent-searches');
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse recent searches:', e);
        }
      }
    }
  }, []);

  // Save to recent searches
  const saveToRecentSearches = useCallback((search: string) => {
    if (typeof window !== "undefined") {
      const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('diagnosis-recent-searches', JSON.stringify(updated));
    }
  }, [recentSearches]);

  // Delete from recent searches
  const deleteFromRecentSearches = useCallback((searchToDelete: string) => {
    if (typeof window !== "undefined") {
      const updated = recentSearches.filter(s => s !== searchToDelete);
      setRecentSearches(updated);
      localStorage.setItem('diagnosis-recent-searches', JSON.stringify(updated));
      toast.success('Search deleted from history');
    }
  }, [recentSearches]);

  // Load diseases from API
  const loadDiseases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/diseases?limit=100');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setDiseases(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load diseases:', err);
      setError('Failed to load disease database. Please try again.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDiseases();
  }, [loadDiseases]);

  // Extract keywords and synonyms from prompt
  const extractKeywords = useCallback((text: string): string[] => {
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);

    const keywords = new Set<string>();

    words.forEach(word => {
      // Add original word
      keywords.add(word);
      
      // Add synonyms
      Object.entries(SYMPTOM_SYNONYMS).forEach(([key, synonyms]) => {
        if (synonyms.some(syn => syn.includes(word) || word.includes(key))) {
          keywords.add(key);
          synonyms.forEach(syn => keywords.add(syn));
        }
      });
    });

    return Array.from(keywords);
  }, []);

  // Search diseases using API
  const searchDiseasesBySymptoms = useCallback(async (keywords: string[]): Promise<DiseaseData[]> => {
    try {
      // Map keywords to proper field names for API
      const mappedSymptoms = keywords
        .map(keyword => {
          // Direct match
          if (SYMPTOM_FIELD_MAPPING[keyword]) {
            return SYMPTOM_FIELD_MAPPING[keyword];
          }
          
          // Check for partial matches
          const matchedKey = Object.keys(SYMPTOM_FIELD_MAPPING).find(key => 
            key.includes(keyword) || keyword.includes(key.replace('_', ''))
          );
          
          return matchedKey ? SYMPTOM_FIELD_MAPPING[matchedKey] : null;
        })
        .filter(Boolean) as string[];

      // Remove duplicates
      const uniqueSymptoms = [...new Set(mappedSymptoms)];

      if (uniqueSymptoms.length === 0) {
        return [];
      }

      const response = await fetch('/api/diseases/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms: uniqueSymptoms }),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Disease search failed:', err);
      toast.error('Failed to search diseases. Please try again.');
      return [];
    }
  }, []);

  // Convert API disease data to MatchResult format
  const convertToMatchResults = useCallback((apiDiseases: DiseaseData[], keywords: string[]): MatchResult[] => {
    return apiDiseases.map(disease => {
      const matchedSymptoms: string[] = [];
      
      // Check which symptoms match
      Object.entries(SYMPTOM_FIELD_MAPPING).forEach(([symptomKey, apiField]) => {
        if (disease[apiField as keyof DiseaseData] === true) {
          // Check if this symptom was in the original keywords
          const isMatched = keywords.some(keyword => 
            keyword.includes(symptomKey.replace('_', '')) || 
            symptomKey.includes(keyword) ||
            SYMPTOM_SYNONYMS[keyword]?.some(syn => syn.includes(symptomKey.replace('_', '')))
          );
          
          if (isMatched) {
            matchedSymptoms.push(symptomKey);
          }
        }
      });

      // Calculate score based on matched symptoms
      const score = matchedSymptoms.length / Math.max(keywords.length, 1);

      return {
        disease: {
          ...disease,
          name: disease.diseaseName,
          medicine: disease.medicineMeasures,
          symptoms: Object.fromEntries(
            Object.entries(SYMPTOM_FIELD_MAPPING).map(([key, apiField]) => [
              key, disease[apiField as keyof DiseaseData] as boolean
            ])
          )
        } as any,
        score,
        matchedSymptoms
      };
    }).sort((a, b) => b.score - a.score);
  }, []);

  // Analyze symptoms using API (modified to accept optional text parameter)
  const analyzeSymptoms = useCallback(async (textToAnalyze?: string) => {
    const analysisText = textToAnalyze || prompt;
    if (!analysisText.trim()) {
      toast.error('Please enter your symptoms');
      return;
    }

    setAnalyzing(true);
    
    try {
      const keywords = extractKeywords(analysisText);
      setExtractedKeywords(keywords);
      
      const apiResults = await searchDiseasesBySymptoms(keywords);
      const matchResults = convertToMatchResults(apiResults, keywords);

      setResults(matchResults);
      setSelectedDisease(matchResults[0] || null);
      
      saveToRecentSearches(analysisText);

      if (matchResults.length === 0) {
        toast.error('No matches found. Try mentioning specific symptoms like "fever", "cough", or "pain"');
      } else {
        toast.success(`Found ${matchResults.length} potential matches`);
      }

      // Automatically speak the analysis results
      setTimeout(() => {
        speakAnalysis(matchResults);
      }, 1000);

    } catch (err) {
      toast.error('Analysis failed. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  }, [prompt, extractKeywords, searchDiseasesBySymptoms, convertToMatchResults, saveToRecentSearches, speakAnalysis]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        analyzeSymptoms();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [analyzeSymptoms]);

  // Clear form
  const clearForm = useCallback(() => {
    setPrompt('');
    setExtractedKeywords([]);
    setResults([]);
    setSelectedDisease(null);
    setShowAllResults(false);
    stopSpeaking();
  }, [stopSpeaking]);

  // Use example
  const useExample = useCallback(() => {
    const randomExample = EXAMPLE_PROMPTS[Math.floor(Math.random() * EXAMPLE_PROMPTS.length)];
    setPrompt(randomExample);
  }, []);

  // Copy recommendation
  const copyRecommendation = useCallback(() => {
    if (selectedDisease) {
      const text = `Disease: ${selectedDisease.disease.diseaseName}\nRecommendation: ${selectedDisease.disease.medicineMeasures}`;
      navigator.clipboard.writeText(text);
      toast.success('Recommendation copied to clipboard');
    }
  }, [selectedDisease]);

  // Save note
  const saveNote = useCallback(() => {
    if (selectedDisease && typeof window !== "undefined") {
      const note = {
        disease: selectedDisease.disease.diseaseName,
        medicine: selectedDisease.disease.medicineMeasures,
        symptoms: selectedDisease.matchedSymptoms,
        timestamp: new Date().toISOString()
      };
      
      const saved = localStorage.getItem('diagnosis-notes') || '[]';
      const notes = JSON.parse(saved);
      notes.push(note);
      localStorage.setItem('diagnosis-notes', JSON.stringify(notes));
      
      toast.success('Note saved successfully');
    }
  }, [selectedDisease]);

  // Remove keyword
  const removeKeyword = useCallback((keyword: string) => {
    setExtractedKeywords(prev => prev.filter(k => k !== keyword));
  }, []);

  if (loading) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <Stethoscope className="w-6 h-6 animate-pulse text-primary" />
            <span className="text-muted-foreground">Loading disease database...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
          <SearchX className="w-12 h-12 text-destructive" />
          <p className="text-destructive text-center">{error}</p>
          <Button onClick={loadDiseases} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const visibleResults = showAllResults ? results : results.slice(0, 5);

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <ScanHeart className="w-6 h-6 text-primary" />
          Symptom Analysis Assistant
        </CardTitle>
        <p className="text-muted-foreground">
          Describe your symptoms in natural language or use voice input for instant analysis and recommendations.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="space-y-3">
              <label htmlFor="symptoms" className="text-sm font-medium">
                Describe Your Symptoms
              </label>
              <div className="relative">
                <Textarea
                  id="symptoms"
                  placeholder="Example: I have a high fever, headache, and body aches for the past 2 days..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                  className="resize-none pr-12"
                />
                {/* Speech Recognition Button */}
                {speechSupported && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`absolute top-2 right-2 p-2 ${
                      isListening 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
                    onClick={isListening ? stopListening : startListening}
                    disabled={analyzing}
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>
              {speechSupported && (
                <p className="text-xs text-muted-foreground">
                  💡 Click the microphone button to speak your symptoms directly
                </p>
              )}
            </div>

            {/* Extracted Keywords */}
            {extractedKeywords.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Detected Symptoms</label>
                <div className="flex flex-wrap gap-2">
                  {extractedKeywords.map((keyword, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeKeyword(keyword)}
                    >
                      {keyword.replace('_', ' ')} ✕
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Click on symptoms to remove them before analyzing
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => analyzeSymptoms()}
                disabled={analyzing || !prompt.trim()}
                className="min-w-32"
              >
                {analyzing ? (
                  <>
                    <TextSearch className="w-4 h-4 mr-2 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <TextSearch className="w-4 h-4 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
              
              <Button variant="outline" onClick={clearForm}>
                Clear
              </Button>
              
              <Button variant="ghost" onClick={useExample}>
                Use Example
              </Button>

              {/* Stop Speaking Button */}
              {isSpeaking && (
                <Button variant="outline" onClick={stopSpeaking}>
                  <VolumeX className="w-4 h-4 mr-2" />
                  Stop Reading
                </Button>
              )}
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Recent Searches</label>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 rounded hover:bg-muted group"
                    >
                      <button
                        onClick={() => setPrompt(search)}
                        className="flex-1 text-left text-sm text-muted-foreground hover:text-foreground truncate"
                      >
                        {search}
                      </button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                        onClick={() => deleteFromRecentSearches(search)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {results.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Analysis Results</h4>
                  <Badge variant="outline">
                    {results.length} matches
                  </Badge>
                </div>

                {/* Results List */}
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {visibleResults.map((result, index) => (
                      <div
                        key={result.disease.id || index}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedDisease?.disease.id === result.disease.id
                            ? 'border-primary bg-accent'
                            : 'border-border hover:bg-muted'
                        }`}
                        onClick={() => setSelectedDisease(result)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-medium">{result.disease.diseaseName}</h5>
                          <Badge variant="secondary" className="text-xs">
                            {Math.round(result.score * 100)}%
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {result.matchedSymptoms.slice(0, 3).map((symptom, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {symptom.replace('_', ' ')}
                            </Badge>
                          ))}
                          {result.matchedSymptoms.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{result.matchedSymptoms.length - 3} more
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <PanelRight className="w-3 h-3 mr-1" />
                          Click for details
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {results.length > 5 && !showAllResults && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllResults(true)}
                    className="w-full"
                  >
                    <Expand className="w-4 h-4 mr-2" />
                    Show {results.length - 5} more results
                  </Button>
                )}

                <Separator />

                {/* Disease Detail */}
                {selectedDisease && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Disease Details</h4>
                      <Badge>
                        {Math.round(selectedDisease.score * 100)}% match
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <h5 className="font-medium text-lg">{selectedDisease.disease.diseaseName}</h5>
                      
                      <div>
                        <h6 className="font-medium mb-2">Matched Symptoms</h6>
                        <div className="flex flex-wrap gap-1">
                          {selectedDisease.matchedSymptoms.map((symptom, i) => (
                            <Badge key={i} variant="secondary">
                              <Thermometer className="w-3 h-3 mr-1" />
                              {symptom.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h6 className="font-medium mb-2">Recommended Actions</h6>
                        <p className="text-sm bg-muted p-3 rounded-lg">
                          {selectedDisease.disease.medicineMeasures}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={copyRecommendation}>
                          <Clipboard className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                        
                        <Button variant="outline" size="sm" onClick={saveNote}>
                          Save Note
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toast.info('This feature helps improve our database accuracy')}
                        >
                          Report Issue
                        </Button>
                      </div>

                      {/* Voice Features Info */}
                      {speechSupported && (
                        <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Volume2 className="w-4 h-4 text-blue-600 mt-0.5" />
                            <div className="text-sm text-blue-800">
                              <p className="font-medium mb-1">🎤 Voice-Enabled Analysis</p>
                              <p className="text-xs text-blue-600">
                                Use the microphone button to speak your symptoms. Analysis results will be automatically read aloud!
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : extractedKeywords.length > 0 && !analyzing ? (
              <div className="text-center py-12">
                <SearchX className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">No matches found</p>
                <p className="text-sm text-muted-foreground">
                  Try mentioning symptoms like "fever", "cough", "pain", or "nausea"
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <Stethoscope className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Enter your symptoms to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}