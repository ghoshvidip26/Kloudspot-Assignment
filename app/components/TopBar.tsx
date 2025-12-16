"use client";

import { useEffect, useState } from "react";
import { sitesStore } from "../utils/utils";

const TopBar = () => {
  // ✅ Individual selectors (VERY IMPORTANT)
  const sites = sitesStore((s) => s.sites);
  const selectedSiteId = sitesStore((s) => s.selectedSiteId);
  const loadSites = sitesStore((s) => s.loadSites);
  const setSelectedSiteId = sitesStore((s) => s.setSelectedSiteId);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // ✅ Load once on mount
  useEffect(() => {
    loadSites();
  }, []);

  const selectedSite = sites.find((s) => s.siteId === selectedSiteId);

  return (
    <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <h1 className="text-lg font-semibold text-gray-800">Crowd Solutions</h1>
        <div className="h-6 w-px bg-gray-300" />
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen((p) => !p)}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors rounded-lg border border-gray-300 p-2"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{selectedSite?.name ?? "Select Site"}</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow rounded">
              {sites.map((site) => (
                <button
                  key={site.siteId}
                  onClick={() => {
                    setSelectedSiteId(site.siteId);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors ${selectedSiteId === site.siteId
                    ? "text-teal-600 font-medium"
                    : ""
                    }`}
                >
                  {site.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
