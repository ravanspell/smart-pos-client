'use client';

import { useState, useEffect } from 'react';
import { Candidate, CandidateStatus } from '@/types/candidate';
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
import { useSearchParams } from 'next/navigation';

// Mock database of candidates
const mockCandidates: Candidate = {
  id: "900c3aa0-540d-40c4-a1d8-4fb040518a80",
  firstName: "Michel",
  lastName: "Knight",
  email: "michel@gmail.com",
  phone: "077 811 67 72",
  currentPosition: "Trainee Network Engineer",
  resume: {
    structuredData: {
      skills: [
        "Cloud - AWS (EC2 / S3)",
        "Oracle",
        "DevOps - Github | Docker | Jenkins | Kubernetes | Nexus | Sonarqube",
        "Networking - GNS3 | Cisco Packet Tracer | Routing & Switching",
        "Languages - Python | C",
        "OS - Linux",
        "Database - MySQL | Firebase",
        "Soft Skills - Leadership | Team Player"
      ],
      projects: [
        {
          description: "Developed a mobile application for reserving parking slots. Scanned the QR code to automatically open the gate. Offered guidance to the vehicle. Checked if the vehicle was parked correctly, providing feedback if not. Upon the person exiting the parking lot through one door, the information was uploaded to the database. Ensured the security of the vehicle.",
          project_title: "Vehicle Parking Management System"
        },
        {
          description: "Connected 15 computers with one switch and router. Implemented role-based access control. Performed web content / application filtering.",
          project_title: "School lab network"
        }
      ],
      education: [
        {
          degree: "Bachelor of Computing and Technology Honors in Computer Networking",
          institution: "University of Boston",
          graduationYear: "2019 - 2024"
        },
        {
          degree: "GCE Advanced Level (Technology Stream)",
          institution: "imperial college of engineering",
          graduationYear: "2017"
        },
        {
          degree: "Computer Programming",
          institution: "Divisional Computer Resource Center  Boston",
          graduationYear: "2015"
        }
      ],
      certifications: [
        "CCNA",
        "Introduction to DevOps course",
        "Introduction to DevOps Tools",
        "AWS Cloud Practitioner - Reading"
      ],
      workExperience: [
        {
          company: "Google Inc",
          duration: "06/12/2022 - 06/10/2023",
          jobTitle: "Trainee Network Engineer",
          responsibilities: [
            "Gained practical experience as a trainee network engineer, focusing on IP routing and switching fundamentals (Layer 3)",
            "Learned to configure routing protocols like OSPF, EIGRP",
            "Made an AWS EC2 Instance",
            "Monitored network performance using MobaXterm",
            "Uploaded operating systems onto switches for maintenance and security"
          ]
        }
      ]
    },
    recommendations: {
      jobRecommendations: [
        "Network Engineer",
        "DevOps Engineer",
        "Cloud Infrastructure Engineer"
      ],
      resumeOptimization: "Highlight key achievements and quantifiable impact in the work experience section. Expand on technical skills and certifications to showcase depth of expertise."
    }
  },
  status: "REVIEWING",
  createdAt: "2025-04-10T14:07:26.329Z",
  updatedAt: "2025-04-10T14:07:34.230Z"
}

export default function CandidatePage() {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [status, setStatus] = useState<CandidateStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  useEffect(() => {
    // Simulate API call to fetch candidate data
    const fetchCandidate = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Check if candidate exists in our mock database

        setCandidate(mockCandidates);
        setStatus(mockCandidates.status);

      } catch (err) {
        setError("Failed to load candidate data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  const handleStatusChange = (newStatus: CandidateStatus) => {
    if (candidate) {
      setStatus(newStatus);
      // In a real app, you would make an API call here
      console.log(`Updating status for candidate ${candidate.id} to ${newStatus}`);
    }
  };

  if (loading) {
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
          <p>{error || "Candidate not found"}</p>
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
        <Select value={status || ""} onValueChange={handleStatusChange}>
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