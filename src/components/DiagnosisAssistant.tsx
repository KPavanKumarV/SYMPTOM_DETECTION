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
  Mic
} from 'lucide-react';
import { toast } from 'sonner';

interface DiseaseData {
  name: string;
  medicine: string;
  symptoms: Record<string, boolean>;
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
  
  // Voice Assistant States
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);

  // Initialize Speech Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
      setIsVoiceEnabled(true);
    }
  }, []);

  // Voice Assistant Functions
  const stopSpeaking = useCallback(() => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [speechSynthesis]);

  const speakRecommendation = useCallback(() => {
    if (!speechSynthesis || !selectedDisease || isSpeaking) return;

    stopSpeaking();
    setIsSpeaking(true);

    const disease = selectedDisease.disease;
    
    // Create the voice message
    const voiceMessage = `
      Hello! I'm your AI Medical Voice Assistant.
      
      Based on your symptoms, the recommended treatment is: ${disease.medicine}
      
      Please remember, don't worry too much about your symptoms. While this information can be helpful, 
      it's always best to consult with a qualified healthcare professional for proper diagnosis and treatment.
      
      Your health is important, and a doctor can provide personalized care based on your specific situation.
      
      Take care of yourself, and don't hesitate to seek medical attention if your symptoms worsen or persist.
    `.trim();

    const utterance = new SpeechSynthesisUtterance(voiceMessage);
    
    // Configure voice settings
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
      toast.success('Voice assistant is speaking...');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      toast.success('Voice message completed');
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      toast.error('Voice synthesis failed');
    };

    speechSynthesis.speak(utterance);
  }, [speechSynthesis, selectedDisease, isSpeaking, stopSpeaking]);

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

  // Load and parse CSV dataset
  const loadDataset = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock CSV data since we can't load external files in this context
      const mockCsvData = `disease_name,medicine_measures,fever,headache,cough,nausea,vomiting,chest_pain,breathlessness,abdominal_pain,sore_throat,runny_nose,body_aches,sweating
Common Cold,Rest and fluids. Take paracetamol for symptoms. Use nasal decongestants.,0,1,1,0,0,0,0,0,1,1,1,0
Influenza,Antiviral medications within 48 hours. Rest and increase fluid intake.,1,1,1,1,0,0,0,0,1,1,1,1
Food Poisoning,Oral rehydration therapy. Avoid solid foods initially. Seek medical help if severe.,0,1,0,1,1,0,0,1,0,0,1,0
Heart Attack,EMERGENCY: Call 911 immediately. Chew aspirin if not allergic. Do not drive yourself.,0,0,0,1,0,1,1,0,0,0,0,1
Gastritis,Avoid spicy foods. Take antacids. Eat small frequent meals.,0,1,0,1,1,0,0,1,0,0,0,0
Bronchitis,Rest and fluids. Use humidifier. Cough suppressants may help.,0,1,1,0,0,0,1,0,0,0,1,0
Anxiety Attack,Practice deep breathing. Remove from stressful environment. Consider counseling.,0,1,0,0,0,1,1,0,0,0,0,1
Migraine,Dark quiet room. Pain relievers. Apply cold compress to head.,0,1,0,1,1,0,0,0,0,0,1,0`;

      const lines = mockCsvData.trim().split('\n');
      const headers = lines[0].split(',');
      
      const parsedDiseases: DiseaseData[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const disease: DiseaseData = {
          name: values[0],
          medicine: values[1],
          symptoms: {}
        };
        
        // Map symptom columns (starting from index 2)
        for (let j = 2; j < headers.length; j++) {
          const symptomName = headers[j].trim().toLowerCase();
          disease.symptoms[symptomName] = values[j] === '1';
        }
        
        parsedDiseases.push(disease);
      }
      
      setDiseases(parsedDiseases);
      setLoading(false);
    } catch (err) {
      setError('Failed to load disease database. Please try again.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDataset();
  }, [loadDataset]);

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

  // Match symptoms against disease database
  const matchDiseases = useCallback((keywords: string[]): MatchResult[] => {
    const results: MatchResult[] = [];

    diseases.forEach(disease => {
      const matchedSymptoms: string[] = [];
      let matchCount = 0;

      keywords.forEach(keyword => {
        Object.keys(disease.symptoms).forEach(symptom => {
          if (disease.symptoms[symptom] && 
              (symptom.includes(keyword) || keyword.includes(symptom))) {
            matchedSymptoms.push(symptom);
            matchCount++;
          }
        });
      });

      if (matchCount > 0) {
        const score = matchCount / keywords.length;
        results.push({
          disease,
          score,
          matchedSymptoms: [...new Set(matchedSymptoms)]
        });
      }
    });

    return results.sort((a, b) => b.score - a.score);
  }, [diseases]);

  // Analyze symptoms
  const analyzeSymptoms = useCallback(async () => {
    if (!prompt.trim()) {
      toast.error('Please enter your symptoms');
      return;
    }

    setAnalyzing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    const keywords = extractKeywords(prompt);
    const matchResults = matchDiseases(keywords);

    setExtractedKeywords(keywords);
    setResults(matchResults);
    setSelectedDisease(matchResults[0] || null);
    setAnalyzing(false);
    
    saveToRecentSearches(prompt);

    if (matchResults.length === 0) {
      toast.error('No matches found. Try mentioning specific symptoms like "fever", "cough", or "pain"');
    } else {
      toast.success(`Found ${matchResults.length} potential matches`);
    }
  }, [prompt, extractKeywords, matchDiseases, saveToRecentSearches]);

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
  }, []);

  // Use example
  const useExample = useCallback(() => {
    const randomExample = EXAMPLE_PROMPTS[Math.floor(Math.random() * EXAMPLE_PROMPTS.length)];
    setPrompt(randomExample);
  }, []);

  // Copy recommendation
  const copyRecommendation = useCallback(() => {
    if (selectedDisease) {
      const text = `Disease: ${selectedDisease.disease.name}\nRecommendation: ${selectedDisease.disease.medicine}`;
      navigator.clipboard.writeText(text);
      toast.success('Recommendation copied to clipboard');
    }
  }, [selectedDisease]);

  // Save note
  const saveNote = useCallback(() => {
    if (selectedDisease && typeof window !== "undefined") {
      const note = {
        disease: selectedDisease.disease.name,
        medicine: selectedDisease.disease.medicine,
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
          <Button onClick={loadDataset} variant="outline">
            <Component className="w-4 h-4 mr-2" />
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
          Describe your symptoms in natural language for potential disease matches and recommendations.
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
              <Textarea
                id="symptoms"
                placeholder="Example: I have a high fever, headache, and body aches for the past 2 days..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
                className="resize-none"
              />
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
                onClick={analyzeSymptoms}
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
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Recent Searches</label>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setPrompt(search)}
                      className="block w-full text-left text-sm text-muted-foreground hover:text-foreground p-2 rounded hover:bg-muted truncate"
                    >
                      {search}
                    </button>
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
                        key={index}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedDisease?.disease.name === result.disease.name
                            ? 'border-primary bg-accent'
                            : 'border-border hover:bg-muted'
                        }`}
                        onClick={() => setSelectedDisease(result)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-medium">{result.disease.name}</h5>
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
                      <h5 className="font-medium text-lg">{selectedDisease.disease.name}</h5>
                      
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
                          {selectedDisease.disease.medicine}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={copyRecommendation}>
                          <Clipboard className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                        
                        {/* Voice Assistant Button */}
                        {isVoiceEnabled && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={isSpeaking ? stopSpeaking : speakRecommendation}
                            className={isSpeaking ? "bg-green-50 border-green-200 text-green-700" : ""}
                          >
                            {isSpeaking ? (
                              <>
                                <VolumeX className="w-4 h-4 mr-2" />
                                Stop Voice
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-4 h-4 mr-2" />
                                Voice Assistant
                              </>
                            )}
                          </Button>
                        )}
                        
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

                      {/* Voice Assistant Info */}
                      {isVoiceEnabled && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Mic className="w-4 h-4 text-blue-600 mt-0.5" />
                            <div className="text-sm text-blue-800">
                              <p className="font-medium mb-1">AI Voice Assistant Available</p>
                              <p className="text-xs text-blue-600">
                                Click "Voice Assistant" to hear the treatment recommendations read aloud with reassuring guidance.
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