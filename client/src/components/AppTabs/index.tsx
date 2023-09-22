import React from "react";

type TabsProps = {
  tabs: string[];
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
};

export default function AppTabs({ tabs, activeTab, setActiveTab }: TabsProps) {
  return (
    <div className="tabs mb-1">
      {tabs.map((tab) => (
        <a
          key={tab}
          className={`tab tab-xs md:tab-md lg:tab-lg tab-lifted ${
            activeTab === tab ? "tab-active" : ""
          }`}
          id={tab}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </a>
      ))}
    </div>
  );
}
