import React, { useState, useEffect } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from "recharts";

export default function RealmTool() {
  const [scores, setScores] = useState({ R: 50, E: 50, A: 50, L: 50, M: 50 });
  const [history, setHistory] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [newOpp, setNewOpp] = useState({ idea: "", impact: 5, novelty: 5, alignment: 5 });

  // Save history in localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("realmHistory")) || [];
    setHistory(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("realmHistory", JSON.stringify(history));
  }, [history]);

  // Handle score change
  const updateScore = (dim, val) => {
    setScores({ ...scores, [dim]: Number(val) });
  };

  // Save snapshot
  const saveSnapshot = () => {
    setHistory([...history, { date: new Date().toLocaleDateString(), scores }]);
  };

  // Add opportunity
  const addOpportunity = () => {
    const score = newOpp.impact * 0.5 + newOpp.novelty * 0.3 + newOpp.alignment * 0.2;
    setOpportunities([...opportunities, { ...newOpp, score }]);
    setNewOpp({ idea: "", impact: 5, novelty: 5, alignment: 5 });
  };

  // Recommendations
  const recommendations = Object.entries(scores)
    .filter(([_, val]) => val < 40)
    .map(([dim]) => {
      switch (dim) {
        case "R": return "Increase brand rhythm: revisit strategy more often, scan cultural signals.";
        case "E": return "Deepen emotional connection: use authentic storytelling.";
        case "A": return "Experiment more: pilot bold creative activations.";
        case "L": return "Improve literacy: simplify messages, make brand easier to grasp.";
        case "M": return "Strengthen magnetism: sharpen positioning and community pull.";
        default: return null;
      }
    });

  const chartData = Object.keys(scores).map((k) => ({ dimension: k, score: scores[k] }));

  return (
    <div className="bg-white shadow rounded-2xl p-6">
      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(scores).map((dim) => (
          <div key={dim}>
            <label className="block mb-1 font-semibold">{dim}</label>
            <input type="range" min="0" max="100" value={scores[dim]} onChange={(e) => updateScore(dim, e.target.value)} className="w-full"/>
            <div>{scores[dim]}</div>
          </div>
        ))}
      </div>

      {/* Radar Chart */}
      <div className="my-8 flex justify-center">
        <RadarChart outerRadius={150} width={500} height={400} data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="dimension" />
          <PolarRadiusAxis />
          <Radar name="Scores" dataKey="score" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.6} />
          <Tooltip />
          <Legend />
        </RadarChart>
      </div>

      {/* Snapshot */}
      <button onClick={saveSnapshot} className="bg-blue-600 text-white px-4 py-2 rounded">Save Snapshot</button>

      <div className="mt-4">
        <h2 className="font-bold">History</h2>
        <ul>
          {history.map((h, i) => (
            <li key={i}>{h.date} → {JSON.stringify(h.scores)}</li>
          ))}
        </ul>
      </div>

      {/* Opportunities */}
      <div className="mt-6">
        <h2 className="font-bold">Opportunity Engine</h2>
        <input placeholder="Idea" className="border p-2 mr-2" value={newOpp.idea} onChange={(e) => setNewOpp({ ...newOpp, idea: e.target.value })}/>
        <button onClick={addOpportunity} className="bg-green-600 text-white px-3 py-2 rounded">Add</button>

        <ul className="mt-3">
          {opportunities.sort((a,b) => b.score - a.score).map((opp, i) => (
            <li key={i} className="mt-1">⭐ {opp.idea} → Score: {opp.score.toFixed(1)}</li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mt-6 bg-yellow-100 p-4 rounded">
          <h2 className="font-bold">Recommendations</h2>
          <ul>
            {recommendations.map((rec, i) => <li key={i}>- {rec}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
