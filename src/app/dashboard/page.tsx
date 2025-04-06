'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/atoms/Card';
import { Tabs, TabsList, TabsTrigger } from '@/components/atoms/Tabs';
import { ArrowUpRight, Users, Briefcase, Clock, Filter } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/atoms/Select';
import { DataTable } from '@/components/molecules/DataTable/DataTable';
import { ColumnDef, SortingState, PaginationState, RowSelectionState } from '@tanstack/react-table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig
} from '@/components/ui/chart';
import { 
  Bar, 
  BarChart, Pie, PieChart, Line, LineChart, Cell, XAxis, YAxis, CartesianGrid } from 'recharts';

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig

const jobTypeData = [
  { name: 'Engineering', value: 45 },
  { name: 'Marketing', value: 30 },
  { name: 'Sales', value: 25 },
  { name: 'Design', value: 20 },
  { name: 'Operations', value: 15 },
];

const genderData = [
  { name: 'Male', value: 58 },
  { name: 'Female', value: 42 },
];

const applicationTrendData = [
  { name: 'Jan', applications: 65 },
  { name: 'Feb', applications: 75 },
  { name: 'Mar', applications: 90 },
  { name: 'Apr', applications: 120 },
  { name: 'May', applications: 150 },
  { name: 'Jun', applications: 180 },
];

const hiringStageData = [
  { name: 'Applied', value: 450 },
  { name: 'Screening', value: 280 },
  { name: 'Interview', value: 180 },
  { name: 'Assessment', value: 110 },
  { name: 'Offer', value: 65 },
  { name: 'Hired', value: 40 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Chart configurations
const jobTypeConfig = {
  value: {
    label: 'Jobs',
    theme: {
      light: '#8884d8',
      dark: '#8884d8',
    },
  },
};

const genderConfig = {
  Male: {
    label: 'Male',
    theme: {
      light: '#0088FE',
      dark: '#0088FE',
    },
  },
  Female: {
    label: 'Female',
    theme: {
      light: '#00C49F',
      dark: '#00C49F',
    },
  },
};

const applicationTrendConfig = {
  applications: {
    label: 'Applications',
    theme: {
      light: '#82ca9d',
      dark: '#82ca9d',
    },
  },
};

const hiringStageConfig = {
  value: {
    label: 'Candidates',
    theme: {
      light: '#0088FE',
      dark: '#0088FE',
    },
  },
};

// Custom tooltip component to match shadcn/ui styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {label}
            </span>
            <span className="font-bold text-muted-foreground">
              {payload[0].payload.name}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {payload[0].name}
            </span>
            <span className="font-bold">
              {payload[0].value}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState('monthly');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Define the columns for the DataTable
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'candidate',
      header: 'Candidate',
    },
    {
      accessorKey: 'position',
      header: 'Position',
    },
    {
      accessorKey: 'department',
      header: 'Department',
    },
    {
      accessorKey: 'applied',
      header: 'Applied',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        let bgColor = 'bg-gray-100';
        let textColor = 'text-gray-800';

        if (status === 'Screening') {
          bgColor = 'bg-yellow-100';
          textColor = 'text-yellow-800';
        } else if (status === 'Interview') {
          bgColor = 'bg-green-100';
          textColor = 'text-green-800';
        } else if (status === 'Assessment') {
          bgColor = 'bg-blue-100';
          textColor = 'text-blue-800';
        } else if (status === 'Offer') {
          bgColor = 'bg-purple-100';
          textColor = 'text-purple-800';
        }

        return (
          <span className={`px-2 py-1 ${bgColor} ${textColor} rounded-full text-xs`}>
            {status}
          </span>
        );
      },
    },
  ];

  // Sample data for the table
  const candidateData = [
    {
      candidate: 'Alex Johnson',
      position: 'Senior Developer',
      department: 'Engineering',
      applied: 'Apr 2, 2025',
      status: 'Screening',
    },
    {
      candidate: 'Maria Garcia',
      position: 'Marketing Manager',
      department: 'Marketing',
      applied: 'Apr 1, 2025',
      status: 'Interview',
    },
    {
      candidate: 'David Chen',
      position: 'UX Designer',
      department: 'Design',
      applied: 'Mar 29, 2025',
      status: 'Assessment',
    },
    {
      candidate: 'Emily Wilson',
      position: 'Sales Representative',
      department: 'Sales',
      applied: 'Mar 27, 2025',
      status: 'Offer',
    },
  ];

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-end items-center mb-6">
        <div className="flex gap-4">
          <Select defaultValue="monthly">
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={16} />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-blue-100 rounded-md">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-sm text-gray-500 mt-4">Total Jobs</p>
            <h3 className="text-2xl font-bold mt-1">135</h3>
            <p className="text-xs text-green-600 mt-1">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-purple-100 rounded-md">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-sm text-gray-500 mt-4">Total Applicants</p>
            <h3 className="text-2xl font-bold mt-1">1,125</h3>
            <p className="text-xs text-green-600 mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-pink-100 rounded-md">
                <Clock className="h-6 w-6 text-pink-600" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-sm text-gray-500 mt-4">Time to Hire</p>
            <h3 className="text-2xl font-bold mt-1">24 days</h3>
            <p className="text-xs text-green-600 mt-1">-3 days from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-orange-100 rounded-md">
                <Briefcase className="h-6 w-6 text-orange-600" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-sm text-gray-500 mt-4">Open Positions</p>
            <h3 className="text-2xl font-bold mt-1">42</h3>
            <p className="text-xs text-red-600 mt-1">-5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Job Distribution by Type</CardTitle>
            <CardDescription>
              Number of open positions by department
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <BarChart data={jobTypeData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs text-muted-foreground" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <YAxis className="text-xs text-muted-foreground" />
                  <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} name="Jobs" />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Candidate Gender Distribution</CardTitle>
            <CardDescription>
              Percentage breakdown by gender
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Candidate Application Trend</CardTitle>
            <CardDescription>
              Application submissions over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <LineChart accessibilityLayer data={applicationTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs text-muted-foreground" />
                  <YAxis className="text-xs text-muted-foreground" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="#82ca9d"
                    activeDot={{ r: 8 }}
                    name="Applications"
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Hiring Funnel</CardTitle>
            <CardDescription>
              Candidates at each hiring stage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <BarChart data={hiringStageData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs text-muted-foreground" />
                  <YAxis type="category" dataKey="name" className="text-xs text-muted-foreground" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="#0088FE" radius={[0, 4, 4, 0]} name="Candidates" />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <Tabs defaultValue="recent">
              <div className="flex justify-between items-center">
                <CardTitle>Candidate Applications</CardTitle>
                <TabsList>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={candidateData}
              totalCount={candidateData.length}
              sorting={sorting}
              pagination={pagination}
              onSortingChange={setSorting}
              onPaginationChange={setPagination}
              onRowSelectionChange={setRowSelection}
              rowSelection={rowSelection}
              loading={false}
              enableRowSelection={true}
            />
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4">
            <Button variant="outline">View All Applications</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;