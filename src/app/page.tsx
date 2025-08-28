import DiagnosisAssistant from '@/components/DiagnosisAssistant';
import { ThemeToggle } from '@/components/theme-toggle';
import { Stethoscope, AlertTriangle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-medical-light dark:bg-medical-dark transition-colors duration-300">
      {/* Header */}
      <header className="border-b header-glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900/50 dark:to-blue-900/50 rounded-lg">
                <Stethoscope className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Medical Diagnosis Assistant
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  AI-powered symptom analysis with pattern recognition
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Instructions */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="card-glass rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400 mt-0.5" />
              <div className="text-sm text-slate-700 dark:text-slate-300">
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
      <footer className="border-t header-glass mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
              {/* Empty space for potential future content */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}