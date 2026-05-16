"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminAuditDashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/admin/audit-logs");
        const data = await res.json();
        setLogs(data);
      } catch (error) {
        console.error("Failed to fetch logs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const downloadCSV = () => {
    const headers = ["Timestamp", "User", "Action", "Previous Value", "Updated Value"];
    const rows = logs.map(log => [
      log.timestamp, 
      log.performed_by, 
      log.action, 
      log.old_value || "", 
      log.new_value || ""
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "northstar_audit_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const runEscalationEngine = async () => {
    setIsRunning(true);
    try {
      const res = await fetch("http://localhost:8000/api/admin/run-escalations", {
        method: "POST"
      });
      const data = await res.json();
      if (res.ok) {
        alert(`🚨 Escalation Engine Run Complete! Flagged ${data.count} overdue items.`);
        window.location.reload(); // Refresh to show the new logs
      }
    } catch (error) {
      console.error("Failed to run escalations", error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-8 text-zinc-900">
      <div className="mx-auto max-w-6xl space-y-6">
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Governance Portal</h1>
            <p className="text-zinc-500 mt-1">Immutable audit trail of all platform adjustments and approvals.</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={runEscalationEngine} 
              disabled={isRunning}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              {isRunning ? "Scanning..." : "🚨 Run Escalation Engine"}
            </Button>
            <Button onClick={downloadCSV} className="bg-green-600 hover:bg-green-700 text-white">
              📥 Export to CSV
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-md border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-100/50">
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Previous Value</TableHead>
                <TableHead>Updated Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="p-4">
                    <div className="space-y-3 w-full animate-pulse">
                      <div className="h-10 bg-zinc-100 rounded-md w-full"></div>
                      <div className="h-10 bg-zinc-100 rounded-md w-full"></div>
                      <div className="h-10 bg-zinc-100 rounded-md w-3/4"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-zinc-500">No actions recorded yet.</TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs text-zinc-500 whitespace-nowrap">
                      {log.timestamp}
                    </TableCell>
                    <TableCell className="font-medium">{log.performed_by}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        log.action.includes("Status") ? "bg-blue-50 text-blue-700" : 
                        log.action.includes("Escalation") ? "bg-red-50 text-red-700 border-red-200" :
                        "bg-zinc-100 text-zinc-700"
                      }>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-500">{log.old_value || "-"}</TableCell>
                    <TableCell className="font-medium text-green-700">{log.new_value || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}