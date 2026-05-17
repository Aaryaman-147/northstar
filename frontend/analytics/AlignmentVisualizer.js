import { useState } from 'react';

export default function AlignmentVisualizer() {
  const [activeNode, setActiveNode] = useState(null);

  // Simulated relational data
  const companyKPI = { title: "Hit $1M in Enterprise Sales", progress: 86 };
  const employeeGoals = [
    { id: 1, title: "Close 5 Enterprise Deals", owner: "Sarah", progress: 90, color: "bg-blue-500", delay: "animation-delay-0" },
    { id: 2, title: "Increase Outbound Calls", owner: "David", progress: 40, color: "bg-amber-500", delay: "animation-delay-1000" },
    { id: 3, title: "Launch Q3 Marketing Campaign", owner: "Elena", progress: 100, color: "bg-emerald-500", delay: "animation-delay-2000" },
    { id: 4, title: "Reduce Churn by 5%", owner: "Marcus", progress: 75, color: "bg-purple-500", delay: "animation-delay-3000" },
  ];

  return (
    <div className="w-full bg-zinc-950 rounded-xl p-8 overflow-hidden relative flex flex-col items-center justify-center min-h-[500px] border border-zinc-800 shadow-2xl">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Central Star (Company KPI) */}
      <div className="relative z-10 flex flex-col items-center group cursor-pointer" onMouseEnter={() => setActiveNode('kpi')} onMouseLeave={() => setActiveNode(null)}>
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_40px_rgba(99,102,241,0.6)] flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110">
          🏢
        </div>
        <div className={`absolute top-28 w-48 text-center transition-opacity duration-300 ${activeNode === 'kpi' ? 'opacity-100' : 'opacity-50'}`}>
          <p className="text-white font-bold text-sm">{companyKPI.title}</p>
          <p className="text-indigo-300 text-xs mt-1">{companyKPI.progress}% Overall</p>
        </div>
      </div>

      {/* Orbit Rings */}
      <div className="absolute w-[300px] h-[300px] border border-zinc-700/50 rounded-full"></div>
      <div className="absolute w-[450px] h-[450px] border border-zinc-700/30 rounded-full"></div>

      {/* Orbiting Employee Goals */}
      {employeeGoals.map((goal, index) => {
        // Calculate static positions on a circle for the demo
        const angle = (index / employeeGoals.length) * 2 * Math.PI;
        const radius = index % 2 === 0 ? 150 : 225; // Alternate rings
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <div 
            key={goal.id}
            className="absolute z-20 cursor-pointer group transition-all duration-300 hover:z-30"
            style={{ transform: `translate(${x}px, ${y}px)` }}
            onMouseEnter={() => setActiveNode(goal.id)}
            onMouseLeave={() => setActiveNode(null)}
          >
            <div className={`w-8 h-8 rounded-full ${goal.color} shadow-[0_0_20px_rgba(255,255,255,0.2)] border-2 border-zinc-900 transition-transform duration-300 group-hover:scale-150`}></div>
            
            {/* Tooltip */}
            <div className={`absolute top-10 -left-16 w-40 bg-zinc-900 border border-zinc-700 rounded-md p-3 shadow-xl transition-all duration-300 ${activeNode === goal.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
              <p className="text-white text-xs font-bold leading-tight">{goal.title}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[10px] text-zinc-400">👤 {goal.owner}</span>
                <span className={`text-[10px] font-bold ${goal.progress >= 80 ? 'text-green-400' : 'text-amber-400'}`}>{goal.progress}%</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}