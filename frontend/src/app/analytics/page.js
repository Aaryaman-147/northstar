"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import AlignmentVisualizer from "./AlignmentVisualizer";

// --- Simulated Enterprise Data for Demo ---
const qoqData = [
  { name: 'Q1', Target: 85, Achievement: 80 },
  { name: 'Q2', Target: 90, Achievement: 92 },
  { name: 'Q3', Target: 95, Achievement: 88 },
  { name: 'Q4', Target: 100, Achievement: 105 },
];

const thrustAreaData = [
  { name: 'Financial', value: 40 },
  { name: 'Customer', value: 30 },
  { name: 'Internal Process', value: 20 },
  { name: 'Learning & Growth', value: 10 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const managerData = [
  { name: 'Sarah (Eng)', completionRate: 98, avgScore: 85 },
  { name: 'David (Sales)', completionRate: 75, avgScore: 92 },
  { name: 'Elena (Marketing)', completionRate: 100, avgScore: 78 },
  { name: 'Marcus (Product)', completionRate: 88, avgScore: 90 },
];

const statusData = [
  { name: 'Completed', value: 45, fill: '#10b981' }, // Green
  { name: 'On Track', value: 35, fill: '#3b82f6' }, // Blue
  { name: 'At Risk', value: 15, fill: '#f59e0b' }, // Amber
  { name: 'Not Started', value: 5, fill: '#ef4444' }, // Red
];

export default function AnalyticsDashboard() {
  return (
    <div className="min-h-screen bg-zinc-50 p-8 text-zinc-900">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organization Analytics</h1>
          <p className="text-zinc-500 mt-1">Real-time insights into goal alignment, achievement trends, and manager effectiveness.</p>
        </div>

        {/* Top High-Level Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-zinc-900 text-white border-0 shadow-md">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-zinc-400">Total Active Goals</p>
              <p className="text-4xl font-bold mt-2">1,248</p>
              <p className="text-xs text-emerald-400 mt-1">↑ 12% from last quarter</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-zinc-500">Company Avg Achievement</p>
              <p className="text-4xl font-bold mt-2 text-zinc-900">86.4%</p>
              <p className="text-xs text-zinc-400 mt-1">Target: 90.0%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-zinc-500">Check-in Compliance</p>
              <p className="text-4xl font-bold mt-2 text-blue-600">92%</p>
              <p className="text-xs text-zinc-400 mt-1">Q2 Window</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-zinc-500">Goals "At Risk"</p>
              <p className="text-4xl font-bold mt-2 text-amber-500">15%</p>
              <p className="text-xs text-zinc-400 mt-1">Requires L1 Intervention</p>
            </CardContent>
          </Card>
        </div>

        {/* --- NEW VISUALIZER GOES HERE --- */}
        <div className="w-full mt-8 mb-4">
          <h2 className="text-xl font-bold tracking-tight mb-4">The Northstar Constellation</h2>
          <AlignmentVisualizer />
        </div>

        {/* Chart Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* QoQ Trends */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Quarter-on-Quarter (QoQ) Trends</CardTitle>
              <CardDescription>Planned targets vs. actual achievement over time.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={qoqData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAchieve" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="Target" stroke="#a1a1aa" fill="transparent" strokeDasharray="5 5" />
                  <Area type="monotone" dataKey="Achievement" stroke="#8884d8" fillOpacity={1} fill="url(#colorAchieve)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Manager Effectiveness */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Manager Effectiveness Dashboard</CardTitle>
              <CardDescription>Check-in completion rates vs team performance by L1 Manager.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={managerData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip cursor={{fill: '#f4f4f5'}} />
                  <Legend />
                  <Bar dataKey="completionRate" name="Check-in Rate (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="avgScore" name="Team Avg Score" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Thrust Area Distribution */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Goal Distribution by Thrust Area</CardTitle>
              <CardDescription>Strategic alignment across the organization.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={thrustAreaData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {thrustAreaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Goal Status Heatmap/Bar */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Current Goal Status</CardTitle>
              <CardDescription>Company-wide progress status distribution.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e4e4e7" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip cursor={{fill: '#f4f4f5'}} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}