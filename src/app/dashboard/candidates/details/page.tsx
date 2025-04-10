'use client';

import { useState } from 'react';
import { CandidateStatus } from '@/types/candidate';
import { Badge } from '@/components/atoms/Badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/Tabs';
import { useGetCandidateByIdQuery } from '@/redux/api/candidatesApi';
import { useSearchParams } from 'next/navigation';

export default function CandidatePage() {
  const searchParams = useSearchParams();
  const candidateId = searchParams.get('id') as string;
  const { data: candidateResponse, isLoading, error } = useGetCandidateByIdQuery(candidateId);
  const [status, setStatus] = useState<CandidateStatus | null>(null);

  const candidate = candidateResponse?.data;

  const handleStatusChange = (newStatus: CandidateStatus) => {
    if (candidate) {
      setStatus(newStatus);
      // In a real app, you would make an API call here
      console.log(`Updating status for candidate ${candidate.id} to ${newStatus}`);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading candidate data...</p>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>Failed to load candidate data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {candidate.firstName} {candidate.lastName}
        </h1>
        <Select value={status || candidate.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="REVIEWING">Reviewing</SelectItem>
            <SelectItem value="HIRED">Hired</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="INTERVIEWING">Interviewing</SelectItem>
            <SelectItem value="PROCESSING">Processing</SelectItem>
            <SelectItem value="IDLE">Idle</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Current Position</h3>
                <p>{candidate.currentPosition}</p>
              </div>
              <div>
                <h3 className="font-semibold">Contact Information</h3>
                <p>Email: {candidate.email}</p>
                <p>Phone: {candidate.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {candidate.resume.recommendations.jobRecommendations.map((job, index) => (
                <Badge key={index} variant="secondary" className="mr-2 mb-2">
                  {job}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="skills" className="mt-8">
        <TabsList>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        <TabsContent value="skills">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2">
                {candidate.resume.structuredData.skills.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience">
          <Card>
            <CardContent className="pt-6">
              {candidate.resume.structuredData.workExperience.map((exp, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-xl font-semibold">{exp.jobTitle}</h3>
                  <p className="text-gray-600">{exp.company} • {exp.duration}</p>
                  <ul className="list-disc ml-4 mt-2">
                    {exp.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card>
            <CardContent className="pt-6">
              {candidate.resume.structuredData.education.map((edu, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-xl font-semibold">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.institution}</p>
                  <p className="text-gray-500">{edu.graduationYear}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardContent className="pt-6">
              {candidate.resume.structuredData.projects.map((project, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-xl font-semibold">{project.project_title}</h3>
                  <p className="mt-2">{project.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2">
                {candidate.resume.structuredData.certifications.map((cert, index) => (
                  <Badge key={index} variant="secondary">
                    {cert}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 