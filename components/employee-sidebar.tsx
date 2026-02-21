"use client"

import { useState } from "react"
import { useTaskContext } from "@/lib/task-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, ChevronRight, Mail, Phone, MapPin, Save, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmployeeSidebarProps {
  selectedEmployeeId: string | null
  onSelectEmployee: (employeeId: string | null) => void
}

export function EmployeeSidebar({
  selectedEmployeeId,
  onSelectEmployee,
}: EmployeeSidebarProps) {
  const { currentUser, tasks, allEmployees } = useTaskContext()
  const [activeTab, setActiveTab] = useState<"employees" | "profile">("employees")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    location: currentUser?.location || "",
  })
  const [tempProfileData, setTempProfileData] = useState(profileData)

  const getEmployeeTaskStats = (employeeId: string) => {
    const employeeTasks = tasks.filter((t) => t.assigneeId === employeeId)
    const total = employeeTasks.length
    const inProgress = employeeTasks.filter(
      (t) => t.status === "in-progress"
    ).length
    const completed = employeeTasks.filter(
      (t) => t.status === "completed"
    ).length
    const overdue = employeeTasks.filter(
      (t) => t.status !== "completed" && new Date(t.dueDate) < new Date()
    ).length
    return { total, inProgress, completed, overdue }
  }

  const handleEditProfile = () => {
    setTempProfileData(profileData)
    setIsEditingProfile(true)
  }

  const handleSaveProfile = () => {
    setProfileData(tempProfileData)
    setIsEditingProfile(false)
  }

  const handleCancelEdit = () => {
    setIsEditingProfile(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setTempProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const initials = currentUser?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U"

  return (
    <aside className="w-80 shrink-0 border-r border-border bg-card flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <ClipboardList className="h-5 w-5 text-primary-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">My Workspace</h2>
        </div>
        {currentUser && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-3 border-b border-border">
        <button
          onClick={() => setActiveTab("employees")}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "employees"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Employee</span>
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "profile"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Profile</span>
        </button>
      </div>

      {/* Content - Scrollable */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* Employees Tab */}
          {activeTab === "employees" && (
            <div className="flex flex-col gap-0.5">
              {/* All Employees option */}
              <button
                onClick={() => onSelectEmployee(null)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                  selectedEmployeeId === null
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    selectedEmployeeId === null
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  <Users className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">All Employees</p>
                  <p className="text-xs text-muted-foreground">
                    {tasks.length} total tasks
                  </p>
                </div>
                {selectedEmployeeId === null && (
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-primary" />
                )}
              </button>

              {/* Divider */}
              <div className="h-px bg-border mx-2 my-1.5" />

              {/* Employee List */}
              {allEmployees.map((employee) => {
                const stats = getEmployeeTaskStats(employee.id)
                const isSelected = selectedEmployeeId === employee.id
                const initials = employee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()

                return (
                  <button
                    key={employee.id}
                    onClick={() => onSelectEmployee(employee.id)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback
                        className={cn(
                          "text-xs font-medium",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-foreground"
                        )}
                      >
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-medium truncate",
                          isSelected ? "text-foreground" : ""
                        )}
                      >
                        {employee.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px]">
                          {stats.total} task{stats.total !== 1 ? "s" : ""}
                        </span>
                        {stats.inProgress > 0 && (
                          <span className="flex items-center gap-1 text-[11px] text-[hsl(var(--warning))]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--warning))]" />
                            {stats.inProgress}
                          </span>
                        )}
                        {stats.overdue > 0 && (
                          <span className="flex items-center gap-1 text-[11px] text-destructive">
                            <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                            {stats.overdue}
                          </span>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-primary" />
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              {!isEditingProfile ? (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <Avatar className="h-16 w-16 mx-auto mb-3">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl font-medium">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border border-border bg-secondary/30">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground font-medium">Name</p>
                      </div>
                      <p className="text-sm font-medium text-foreground">{profileData.name}</p>
                    </div>

                    <div className="p-3 rounded-lg border border-border bg-secondary/30">
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground font-medium">Email</p>
                      </div>
                      <p className="text-sm font-medium text-foreground">{profileData.email}</p>
                    </div>

                    <div className="p-3 rounded-lg border border-border bg-secondary/30">
                      <div className="flex items-center gap-2 mb-1">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground font-medium">Phone</p>
                      </div>
                      <p className="text-sm font-medium text-foreground">{profileData.phone || "Not set"}</p>
                    </div>

                    <div className="p-3 rounded-lg border border-border bg-secondary/30">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground font-medium">Location</p>
                      </div>
                      <p className="text-sm font-medium text-foreground">{profileData.location || "Not set"}</p>
                    </div>
                  </div>

                  <Button
                    onClick={handleEditProfile}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Edit Profile
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground font-medium block mb-1">
                        Name
                      </label>
                      <Input
                        value={tempProfileData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="text-sm"
                        placeholder="Enter name"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground font-medium block mb-1">
                        Email
                      </label>
                      <Input
                        value={tempProfileData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="text-sm"
                        placeholder="Enter email"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground font-medium block mb-1">
                        Phone
                      </label>
                      <Input
                        value={tempProfileData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="text-sm"
                        placeholder="Enter phone"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground font-medium block mb-1">
                        Location
                      </label>
                      <Input
                        value={tempProfileData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className="text-sm"
                        placeholder="Enter location"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  )
}
