import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'

type Tone = 'Professional' | 'Enthusiastic' | 'Concise'

const tones: Tone[] = ['Professional', 'Enthusiastic', 'Concise']
const titleLetters = "Letter Forge".split("")

function App() {
  const [jobDescription, setJobDescription] = useState('')
  const [background, setBackground] = useState('')
  const [selectedTone, setSelectedTone] = useState<Tone>('Professional')
  const [coverLetter, setCoverLetter] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [displayedText, setDisplayedText] = useState('')

  const cursorX = useMotionValue(-1000)
  const cursorY = useMotionValue(-1000)
  const springX = useSpring(cursorX, { stiffness: 250, damping: 30, mass: 0.5 })
  const springY = useSpring(cursorY, { stiffness: 250, damping: 30, mass: 0.5 })

  
  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [cursorX, cursorY])
  
  useEffect(() => {
    if (!coverLetter) return
    setDisplayedText('')
    let i = 0
    const interval = setInterval(() => {
      setDisplayedText(coverLetter.slice(0, i))
      i++
      if (i > coverLetter.length) clearInterval(interval)
    }, 6)
    return () => clearInterval(interval)
  }, [coverLetter])

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
    <div className="min-h-screen relative overflow-hidden bg-transparent">
      {/* Cursor-following glow */}
      <motion.div
        aria-hidden
        style={{
          position: 'fixed',
          left: springX,
          top: springY,
          translateX: '-50%',
          translateY: '-50%',
          zIndex: 0,
        }}
        className="pointer-events-none w-[600px] h-[600px] rounded-full bg-white/10 blur-[120px]"
      />

      {/* Chrome orbs background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-48 -right-32 w-[32rem] h-[32rem] rounded-full bg-white/30 blur-[120px]" />
        <div className="absolute -bottom-48 -left-40 w-[32rem] h-[32rem] rounded-full bg-white/30 blur-[120px]" />
        <div className="absolute top-1/3 -right-24 w-[30rem] h-[30rem] rounded-full bg-white/30 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-16 sm:py-24">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
          className="mb-10"
        >
          <h1 className="text-5xl font-bold tracking-tight text-white mb-3 text-center flex justify-center flex-wrap">
            {titleLetters.map((char, i) => (
              <motion.span
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: i * 0.07, ease: [0.25, 0.1, 0, 1] }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </h1>
          <p className="text-white/40 text-sm text-center">
            Cover letters that actually get read.
          </p>
        </motion.header>

        {/* Main Form Card */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0, 1] }}
          className="backdrop-blur-2xl bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(255,255,255,0.04)] relative z-10"
        >
          {/* Job Description */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-white/60 mb-2">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job posting here..."
              className="w-full h-36 px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-white/25 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Your Background */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-white/60 mb-2">
              Your Background
            </label>
            <textarea
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              placeholder="Describe your experience, skills, and achievements..."
              className="w-full h-36 px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-white/25 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Tone Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/60 mb-2.5">
              Tone
            </label>
            <div className="inline-flex bg-white/5 border border-white/8 rounded-xl p-1">
              {tones.map((tone) => (
                <button
                  key={tone}
                  onClick={() => setSelectedTone(tone)}
                  className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-all ${
                    selectedTone === tone
                      ? 'bg-white/15 border border-white/20 text-white'
                      : 'text-white/50 hover:text-white/70 border border-transparent'
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
            className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${
              !jobDescription.trim() || !background.trim()
                ? 'bg-white/5 border border-white/8 text-white/30 cursor-not-allowed'
                : 'bg-white/10 border border-white/15 text-white hover:bg-white/20'
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
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0, 1] }}
              className="mt-6 backdrop-blur-2xl bg-white/[0.04] border border-white/10 rounded-2xl p-6 shadow-[0_0_60px_rgba(255,255,255,0.04)] relative z-10"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-white/60">Output</h2>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/70 transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.span
                        key="check"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1"
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
              <div className="bg-white/5 border border-white/8 rounded-xl p-4">
                <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                  {displayedText}
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
          className="mt-14 text-center"
        >
          <p className="text-white/30 text-xs">
            
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
