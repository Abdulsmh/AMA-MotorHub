import React, { useState } from "react";
import { supabase } from "../lib/supabase";

const DebugDb = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkMotorcycles = async () => {
    setLoading(true);
    try {
      // Get all motorcycles regardless of status
      const { data: allBikes, error: allError } = await supabase
        .from("motorcycles")
        .select("*");
      
      console.log("All motorcycles:", allBikes);
      console.log("Error:", allError);
      
      // Get available motorcycles
      const { data: availableBikes, error: availError } = await supabase
        .from("motorcycles")
        .select("*")
        .eq("status", "available")
        .gt("quantity", 0);
      
      console.log("Available motorcycles:", availableBikes);
      
      setResult({
        allBikes: allBikes || [],
        allError,
        availableBikes: availableBikes || [],
        availError,
      });
    } catch (error) {
      console.error("Error:", error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const fixStatus = async () => {
    setLoading(true);
    try {
      // Update all motorcycles with NULL status to "available"
      const { data, error } = await supabase
        .from("motorcycles")
        .update({ status: "available" })
        .is("status", null);
      
      console.log("Fixed NULL statuses:", data, error);
      
      // Update any with empty status
      const { data: data2, error: error2 } = await supabase
        .from("motorcycles")
        .update({ status: "available" })
        .eq("status", "");
      
      console.log("Fixed empty statuses:", data2, error2);
      
      alert("Status fixed! Check console for details.");
      checkMotorcycles();
    } catch (error) {
      console.error("Error fixing status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Database Debug</h1>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={checkMotorcycles}
          className="px-4 py-2 bg-emerald-600 text-white rounded"
        >
          Check Motorcycles
        </button>
        <button
          onClick={fixStatus}
          className="px-4 py-2 bg-amber-600 text-white rounded"
        >
          Fix NULL Statuses
        </button>
      </div>
      
      {loading && <div>Loading...</div>}
      
      {result && (
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="font-bold">All Motorcycles:</h2>
            <pre className="text-xs overflow-auto max-h-60">
              {JSON.stringify(result.allBikes, null, 2)}
            </pre>
          </div>
          
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="font-bold">Available Motorcycles (status='available' AND quantity>0):</h2>
            <pre className="text-xs overflow-auto max-h-60">
              {JSON.stringify(result.availableBikes, null, 2)}
            </pre>
          </div>
          
          {result.allError && (
            <div className="bg-red-100 p-4 rounded text-red-700">
              Error: {JSON.stringify(result.allError)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DebugDb;