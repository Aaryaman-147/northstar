"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function EmployeeDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  // --- Active Cycle Logic (Hackathon Demo) ---
  const getActiveCycle = () => {
    // In a real app, this comes from the database based on the current date.
    return { 
      isOpen: true, 
      name: "Q2 Mid-Quarter Check-in", 
      daysLeft: 12 
    };
  };
  const currentCycle = getActiveCycle();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch("https://northstar-vgqa.onrender.com/api/goals");
        const result = await response.json();
        if (response.ok) {
          setData(result);
        } else {
          console.error("Failed to fetch:", result.detail);
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

    const [selectedGoal, setSelectedGoal] = useState(null);
  const [checkInData, setCheckInData] = useState({ quarter: "Q1", actual_value: "", progress_status: "On Track" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate Overall Weighted Progress
  const overallProgress = data?.goals ? data.goals.reduce((acc, goal) => {
    return acc + (goal.current_score * (goal.weightage / 100));
  }, 0) : 0;

  const handleCheckIn = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://northstar-vgqa.onrender.com/api/goals/${selectedGoal.id}/check-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quarter: checkInData.quarter,
          actual_value: Number(checkInData.actual_value),
          progress_status: checkInData.progress_status
        }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setCheckInData({ quarter: "Q1", actual_value: "", progress_status: "On Track" });
        alert("Check-in successful! (Refresh to see updated overall score)");
      }
    } catch (error) {
      console.error("Check-in failed", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 p-8 space-y-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.goals.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-8">
        <Card className="max-w-md text-center p-6">
          <CardTitle className="mb-2">No Goals Found</CardTitle>
          <p className="text-zinc-500 mb-4">You haven't submitted any goals for this cycle yet.</p>
          <a href="/" className="text-blue-600 hover:underline">Go to Goal Creation</a>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-8 text-zinc-900">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Active HR Cycle Banner */}
        {currentCycle.isOpen && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-lg">
                ⏳
              </div>
              <div>
                <h3 className="text-sm font-bold text-blue-900">{currentCycle.name} Window is Open</h3>
                <p className="text-xs text-blue-700 mt-0.5">Please update your goal progress and lock in your numbers before the deadline.</p>
              </div>
            </div>
            <div className="text-right bg-white px-4 py-2 rounded-md border border-blue-100">
              <div className="text-lg font-bold text-blue-700 leading-none">{currentCycle.daysLeft}</div>
              <div className="text-[10px] text-blue-500 font-bold uppercase mt-1 tracking-wider">Days Left</div>
            </div>
          </div>
        )}
        {/* Dashboard Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {data.employee_name}</h1>
            <p className="text-zinc-500 mt-1">Here is your performance overview for the current cycle.</p>
          </div>
          <Badge variant="outline" className="text-sm bg-white">
            Role: {data.role}
          </Badge>
        </div>

        {/* High-Level Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-zinc-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-zinc-500 mb-1">Total Goals</h3>
              <p className="text-3xl font-bold">{data.goals.length}</p>
            </CardContent>
          </Card>
          <Card className="border-zinc-200 shadow-sm bg-zinc-900 text-white">
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-zinc-400 mb-1">Overall Progress</h3>
              <div className="flex items-end gap-3 mt-1">
                <p className="text-3xl font-bold">{Math.round(overallProgress)}%</p>
                <p className="text-sm text-zinc-400 mb-1">Weighted Average</p>
              </div>
              <Progress value={overallProgress} className="h-2 mt-3 bg-zinc-700 [&>div]:bg-white" />
            </CardContent>
          </Card>
          <Card className="border-zinc-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-zinc-500 mb-1">Status</h3>
              <Badge className="mt-2 bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">
                Pending Manager Approval
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Goal Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Objectives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.goals.map((goal, index) => (
              <Card key={goal.id} className="border-zinc-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="mb-2">Goal {index + 1}</Badge>
                    <Badge variant="outline" className={goal.locked ? "text-red-600 bg-red-50" : "text-amber-600 bg-amber-50"}>
                      {goal.locked ? "Locked" : goal.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">{goal.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {/* Action Bar for Approved Goals */}
                  {goal.locked && (
                    <div className="mt-6 pt-4 border-t border-zinc-100 flex justify-between items-center">
                      <span className="text-sm text-zinc-500">Ready for Q1 Update</span>
                      
                      <Dialog open={isModalOpen && selectedGoal?.id === goal.id} onOpenChange={(open) => {
                        setIsModalOpen(open);
                        if(open) setSelectedGoal(goal);
                      }}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">Update Progress</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Quarterly Check-in: {goal.title}</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleCheckIn} className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <Label>Quarter</Label>
                              <select 
                                className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
                                value={checkInData.quarter}
                                onChange={(e) => setCheckInData({...checkInData, quarter: e.target.value})}
                              >
                                <option>Q1</option>
                                <option>Q2</option>
                                <option>Q3</option>
                                <option>Q4</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <Label>Actual Achievement (Target: {goal.target})</Label>
                              <Input 
                                type="number" 
                                required 
                                value={checkInData.actual_value}
                                onChange={(e) => setCheckInData({...checkInData, actual_value: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Status</Label>
                              <select 
                                className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
                                value={checkInData.progress_status}
                                onChange={(e) => setCheckInData({...checkInData, progress_status: e.target.value})}
                              >
                                <option>Not Started</option>
                                <option>On Track</option>
                                <option>At Risk</option>
                                <option>Completed</option>
                              </select>
                            </div>
                            <Button type="submit" className="w-full bg-zinc-900">Submit Check-in</Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                    <div className="bg-zinc-100 p-3 rounded-md">
                      <p className="text-xs text-zinc-500 font-medium uppercase">Target ({goal.uom_type})</p>
                      <p className="text-lg font-semibold mt-1">{goal.target}</p>
                    </div>
                    <div className="bg-zinc-100 p-3 rounded-md">
                      <p className="text-xs text-zinc-500 font-medium uppercase">Weightage</p>
                      <p className="text-lg font-semibold mt-1">{goal.weightage}%</p>
                    </div>
                  </div>
                  {/* New Individual Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-zinc-700">Achievement</span>
                      <span className="font-bold">{Math.round(goal.current_score)}%</span>
                    </div>
                    <Progress value={goal.current_score} className="h-1.5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}