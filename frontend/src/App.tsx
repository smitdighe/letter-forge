import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Tone = 'Professional' | 'Enthusiastic' | 'Concise'

const tones: Tone[] = ['Professional', 'Enthusiastic', 'Concise']

function App() {
  const [jobDescription, setJobDescription] = useState('')
  const [background, setBackground] = useState('')
  const [selectedTone, setSelectedTone] = useState<Tone>('Professional')
  const [coverLetter, setCoverLetter] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!jobDescription.trim() || !background.trim()) return

    setIsLoading(true)
    setCoverLetter('')

    try {
      const response = await fetch('https://letter-forge.onrender.com/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription,
          background,
          tone: selectedTone.toLowerCase(),
        }),
      })

      const data = await response.json()
      setCoverLetter(data.coverLetter)
    } catch (error) {
      setCoverLetter('Unable to generate cover letter. Please check that the API server is running at http://localhost:5000')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!coverLetter) return
    await navigator.clipboard.writeText(coverLetter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-base">
      <div className="max-w-2xl mx-auto px-6 py-16 sm:py-24">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
          className="mb-12"
        >
          <div className="flex items-baseline gap-3 mb-3">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Letter Forge
            </h1>
            <span className="text-xs font-medium text-amber px-2 py-0.5 rounded-full bg-amber/10 border border-amber/20">
              Beta
            </span>
          </div>
          <p className="text-white/50 text-sm">
            Cover letters that actually get read.
          </p>
        </motion.header>

        {/* Main Form */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0, 1] }}
        >
          {/* Job Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/70 mb-2">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job posting here..."
              className="w-full h-36 px-4 py-3 bg-surface border border-border rounded-lg text-white placeholder:text-white/25 focus:outline-none focus:border-white/20 focus:bg-surface-hover transition-colors resize-none"
            />
          </div>

          {/* Your Background */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/70 mb-2">
              Your Background
            </label>
            <textarea
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              placeholder="Describe your experience, skills, and achievements..."
              className="w-full h-36 px-4 py-3 bg-surface border border-border rounded-lg text-white placeholder:text-white/25 focus:outline-none focus:border-white/20 focus:bg-surface-hover transition-colors resize-none"
            />
          </div>

          {/* Tone Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/70 mb-2.5">
              Tone
            </label>
            <div className="inline-flex bg-surface border border-border rounded-lg p-1">
              {tones.map((tone) => (
                <button
                  key={tone}
                  onClick={() => setSelectedTone(tone)}
                  className={`px-4 py-1.5 text-sm rounded-md font-medium transition-all ${
                    selectedTone === tone
                      ? 'bg-white/10 text-white'
                      : 'text-white/50 hover:text-white/70'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <motion.button
            onClick={handleGenerate}
            disabled={isLoading || !jobDescription.trim() || !background.trim()}
            whileTap={{ scale: 0.995 }}
            className={`w-full py-3 rounded-lg font-medium text-sm transition-all ${
              !jobDescription.trim() || !background.trim()
                ? 'bg-white/5 text-white/30 cursor-not-allowed border border-border'
                : 'bg-white text-base hover:bg-white/90 shadow-sm'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner />
                <span>Generating...</span>
              </span>
            ) : (
              'Generate Cover Letter'
            )}
          </motion.button>
        </motion.main>

        {/* Output Section */}
        <AnimatePresence>
          {coverLetter && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0, 1] }}
              className="mt-8"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-white/70">Output</h2>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors px-2 py-1 rounded hover:bg-white/5"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.span
                        key="check"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1 text-amber"
                      >
                        <CheckIcon />
                        Copied
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1"
                      >
                        <CopyIcon />
                        Copy
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
              <div className="bg-surface border border-border rounded-lg p-5">
                <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                  {coverLetter}
                </p>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t border-border"
        >
          <p className="text-center text-white/30 text-xs">
            Built with AI to help you land your dream job
          </p>
        </motion.footer>
      </div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
    />
  )
}

function CopyIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default App
