"use client"

import { useState } from "react"
import { useTaskContext } from "@/lib/task-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, User, LayoutDashboard } from "lucide-react"
import type { UserRole } from "@/lib/store"

export function LoginScreen() {
  const { login, allEmployees } = useTaskContext()
  const [selectedEmployee, setSelectedEmployee] = useState(allEmployees[0].id)

  const handleLogin = (role: UserRole) => {
    login(role, selectedEmployee)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">TaskFlow</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Task management with real-time progress tracking
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base text-card-foreground">Admin Dashboard</CardTitle>
                  <CardDescription>Create tasks, assign employees, and view reports</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button onClick={() => handleLogin("admin")} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Continue as Admin
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base text-card-foreground">Employee Dashboard</CardTitle>
                  <CardDescription>View tasks, update progress, and write notes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger className="bg-secondary border-border text-foreground">
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {allEmployees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => handleLogin("employee")} variant="outline" className="w-full border-border text-foreground hover:bg-accent">
                  Continue as Employee
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Select a role to explore the task management system
        </p>
      </div>
    </div>
  )
}
