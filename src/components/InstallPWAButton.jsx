"use client";

import { useEffect, useState } from "react";

export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true); // show the install button
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function installApp() {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      alert("Installed!");
    } else {
      alert("Dismissed");
    }

    setDeferredPrompt(null);
    setShowButton(false);
  }

  if (!showButton) return null;

  return (
    <button
      onClick={installApp}
      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl transition-opacity duration-200"
    >
      Install App
    </button>
  );
}
