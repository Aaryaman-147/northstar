"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';

export default function GoalCreationDashboard() {
  const [goals, setGoals] = useState([
    { id: 1, title: "", thrustArea: "Financial", uom: "Min", target: "", weightage: 100 },
  ]);

  const totalWeightage = goals.reduce((sum, goal) => sum + Number(goal.weightage || 0), 0);
  const isValidWeightage = totalWeightage === 100;
  const hasMinWeightageError = goals.some((g) => Number(g.weightage) > 0 && Number(g.weightage) < 10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);

  const generateAIGoals = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("https://northstar-vgqa.onrender.com//api/ai/suggest-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "Software Engineer" }), // Hardcoded role for demo
      });
      const data = await res.json();
      
      if (res.ok) {
        // Map the AI suggestions into our frontend format
        const newGoals = data.suggestions.map((suggestion) => ({
          id: Date.now() + Math.random(),
          title: suggestion.title,
          thrustArea: "Learning & Growth", // <--- ADD THIS LINE
          uom: suggestion.uom_type,
          target: suggestion.target,
          weightage: 50 // Default split weightage
        }));
        
        setGoals(newGoals);
      }
    } catch (error) {
      console.error("Full Error Details:", error);
      alert(`Validation Error! Check your browser's Developer Console (F12) to see exactly which field failed.`);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const addGoal = () => {
    if (goals.length < 8) {
      setGoals([...goals, { id: Date.now(), title: "", thrustArea: "Financial", uom: "Min", target: "", weightage: 0 }]);
    }
  };

  const removeGoal = (id) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  const updateGoal = (id, field, value) => {
    setGoals(goals.map((g) => (g.id === id ? { ...g, [field]: value } : g)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidWeightage || hasMinWeightageError) return;
    
    setIsSubmitting(true);

    try {
      const response = await fetch("https://northstar-vgqa.onrender.com/api/goals/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          goals: goals.map(g => ({
            title: g.title,
            thrust_area: g.thrustArea || "Financial", // <-- Add a fallback just in case!
            uom_type: g.uom,
            target: Number(g.target),
            weightage: Number(g.weightage)
          }))
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to submit goals");
      }

      toast.success("Goals saved successfully to Supabase!");

      // Reset form after successful submission
      setGoals([{ id: Date.now(), title: "", thrustArea: "Financial", uom: "Min", target: "", weightage: 100 }]);
      
    } catch (error) {
      toast.error(error.message || "Failed to submit goals.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-8 text-zinc-900">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Goal Sheet</h1>
            <p className="text-zinc-500 mt-1">Define your objectives for the upcoming quarter. Ensure your total weightage equals exactly 100%.</p>
          </div>
          <Button 
            onClick={generateAIGoals} 
            disabled={isGenerating}
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white border-0 shadow-md transition-all"
          >
            {isGenerating ? "✨ AI is thinking..." : "✨ Auto-Generate with AI"}
          </Button>
        </div>

        {/* Progress & Validation Card */}
        <Card className="border-zinc-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Weightage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="font-medium text-zinc-700">Total Weightage</span>
              <span className={`font-bold ${isValidWeightage ? 'text-green-600' : 'text-red-500'}`}>
                {totalWeightage}% / 100%
              </span>
            </div>
            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${isValidWeightage ? 'bg-green-500' : totalWeightage > 100 ? 'bg-red-500' : 'bg-zinc-900'}`}
                style={{ width: `${Math.min(totalWeightage, 100)}%` }}
              />
            </div>
            {hasMinWeightageError && (
              <p className="text-sm text-red-500 mt-2">Error: Each goal must have a minimum weightage of 10%.</p>
            )}
            {!isValidWeightage && totalWeightage !== 0 && !hasMinWeightageError && (
              <p className="text-sm text-red-500 mt-2">Error: Total weightage must equal exactly 100%.</p>
            )}
          </CardContent>
        </Card>

        {/* Form Area */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {goals.map((goal, index) => (
            <Card key={goal.id} className="border-zinc-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold">Goal {index + 1}</h3>
                  {goals.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 h-8 hover:bg-red-50"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to remove this goal?")) {
                          removeGoal(goal.id);
                        }
                      }} 
                    >
                      Remove
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Notice we changed md:col-span-6 to md:col-span-4 here! */}
                  <div className="md:col-span-4 space-y-2">
                    <Label htmlFor={`title-${goal.id}`}>Goal Title</Label>
                    <Input 
                      id={`title-${goal.id}`} 
                      placeholder="e.g., Increase Q3 Revenue" 
                      value={goal.title}
                      onChange={(e) => updateGoal(goal.id, 'title', e.target.value)}
                      required
                    />
                  </div>
                  
                  {/* NEW THRUST AREA DROPDOWN */}
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor={`thrust-${goal.id}`}>Thrust Area</Label>
                    <select 
                      id={`thrust-${goal.id}`}
                      className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
                      value={goal.thrustArea}
                      onChange={(e) => updateGoal(goal.id, 'thrustArea', e.target.value)}
                    >
                      <option value="Financial">Financial</option>
                      <option value="Customer">Customer</option>
                      <option value="Internal Process">Internal Process</option>
                      <option value="Learning & Growth">Learning & Growth</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor={`uom-${goal.id}`}>UoM Type</Label>
                    <select 
                      id={`uom-${goal.id}`}
                      className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
                      value={goal.uom}
                      onChange={(e) => updateGoal(goal.id, 'uom', e.target.value)}
                    >
                      <option value="Min">Min (Higher is Better)</option>
                      <option value="Max">Max (Lower is Better)</option>
                      <option value="Timeline">Timeline</option>
                      <option value="Zero-based">Zero-based</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor={`target-${goal.id}`}>Target</Label>
                    <Input 
                      id={`target-${goal.id}`} 
                      type="number" 
                      min="0"
                      placeholder="Value"
                      value={goal.target}
                      onChange={(e) => updateGoal(goal.id, 'target', e.target.value)}
                      required
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor={`weight-${goal.id}`}>Weight (%)</Label>
                    <Input 
                      id={`weight-${goal.id}`} 
                      type="number" 
                      min="0"
                      max="100"
                      placeholder="%"
                      value={goal.weightage}
                      onChange={(e) => updateGoal(goal.id, 'weightage', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex items-center justify-between pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={addGoal} 
              disabled={goals.length >= 8}
            >
              + Add Another Goal ({goals.length}/8)
            </Button>
            
            <Button 
              type="submit" 
              className="bg-zinc-900 text-white hover:bg-zinc-800"
              disabled={!isValidWeightage || hasMinWeightageError || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Goal Sheet"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}