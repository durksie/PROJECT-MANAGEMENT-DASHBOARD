export async function loadProjects() {
  try {
    const response = await fetch("/data/projects.json")
    if (!response.ok) throw new Error("Failed to load projects")
    return await response.json()
  } catch (error) {
    console.error("Error loading projects:", error)
    return []
  }
}

export async function loadEvents() {
  try {
    const response = await fetch("/data/events.json")
    if (!response.ok) throw new Error("Failed to load events")
    return await response.json()
  } catch (error) {
    console.error("Error loading events:", error)
    return []
  }
}

export async function loadCommunityMembers() {
  try {
    const response = await fetch("/data/community.json")
    if (!response.ok) throw new Error("Failed to load community members")
    return await response.json()
  } catch (error) {
    console.error("Error loading community members:", error)
    return []
  }
}

export async function saveProjects(projects: any[]) {
  try {
    localStorage.setItem("projects", JSON.stringify(projects))
    console.log("Projects saved to localStorage")
  } catch (error) {
    console.error("Error saving projects:", error)
  }
}

export async function saveEvents(events: any[]) {
  try {
    localStorage.setItem("events", JSON.stringify(events))
    console.log("Events saved to localStorage")
  } catch (error) {
    console.error("Error saving events:", error)
  }
}

export async function saveCommunityMembers(members: any[]) {
  try {
    localStorage.setItem("community", JSON.stringify(members))
    console.log("Community members saved to localStorage")
  } catch (error) {
    console.error("Error saving community members:", error)
  }
}
