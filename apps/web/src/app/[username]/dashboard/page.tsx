"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function UserDashboard() {
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  const [newProjectName, setNewProjectName] = useState("");

  const projects = [
    { id: 1, name: "spotify", description: "Music streaming platform design" },
    { id: 2, name: "ecommerce", description: "E-commerce storefront" },
  ];

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      router.push(`/${username}/dashboard/${newProjectName}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Projects</h1>
        <p className="text-muted-foreground">
          Select a project to continue or create a new one
        </p>
      </div>

      {/* Create new project */}
      <Card className="mb-8 p-6">
        <h2 className="text-lg font-semibold mb-4">Create New Project</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Project name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="flex-1 px-4 py-2 border border-input rounded-md bg-background"
            onKeyDown={(e) => e.key === "Enter" && handleCreateProject()}
          />
          <Button
            onClick={handleCreateProject}
            disabled={!newProjectName.trim()}
          >
            Create
          </Button>
        </div>
      </Card>

      {/* Projects list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() =>
              router.push(`/${username}/dashboard/${project.name}`)
            }
          >
            <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
            <p className="text-sm text-muted-foreground">
              {project.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
