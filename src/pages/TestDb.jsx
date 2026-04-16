import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

const TestDb = () => {
  const { user } = useAuth();
  const [motorcycles, setMotorcycles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkDatabase();
  }, []);

  const checkDatabase = async () => {
    try {
      // Check users table
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("*")
        .eq("type", "vendor");

      console.log("Users in database:", users);
      console.log("Users error:", usersError);

      // Check motorcycles table
      const { data: bikes, error: bikesError } = await supabase
        .from("motorcycles")
        .select("*");

      console.log("Motorcycles in database:", bikes);
      console.log("Motorcycles error:", bikesError);

      setMotorcycles(bikes || []);
    } catch (error) {
      console.error("Error checking database:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Database Test</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold">Current User:</h2>
        <pre className="bg-gray-100 p-3 rounded mt-2 overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Motorcycles in Database:</h2>
        <pre className="bg-gray-100 p-3 rounded mt-2 overflow-auto">
          {JSON.stringify(motorcycles, null, 2)}
        </pre>
      </div>

      <button
        onClick={checkDatabase}
        className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded"
      >
        Refresh
      </button>
    </div>
  );
};

export default TestDb;
