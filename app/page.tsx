"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Calendar,
  Users,
  ChevronDown,
  X,
  Plus,
  Home,
  UserCheck,
  CalendarDays,
  FolderPlus,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { loadProjects, loadEvents, loadCommunityMembers, saveProjects } from "@/lib/data-utils"

export default function ProjectDashboard() {
  const [activeNavItem, setActiveNavItem] = useState("Home")
  const [searchQuery, setSearchQuery] = useState("")
  const [projectSearchQuery, setProjectSearchQuery] = useState("")
  const [sortByDate, setSortByDate] = useState("newest")
  const [sortByStatus, setSortByStatus] = useState("all")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const [showAddProject, setShowAddProject] = useState(false)
  const [newProject, setNewProject] = useState({
    title: "",
    startDate: "",
    dueDate: "",
    description: "",
    techStack: "",
    members: [],
    selectedMembers: [],
  })

  const [allProjects, setAllProjects] = useState<any[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])
  const [communityMembers, setCommunityMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true)
      try {
        const [projects, events, members] = await Promise.all([loadProjects(), loadEvents(), loadCommunityMembers()])

        const projectsWithDates = projects.map((project: any) => ({
          ...project,
          dateSort: new Date(project.dateSort),
        }))

        setAllProjects(projectsWithDates)
        setUpcomingEvents(events)
        setCommunityMembers(members)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAllData()
  }, [])

  const sidebarItems = [
    { name: "Home", icon: Home },
    { name: "Add Project", icon: FolderPlus },
    { name: "Projects", icon: Users },
    { name: "Events", icon: CalendarDays },
    { name: "Community", icon: UserCheck },
  ]

  const filteredAndSortedProjects = allProjects
    .filter(
      (project) =>
        project.title.toLowerCase().includes(projectSearchQuery.toLowerCase()) &&
        (sortByStatus === "all" || project.status.toLowerCase() === sortByStatus.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortByDate === "newest") {
        return b.dateSort.getTime() - a.dateSort.getTime()
      } else {
        return a.dateSort.getTime() - b.dateSort.getTime()
      }
    })

  const handleNavigation = (itemName: string) => {
    setActiveNavItem(itemName)
    setShowAddProject(false)
    setSidebarOpen(false)
    setMenuOpen(false)
  }

  const handleCreateProject = async () => {
    if (newProject.title && newProject.dueDate && newProject.startDate) {
      const projectToAdd = {
        id: allProjects.length + 1,
        title: newProject.title,
        status: "Planned",
        date: newProject.dueDate,
        startDate: newProject.startDate,
        dueDate: newProject.dueDate,
        dateSort: new Date(newProject.dueDate),
        members: newProject.selectedMembers.length,
        comments: 0,
        progress: 0,
        description: newProject.description,
        techStack: newProject.techStack,
        author: "Current User",
        memberAvatars: ["/diverse-person-portrait.png"],
        selectedMembers: newProject.selectedMembers,
      }

      const updatedProjects = [...allProjects, projectToAdd]
      setAllProjects(updatedProjects)

      await saveProjects(updatedProjects)

      setNewProject({
        title: "",
        startDate: "",
        dueDate: "",
        description: "",
        techStack: "",
        members: [],
        selectedMembers: [],
      })
      setShowAddProject(false)
      setActiveNavItem("Projects")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    )
  }

  const renderHomeView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to your project management dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <div className="text-2xl">📋</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allProjects.length}</div>
            <p className="text-xs text-muted-foreground">Active projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <div className="text-2xl">📅</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <div className="text-2xl">👥</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{communityMembers.length}</div>
            <p className="text-xs text-muted-foreground">Active members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <div className="text-2xl">📊</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Average progress</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allProjects.slice(0, 3).map((project, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">{project.title}</p>
                    <p className="text-sm text-gray-500">{project.author}</p>
                  </div>
                  <Badge variant="secondary">{project.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.slice(0, 3).map((event, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-500">
                      {event.date} at {event.time}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">{event.attendees} attendees</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderAddProjectView = () => (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Add New Project</h2>
          <p className="text-gray-600">Create a new project with all the necessary details</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              placeholder="Enter project title"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={newProject.startDate}
                onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={newProject.dueDate}
                onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your project"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="techStack">Tech Stack</Label>
            <Input
              id="techStack"
              placeholder="e.g., React, Node.js, MongoDB"
              value={newProject.techStack}
              onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Project Members</Label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  id="customMember"
                  placeholder="Type member name and press Add"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      const input = e.currentTarget.value.trim()
                      if (input && !newProject.selectedMembers.includes(input)) {
                        setNewProject({
                          ...newProject,
                          selectedMembers: [...newProject.selectedMembers, input],
                        })
                        e.currentTarget.value = ""
                      }
                    }
                  }}
                />
                <Button
                  onClick={(e) => {
                    const input = (document.getElementById("customMember") as HTMLInputElement)?.value.trim()
                    if (input && !newProject.selectedMembers.includes(input)) {
                      setNewProject({
                        ...newProject,
                        selectedMembers: [...newProject.selectedMembers, input],
                      })
                      ;(document.getElementById("customMember") as HTMLInputElement).value = ""
                    }
                  }}
                  className="whitespace-nowrap"
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-md p-4 space-y-3 max-h-64 overflow-y-auto">
              {communityMembers.map((member, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`member-${index}`}
                    checked={newProject.selectedMembers.includes(member.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewProject({
                          ...newProject,
                          selectedMembers: [...newProject.selectedMembers, member.name],
                        })
                      } else {
                        setNewProject({
                          ...newProject,
                          selectedMembers: newProject.selectedMembers.filter((m) => m !== member.name),
                        })
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <label htmlFor={`member-${index}`} className="ml-3 flex flex-col cursor-pointer flex-1">
                    <span className="font-medium text-sm">{member.name}</span>
                    <span className="text-xs text-gray-500">{member.role}</span>
                  </label>
                </div>
              ))}
            </div>
            {newProject.selectedMembers.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium mb-2">Selected Members ({newProject.selectedMembers.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {newProject.selectedMembers.map((member, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {member}
                      <button
                        onClick={() => {
                          setNewProject({
                            ...newProject,
                            selectedMembers: newProject.selectedMembers.filter((m) => m !== member),
                          })
                        }}
                        className="ml-1 hover:text-red-600"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button onClick={handleCreateProject} className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
            <Button variant="outline" onClick={() => setShowAddProject(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderProjectsView = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search projects..."
              className="pl-10 bg-white border-gray-200"
              value={projectSearchQuery}
              onChange={(e) => setProjectSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent justify-start sm:justify-center">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Sort By Date</span>
                <span className="sm:hidden">Date: {sortByDate === "newest" ? "Newest" : "Oldest"}</span>
                <ChevronDown className="h-4 w-4 ml-auto sm:ml-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortByDate("newest")}>Newest First</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortByDate("oldest")}>Oldest First</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAndSortedProjects.map((project, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between pb-3">
              <div className="flex-1">
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <Badge className="mt-2">{project.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                <p>
                  <span className="font-semibold">Author:</span> {project.author}
                </p>
                <p>
                  <span className="font-semibold">Due Date:</span> {project.dueDate}
                </p>
              </div>
              <div className="text-sm">
                <p className="font-semibold mb-1">Tech Stack:</p>
                <p className="text-gray-600">{project.techStack}</p>
              </div>
              <div className="text-sm">
                <p className="font-semibold mb-1">Description:</p>
                <p className="text-gray-600 line-clamp-2">{project.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{project.members} Members</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderEventsView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingEvents.map((event, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Date:</span> {event.date}
                </p>
                <p>
                  <span className="font-semibold">Time:</span> {event.time}
                </p>
                <p>
                  <span className="font-semibold">Location:</span> {event.location}
                </p>
                <p>
                  <span className="font-semibold">Project:</span> {event.project}
                </p>
              </div>
              <p className="text-sm text-gray-600">{event.description}</p>
              <Badge variant="secondary">{event.attendees} Attendees</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderCommunityView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Community Members</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communityMembers.map((member, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{member.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Role:</span> {member.role}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {member.email}
                </p>
                <p>
                  <span className="font-semibold">Department:</span> {member.department}
                </p>
              </div>
              <p className="text-sm text-gray-600">{member.bio}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "block" : "hidden"} md:flex flex-col w-full md:w-64 bg-white border-r border-gray-200 p-4 fixed md:relative z-40 h-screen md:h-auto`}
      >
        <Button onClick={() => setSidebarOpen(false)} className="absolute right-4 top-4 md:hidden">
          <X className="h-4 w-4" />
        </Button>
        <div className="space-y-4 mt-12 md:mt-0">
          {sidebarItems.map((item) => (
            <Button
              key={item.name}
              variant={activeNavItem === item.name ? "default" : "outline"}
              onClick={() => handleNavigation(item.name)}
              className="w-full flex items-center gap-2 justify-start"
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              {item.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between md:hidden">
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleNavigation("Home")}>
                <Home className="h-4 w-4 mr-2" />
                Home
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigation("Add Project")}>
                <FolderPlus className="h-4 w-4 mr-2" />
                Add Project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigation("Projects")}>
                <Users className="h-4 w-4 mr-2" />
                Projects
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigation("Events")}>
                <CalendarDays className="h-4 w-4 mr-2" />
                Events
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigation("Community")}>
                <UserCheck className="h-4 w-4 mr-2" />
                Community
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {activeNavItem === "Home" && renderHomeView()}
          {activeNavItem === "Add Project" && renderAddProjectView()}
          {activeNavItem === "Projects" && renderProjectsView()}
          {activeNavItem === "Events" && renderEventsView()}
          {activeNavItem === "Community" && renderCommunityView()}
        </div>
      </div>

      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 md:hidden z-30" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
