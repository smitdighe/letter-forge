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
      const response = await fetch('http://localhost:5000/api/generate', {
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
    <div className="min-h-screen bg-dark relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-accent/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-4 tracking-tight"
          >
            <span className="bg-gradient-to-r from-accent-light via-accent to-accent-dark bg-clip-text text-transparent">
              Letter Forge
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-400 font-light"
          >
            Cover letters that actually get read.
          </motion.p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent/30 via-accent/20 to-accent/30 rounded-2xl blur-xl" />
          <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="space-y-6">
              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job posting here..."
                  className="w-full h-40 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-300 resize-none backdrop-blur-sm"
                />
              </div>

              {/* Your Background */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Background
                </label>
                <textarea
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  placeholder="Describe your experience, skills, and achievements..."
                  className="w-full h-40 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-300 resize-none backdrop-blur-sm"
                />
              </div>

              {/* Tone Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Tone
                </label>
                <div className="flex flex-wrap gap-3">
                  {tones.map((tone) => (
                    <motion.button
                      key={tone}
                      onClick={() => setSelectedTone(tone)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                        selectedTone === tone
                          ? 'bg-gradient-to-r from-accent to-accent-dark text-white shadow-lg shadow-accent/30'
                          : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {tone}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <motion.button
                onClick={handleGenerate}
                disabled={isLoading || !jobDescription.trim() || !background.trim()}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`w-full py-4 rounded-xl font-semibold text-lg relative overflow-hidden transition-all duration-300 ${
                  !jobDescription.trim() || !background.trim()
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-accent via-accent-dark to-accent text-white hover:animate-pulse-glow'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoadingDots />
                    <span>Generating...</span>
                  </span>
                ) : (
                  'Generate Cover Letter'
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Output Section */}
        <AnimatePresence>
          {coverLetter && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="mt-8 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 rounded-2xl blur-xl" />
              <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Your Cover Letter</h2>
                  <motion.button
                    onClick={handleCopy}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    <AnimatePresence mode="wait">
                      {copied ? (
                        <motion.span
                          key="check"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className="flex items-center gap-1.5 text-green-400"
                        >
                          <CheckIcon />
                          Copied!
                        </motion.span>
                      ) : (
                        <motion.span
                          key="copy"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-1.5"
                        >
                          <CopyIcon />
                          Copy
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="bg-white/5 rounded-xl p-5 border border-white/5"
                >
                  <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {coverLetter}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-16 text-gray-500 text-sm"
        >
          <p>Built with AI to help you land your dream job</p>
        </motion.footer>
      </div>
    </div>
  )
}

function LoadingDots() {
  return (
    <span className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 bg-white rounded-full"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </span>
  )
}

function CopyIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default App
