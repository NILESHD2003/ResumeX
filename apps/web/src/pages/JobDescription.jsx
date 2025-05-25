import { useState } from "react"
import { Toaster, toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import StaticBar from "../components/StaticBar"

export default function JobDescriptionPage() {

  const [jobUrl, setJobUrl] = useState("")
  const [urlError, setUrlError] = useState("")
  const [jobDescription, setJobDescription] = useState("")

//   Url logic
  const handleUrlSubmit = () => {
    const urlPattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i
    if (!urlPattern.test(jobUrl.trim())) {
      toast.error("Please enter a valid URL.")
      return
    }
    // proceed with submission
    console.log("Valid URL:", jobUrl)
  }

//   Description logic
  const handleDescriptionSubmit = () => {
  if (jobDescription.trim().length === 0) {
    toast.error("Please enter a job description.")
    return
  }

  toast.success("Job description received!")
  console.log("Job Description:", jobDescription)
  // Continue with logic
}
    
 return (
   <div className="min-h-screen bg-[#f1effd] overflow-hidden m-0 p-0 flex flex-col">
   <Toaster/>
    <StaticBar />

    {/* Parent container along with heading */}
    <div className="flex flex-col items-center py-4 px-4">
     <h1 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-[#CA79FF] to-[#1C7EFF] bg-clip-text text-transparent mb-2">
        Generate Custom Resume based on <br /> Job Description
     </h1>

      <p className="text-sm text-gray-600 mb-6 text-center">
        Optimize your resume for a specific job by analyzing the job description
      </p>

      <Tabs defaultValue="url" className="w-full max-w-md px-4 mt-2">
        <TabsList className="grid w-full grid-cols-2 mb-3">
          <TabsTrigger value="url">🔗 Job URL</TabsTrigger>
          <TabsTrigger value="description">📄 Job description</TabsTrigger>
        </TabsList>

        {/* Url Section */}
        <TabsContent value="url">
          <Card className='max-h-[70vh] overflow-auto'>
            <CardHeader>
              <CardTitle className="text-center font-bold text-2xl">
                Enter Job Description
              </CardTitle>

              <CardDescription className="text-center">
                Enter a job link or paste a job description to optimize your resume
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1 resize-none">
                <Label htmlFor="job-url">Job URL</Label>
                <Input 
                id="job-url"
                placeholder="https://example.com/job-posting"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                className={urlError ? "border-red-500 focus:ring-red-500" : ""}
               />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                className="bg-gradient-to-r from-[#b06afe] to-[#497bfe] text-white cursor-pointer"
                onClick={handleUrlSubmit}
              >
                Continue
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Description section */}
        <TabsContent value="description">
          <Card className='max-h-[65vh] overflow-hidden w-full'>
            <CardHeader>
              <CardTitle className="text-center font-bold text-2xl">
                Enter Job Description
              </CardTitle>
              <CardDescription className="text-center">
                Enter a job link or paste a job description to optimize your resume
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 flex-grow overflow-auto">
              <div className="space-y-1">
                <Label htmlFor="job-desc" className='mb-2'>Job Description</Label>
                <textarea
                  id="job-desc"
                  className="w-full h-30 max-h-60 p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#b06afe] resize-none"
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end mb-0">
              <Button 
              className="bg-gradient-to-r from-[#b06afe] to-[#497bfe] text-white cursor-pointer mb-0"
              onClick={handleDescriptionSubmit}
              >
                Continue
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </div>
  )
}
