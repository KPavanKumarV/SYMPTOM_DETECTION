# 🏥 Medical Diagnosis Assistant

> AI-powered symptom analysis web application with advanced pattern recognition algorithms

An intelligent medical diagnosis assistant that analyzes patient symptoms using custom pattern recognition algorithms trained on a comprehensive medical dataset. Features real-time speech-to-text input, automated voice responses, and confidence-scored disease suggestions.

![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat&logo=tailwind-css)

## ⚠️ Disclaimer

**This tool provides informational suggestions only and should NOT replace professional medical advice.** Always consult qualified healthcare providers for accurate diagnosis and treatment. This application is designed for educational and preliminary assessment purposes.

## ✨ Features

### 🧠 **Intelligent Pattern Recognition**
- Custom AI algorithms analyzing 130+ medical symptoms
- Binary symptom mapping with natural language processing
- Fuzzy string matching using Levenshtein distance
- Combined scoring system (80% pattern matching + 20% fuzzy matching)
- Confidence levels: High, Medium, Low

### 🎤 **Advanced Speech Integration**
- **Voice Input**: Continuous speech recognition with manual control
- **Voice Output**: Automatic text-to-speech for diagnosis results
- Real-time transcription and visual feedback
- Web Speech API integration

### 💊 **Comprehensive Medical Database**
- **4 Disease Categories**: Fungal infection, Allergy, GERD, Chronic cholestasis
- **130+ Binary Symptoms**: Mapped from clinical training dataset
- **Treatment Recommendations**: Evidence-based medicine suggestions
- **Zero External Dependencies**: Pure pattern recognition, no database required

### 🎨 **Modern User Experience**
- Light/Dark theme switching with smooth transitions
- Responsive design (Desktop, Tablet, Mobile)
- Recent search history with deletion options
- Glass morphism UI effects
- Toast notifications for user feedback
- Clinical, professional interface design

## 🛠️ Tech Stack

**Frontend Framework:**
- Next.js 15 (App Router)
- React 19
- TypeScript

**Styling & UI:**
- Tailwind CSS v4
- shadcn/ui components
- Radix UI primitives
- Lucide React icons
- Framer Motion animations

**Core Features:**
- Web Speech API (Speech Recognition & Synthesis)
- Custom Pattern Recognition Algorithms
- LocalStorage for persistence
- next-themes for theme management
- Sonner for toast notifications

## 📦 Installation

### Prerequisites
- Node.js 18+ or Bun
- npm/yarn/pnpm/bun package manager

### Setup

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/medical-diagnosis-assistant.git
cd medical-diagnosis-assistant
```

2. **Install dependencies:**
```bash
npm install
# or
bun install
```

3. **Run the development server:**
```bash
npm run dev
# or
bun dev
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Usage

### Basic Workflow

1. **Describe Symptoms**
   - Type symptoms in the input field, or
   - Click the microphone icon to use voice input
   - Describe symptoms naturally (e.g., "I have itching, skin rash, and heartburn")

2. **Get Analysis**
   - Click "Analyze Symptoms" button
   - AI processes your input against the medical dataset
   - Results appear with confidence scores

3. **Review Results**
   - View suggested conditions ranked by confidence
   - Read treatment recommendations
   - Listen to results via automatic text-to-speech
   - Access recent searches from history

### Voice Commands

- **Start Recording**: Click microphone icon
- **Stop Recording**: Click stop icon or say your symptoms completely
- **Playback**: Results are automatically read aloud (can be disabled)

## 📊 Dataset Information

### Training Data Structure

The application uses a custom medical dataset with:

- **4 Disease Categories**:
  1. Fungal infection
  2. Allergy
  3. GERD (Gastroesophageal Reflux Disease)
  4. Chronic cholestasis

- **130+ Symptoms** (Binary Format: 0=absent, 1=present)
- **Treatment Protocols** for each condition

### Pattern Recognition Algorithm

```typescript
// Symptom Similarity Calculation
Score = (0.8 × Pattern Match) + (0.2 × Fuzzy Match)

// Confidence Levels
High:   Score ≥ 0.7
Medium: Score ≥ 0.4
Low:    Score < 0.4
```

## 📁 Project Structure

```
medical-diagnosis-assistant/
├── src/
│   ├── app/
│   │   ├── globals.css          # Tailwind + custom medical themes
│   │   ├── layout.tsx           # Root layout with theme provider
│   │   └── page.tsx             # Main homepage
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── DiagnosisAssistant.tsx  # Core diagnosis logic
│   │   ├── theme-provider.tsx   # Theme context
│   │   └── theme-toggle.tsx     # Light/dark mode toggle
│   ├── hooks/                   # Custom React hooks
│   └── lib/                     # Utilities and configurations
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🔧 Configuration

### Environment Variables

No environment variables required! The application runs entirely client-side with embedded dataset.

### Customization

**Add New Diseases:**
Edit `src/components/DiagnosisAssistant.tsx` and add to `trainingData` array:

```typescript
{
  disease: "Your Disease Name",
  symptoms: {
    symptom_name: 1,
    another_symptom: 1,
    // ... more symptoms
  },
  treatment: "Recommended treatment protocol",
  keywords: ["keyword1", "keyword2"]
}
```

## 🎯 Key Features Explained

### 1. **No Database Required**
All diagnosis logic runs client-side using the embedded training dataset, ensuring:
- Instant responses
- Privacy (no data sent to servers)
- Zero infrastructure costs
- Offline capability potential

### 2. **Advanced NLP Processing**
- Tokenization of user input
- Fuzzy string matching for typo tolerance
- Keyword extraction and mapping
- Multi-symptom correlation analysis

### 3. **Accessibility First**
- ARIA labels for screen readers
- Keyboard navigation support
- High contrast theme options
- Voice interface for hands-free operation

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Areas for Contribution
- [ ] Expand medical dataset (more diseases/symptoms)
- [ ] Multi-language support
- [ ] Export diagnosis reports (PDF/Email)
- [ ] Integration with EHR systems
- [ ] Mobile app version
- [ ] Additional ML models

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Medical dataset based on clinical symptom databases
- shadcn/ui for beautiful component library
- Vercel for Next.js framework
- Web Speech API for voice capabilities

## 📧 Contact

For questions, feedback, or collaboration opportunities:

- **Project Link**: [https://github.com/yourusername/medical-diagnosis-assistant](https://github.com/yourusername/medical-diagnosis-assistant)
- **Issues**: [Report a bug or request a feature](https://github.com/yourusername/medical-diagnosis-assistant/issues)

---

**Built with ❤️ for improving preliminary medical assessments and health education**

