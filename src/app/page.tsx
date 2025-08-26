import DiagnosisAssistant from '@/components/DiagnosisAssistant';
import { Stethoscope, Database, AlertTriangle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Stethoscope className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  Medical Diagnosis Assistant
                </h1>
                <p className="text-sm text-slate-600">
                  AI-powered symptom analysis and disease suggestion
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <Database className="w-4 h-4" />
              <span>Medical Database v2.1</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Instructions */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-slate-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
              <div className="text-sm text-slate-700">
                <p className="font-medium mb-1">Important Disclaimer</p>
                <p className="text-xs leading-relaxed">
                  This tool provides informational suggestions only and should not replace professional medical advice. 
                  Always consult healthcare providers for accurate diagnosis and treatment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnosis Assistant Component */}
        <div className="flex justify-center">
          <DiagnosisAssistant />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/60 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span>Dataset: Medical Symptoms Database 2024</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-slate-300"></div>
              <span className="hidden sm:inline">8 conditions • 13 symptoms</span>
            </div>
            <div className="text-xs text-slate-500">
              <p>For educational and research purposes only</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}