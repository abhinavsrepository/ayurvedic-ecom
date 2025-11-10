"use client";

import { useEffect } from "react";
import SpinWheel from "@/components/gamification/SpinWheel";

export default function TestSpinPage() {
  useEffect(() => {
    // Clear localStorage for testing
    if (typeof window !== "undefined") {
      localStorage.removeItem("spinWheelUsed");
      localStorage.removeItem("wonDiscount");
      console.log("Cleared spin wheel localStorage");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Spin Wheel Test Page</h1>
        <p className="text-lg mb-4">
          This page clears localStorage on load so you can test the spin wheel multiple times.
        </p>
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-2">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Look for the orange floating button in the bottom-right corner</li>
            <li>Click it to open the spin wheel modal</li>
            <li>Click "SPIN NOW!" to spin the wheel</li>
            <li>After winning, you can copy the coupon code</li>
            <li>Refresh this page to test again</li>
          </ol>
        </div>

        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <h3 className="font-bold text-yellow-800">Debug Info:</h3>
          <p className="text-yellow-700">Check the browser console (F12) for debug logs</p>
        </div>
      </div>

      <SpinWheel />
    </div>
  );
}
