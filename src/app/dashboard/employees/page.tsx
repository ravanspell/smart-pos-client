"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/atoms/Accordion';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { Checkbox } from '@/components/atoms/CheckBox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/atoms/DropdownMenu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/atoms/Table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/Tabs';
import { MoreVertical } from 'lucide-react';

interface IAppProps {
  test: string;
}

const EmployeesPage: React.FC<IAppProps> = (props) => {
  return (
    <>
      <div className="container mx-auto">
        <div className='flex justify-end'>
          <Button variant="default" className="bg-red-500 text-white">
            + Stage
          </Button>
        </div>
        <div className="flex justify-between items-center mb-4">
          <Tabs defaultValue="tab1" className="w-full">
            <TabsList>
              <TabsTrigger value="tab1">
                <div className="flex items-center">
                  FutureForce Recruitment
                  <Badge className="ml-2" variant="secondary">2</Badge> {/* Badge */}
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="ml-4 cursor-pointer" /> {/* Gap of 15px (ml-4) */}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Close</DropdownMenuItem>
                      <DropdownMenuItem>Resume Shortlisting</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TabsTrigger>

              <TabsTrigger value="tab2">
                <div className="flex items-center">
                  HR Manager
                  <Badge className="ml-2" variant="secondary">3</Badge> {/* Badge */}
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="ml-4 cursor-pointer" /> {/* Gap of 15px */}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Close</DropdownMenuItem>
                      <DropdownMenuItem>Resume Shortlisting</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TabsTrigger>

              <TabsTrigger value="tab3">
                <div className="flex items-center">
                  .Net Drive
                  <Badge className="ml-2" variant="secondary">5</Badge> {/* Badge */}
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="ml-4 cursor-pointer" /> {/* Gap of 15px */}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Close</DropdownMenuItem>
                      <DropdownMenuItem>Resume Shortlisting</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TabsTrigger>
            </TabsList>
            {/* Tabs content */}
            <TabsContent value="tab1" className="w-full">
              <Card className="p-2">
                <Accordion type="single" defaultValue="item-1" collapsible>
                  <AccordionItem value="item-1">
                    <div className="flex justify-between items-center">
                      <AccordionTrigger>
                        <span>Initial</span> {/* Accordion Bar Title */}
                      </AccordionTrigger>

                      {/* + Add Candidate button in accordion header */}
                      <Button variant="default" className="bg-red-500 text-white">
                        +
                      </Button>
                    </div>
                    <AccordionContent>
                      {/* ShadCN Table with checkboxes */}
                      <Table className="w-full">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-1/12">
                              <Checkbox />
                            </TableHead>
                            <TableHead>Candidate</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Job Position</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Scheduled Interviews</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Stage</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="w-1/12">
                              <Checkbox />
                            </TableCell>
                            <TableCell>Elijah Collins</TableCell>
                            <TableCell>isabella....</TableCell>
                            <TableCell>Sales Analyst</TableCell>
                            <TableCell>9876540106</TableCell>
                            <TableCell>Interviews Scheduled: 0</TableCell>
                            <TableCell>⭐⭐⭐⭐⭐</TableCell>
                            <TableCell>Initial</TableCell>
                          </TableRow>
                          {/* Additional rows can be added */}
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>
                  {/* Additional AccordionItems can be added here */}
                </Accordion>
              </Card>
            </TabsContent>
            {/* You can repeat TabsContent for other tabs */}
          </Tabs>
        </div>
      </div>
    </>
  )
};

export default EmployeesPage;