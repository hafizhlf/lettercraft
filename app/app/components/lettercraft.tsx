"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Loader2, Upload, Globe, CheckCircle, AlertCircle, Copy, Info, Sparkles } from 'lucide-react'
import { cn } from "@/lib/utils"

const languages = [
  { name: "Indonesia" },
  { name: "English" },
  { name: "Spanish" },
  { name: "French" },
  { name: "German" },
  { name: "Italian" },
  { name: "Portuguese" },
  { name: "Dutch" },
  { name: "Russian" },
  { name: "Chinese (Simplified)" },
  { name: "Japanese" },
]

const tones = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "confident", label: "Confident" },
  { value: "enthusiastic", label: "Enthusiastic" },
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
]

export default function Lettercraft() {
  const [resume, setResume] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState<File | null>(null)
  const [coverLetter, setCoverLetter] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [tone, setTone] = useState("professional")
  const [selectedLanguage, setSelectedLanguage] = useState("Indonesia")

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: "resume" | "jobDescription") => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type === "application/pdf" || file.type.startsWith("image/")) {
        if (type === "resume") {
          setResume(file)
        } else {
          setJobDescription(file)
        }
        setError(null)
      } else {
        setError("Please upload a PDF or image file.")
      }
    }
  }

  const generateCoverLetter = async () => {
    if (!resume || !jobDescription) {
      setError("Please upload both a resume and job description.")
      return
    }

    setIsLoading(true)
    setError(null)
    setProgress(0)

    const formData = new FormData()
    formData.append('resume', resume)
    formData.append('jobDescription', jobDescription)
    formData.append('language', selectedLanguage)
    formData.append('tone', tone)

    try {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', '/api/craft', true)

      // Track progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100)
          setProgress(percent)
        }
      }

      xhr.onload = async () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText)
          setCoverLetter(data.coverletter)
        } else {
          setError("An error occurred while generating the cover letter. Please try again.")
        }
      }

      xhr.onerror = () => {
        setError("An error occurred while generating the cover letter. Please try again.")
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          setIsLoading(false)
          setProgress(0)
        }
      }

      xhr.send(formData)
    } catch {
      setError("An error occurred while generating the cover letter. Please try again.")
      setIsLoading(false)
      setProgress(0)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-4rem)] md:max-w-4xl shadow-2xl overflow-hidden">
        <CardHeader className="space-y-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6 md:p-8">
          <CardTitle className="text-center text-2xl sm:text-3xl md:text-4xl font-bold flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
            Lettercraft
          </CardTitle>
          <CardDescription className="text-lg sm:text-xl text-blue-100 text-center">
            Craft the perfect cover letter with AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 md:space-y-8 p-4 sm:p-6 md:p-8">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-2">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-8">
                <FileUpload
                  id="resume"
                  label="Upload Resume"
                  file={resume}
                  onChange={(e) => handleFileChange(e, "resume")}
                />
                <FileUpload
                  id="jobDescription"
                  label="Upload Job Description"
                  file={jobDescription}
                  onChange={(e) => handleFileChange(e, "jobDescription")}
                />
              </div>
            </TabsContent>
            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language" className="text-lg font-semibold">
                  Select Language
                </Label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger id="language" className="w-full">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.name} value={lang.name}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tone" className="text-lg font-semibold">
                  Select Tone
                </Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger id="tone" className="w-full">
                    <SelectValue placeholder="Select a tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center p-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
                role="alert"
              >
                <AlertCircle className="flex-shrink-0 inline w-4 h-4 mr-3" />
                <span className="sr-only">Error</span>
                <div>{error}</div>
              </motion.div>
            )}
          </AnimatePresence>
          <Button 
            onClick={generateCoverLetter} 
            disabled={isLoading || !resume || !jobDescription} 
            className="w-full text-base sm:text-lg py-4 sm:py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Crafting your letter...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-5 w-5" />
                Generate Cover Letter
              </>
            )}
          </Button>
          {isLoading && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-center text-sm text-gray-500">Analyzing and crafting your personalized cover letter...</p>
            </div>
          )}
          <AnimatePresence>
            {coverLetter && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                  <Label htmlFor="coverLetter" className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
                    <Globe className="h-5 w-5 sm:h-6 sm:w-6" />
                    Your Crafted Cover Letter
                    <span className="text-sm font-normal text-gray-500">
                      ({languages.find(lang => lang.name === selectedLanguage)?.name}, {tone} tone)
                    </span>
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyToClipboard}
                          className="flex items-center gap-2"
                        >
                          <Copy className="h-4 w-4" />
                          {copied ? "Copied!" : "Copy"}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy to clipboard</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Textarea
                  id="coverLetter"
                  value={coverLetter}
                  readOnly
                  className="min-h-[300px] text-sm leading-relaxed p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-inner"
                  placeholder="Your generated cover letter will appear here..."
                />
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" className="text-sm">
                    Download as PDF
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter className="text-sm text-center text-gray-500 bg-gray-50 dark:bg-gray-800 py-6 px-8 flex items-center justify-center space-x-2">
          <Info className="h-4 w-4" />
          <p>Lettercraft uses AI to generate personalized cover letters based on your resume and the job description.</p>
        </CardFooter>
      </Card>
    </div>
  )
}

interface FileUploadProps {
  id: string
  label: string
  file: File | null
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function FileUpload({ id, label, file, onChange }: FileUploadProps) {
  return (
    <div className="space-y-4">
      <Label htmlFor={id} className="text-lg font-semibold">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type="file"
          accept=".pdf,image/*"
          onChange={onChange}
          className="hidden"
        />
        <Button asChild variant="outline" className={cn(
          "w-full h-40 flex flex-col items-center justify-center text-sm transition-all duration-300 ease-in-out rounded-lg border-2 border-dashed",
          file ? "border-green-500 dark:border-green-700 bg-green-50 dark:bg-green-900" : "hover:bg-gray-50 dark:hover:bg-gray-800"
        )}>
          <label htmlFor={id} className="cursor-pointer space-y-2 flex flex-col items-center">
            {file ? (
              <>
                <CheckCircle className="h-12 w-12 text-green-500 dark:text-green-400" />
                <span className="font-medium text-green-700 dark:text-green-300 text-center max-w-[80%] truncate">{file.name}</span>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400" />
                <span className="font-medium">Choose PDF or Image</span>
                <span className="text-xs text-gray-500">Drag and drop or click to upload</span>
              </>
            )}
          </label>
        </Button>
      </div>
    </div>
  )
}

