"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ManagerDashboard() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ target: "", weightage: "" });
  const [isPushModalOpen, setIsPushModalOpen] = useState(false);
  const [sharedGoalData, setSharedGoalData] = useState({ title: "", thrust_area: "Financial", uom_type: "Min", target: "" });

  // 1. Declare fetchGoals FIRST
  const fetchGoals = async () => {
    try {
      const res = await fetch("https://northstar-vgqa.onrender.com/api/manager/team-goals");
      const data = await res.json();
      setGoals(data);
    } catch (error) {
      console.error("Failed to fetch goals", error);
      toast.error("Failed to fetch team goals.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Call it inside useEffect SECOND
  useEffect(() => {
    fetchGoals();
  }, []);
  

  const updateGoal = async (id, payload) => {
    try {
      const res = await fetch(`https://northstar-vgqa.onrender.com/api/goals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setEditingId(null);
        fetchGoals();
        toast.success("Goal updated successfully!");
      } else {
        toast.error("Failed to update goal.");
      }
    } catch (error) {
      console.error("Failed to update goal", error);
      toast.error("An error occurred while updating.");
    }
  };

  const handleAddFeedback = async (goalId) => {
    const comment = prompt("Enter your quarterly check-in feedback for this employee:");
    if (!comment) return;

    try {
      const res = await fetch(`https://northstar-vgqa.onrender.com/api/goals/${goalId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment })
      });
      
      if (res.ok) {
        toast.success("Feedback saved to the employee's check-in record!");
      } else {
        toast.error("Wait for the employee to submit their first check-in before adding feedback.");
      }
    } catch (error) {
      console.error("Failed to save feedback", error);
      toast.error("Failed to save feedback.");
    }
  };
  
  const handlePushSharedGoal = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://northstar-vgqa.onrender.com/api/manager/push-shared-goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: sharedGoalData.title,
          thrust_area: sharedGoalData.thrust_area, // <-- ADD THIS LINE
          uom_type: sharedGoalData.uom_type,
          target: Number(sharedGoalData.target)
        }),
      });
      if (res.ok) {
        setIsPushModalOpen(false);
        setSharedGoalData({ title: "", thrust_area: "Financial", uom_type: "Min", target: "" });
        fetchGoals();
        toast.success("Department goal successfully pushed to all employees!");
      } else {
        toast.error("Failed to push department goal.");
      }
    } catch (error) {
      console.error("Failed to push shared goal", error);
      toast.error("An error occurred.");
    }
  };

  const handleApprove = (id) => {
    updateGoal(id, { status: "Approved", locked: true });
  };

  const handleReturn = (id) => {
    updateGoal(id, { status: "Returned for Rework", locked: false });
  };

  const startEditing = (goal) => {
    setEditingId(goal.id);
    setEditValues({ target: goal.target, weightage: goal.weightage });
  };

  const saveEdits = (id) => {
    updateGoal(id, { target: Number(editValues.target), weightage: Number(editValues.weightage) });
  };

  if (loading) return <div className="p-8 text-zinc-500 animate-pulse">Loading team goals...</div>;

  return (
    <div className="min-h-screen bg-zinc-50 p-8 text-zinc-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
            <p className="text-zinc-500 mt-1">Review, adjust, and approve your team's quarterly goals.</p>
          </div>
          
          <Dialog open={isPushModalOpen} onOpenChange={setIsPushModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                + Push Department KPI
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Push Shared KPI</DialogTitle>
              </DialogHeader>
              <form onSubmit={handlePushSharedGoal} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Goal Title</Label>
                  <Input 
                    placeholder="e.g., Target Q3 Revenue" 
                    required 
                    value={sharedGoalData.title}
                    onChange={(e) => setSharedGoalData({...sharedGoalData, title: e.target.value})}
                  />
                </div>
                {/* NEW THRUST AREA DROPDOWN */}
                <div className="space-y-2">
                  <Label>Thrust Area</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    value={sharedGoalData.thrust_area}
                    onChange={(e) => setSharedGoalData({...sharedGoalData, thrust_area: e.target.value})}
                  >
                    <option value="Financial">Financial</option>
                    <option value="Customer">Customer</option>
                    <option value="Internal Process">Internal Process</option>
                    <option value="Learning & Growth">Learning & Growth</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>UoM Type</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    value={sharedGoalData.uom_type}
                    onChange={(e) => setSharedGoalData({...sharedGoalData, uom_type: e.target.value})}
                  >
                    <option value="Min">Min (Higher is Better)</option>
                    <option value="Max">Max (Lower is Better)</option>
                    <option value="Zero-based">Zero-based</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Company Target</Label>
                  <Input 
  type="number" 
  min="0" 
  required 
  value={sharedGoalData.target}
  onChange={(e) => setSharedGoalData({...sharedGoalData, target: e.target.value})}
/>
                </div>
                <Button type="submit" className="w-full bg-zinc-900 text-white">Push to All Employees</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {goals.length === 0 ? (
          <div className="text-center py-16 px-4 border-2 border-dashed border-zinc-200 rounded-lg bg-zinc-50 mt-6">
            <div className="text-4xl mb-3">📭</div>
            <h3 className="text-lg font-semibold text-zinc-900">Inbox Zero!</h3>
            <p className="text-sm text-zinc-500 mt-1">There are no employee goals pending your approval right now.</p>
          </div>
        ) : (
          <div className="bg-white rounded-md border shadow-sm overflow-hidden mt-6">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-100/50">
                  <TableHead>Employee</TableHead>
                  <TableHead>Goal Title</TableHead>
                  <TableHead>UoM</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {goals.map((goal) => (
                  <TableRow key={goal.id}>
                    <TableCell className="font-medium">{goal.employee_name}</TableCell>
                    <TableCell>{goal.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{goal.uom_type}</Badge>
                    </TableCell>
                    
                    <TableCell>
                      {editingId === goal.id ? (
                        <Input 
  type="number" 
  min="0" 
  value={editValues.target} 
  onChange={(e) => setEditValues({...editValues, target: e.target.value})}
  className="w-24 h-8"
/>
                      ) : (
                        goal.target
                      )}
                    </TableCell>

                    <TableCell>
                      {editingId === goal.id ? (
                        <Input 
  type="number" 
  min="10" 
  max="100" 
  value={editValues.weightage} 
  onChange={(e) => setEditValues({...editValues, weightage: e.target.value})}
  className="w-20 h-8"
/>
                      ) : (
                        `${goal.weightage}%`
                      )}
                    </TableCell>

                    <TableCell>
                      <Badge className={
                        goal.status === "Approved" ? "bg-green-100 text-green-700 hover:bg-green-100" :
                        goal.status === "Returned for Rework" ? "bg-red-100 text-red-700 hover:bg-red-100" :
                        "bg-amber-100 text-amber-700 hover:bg-amber-100"
                      } variant="secondary">
                        {goal.locked ? "🔒 Approved" : goal.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      {goal.locked ? (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => handleAddFeedback(goal.id)}>
                            💬 Add Feedback
                          </Button>
                          <span className="text-xs text-zinc-400 self-center ml-2">Locked</span>
                        </div>
                      ) : editingId === goal.id ? (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" onClick={() => saveEdits(goal.id)}>Save</Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => startEditing(goal)}>Edit</Button>
                          <Button size="sm" className="bg-zinc-900 text-white" onClick={() => handleApprove(goal.id)}>Approve</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleReturn(goal.id)}>Return</Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}