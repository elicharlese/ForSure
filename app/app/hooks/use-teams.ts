"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import type { Team, TeamRole, TeamChat } from "../types/team"

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const { user } = useAuth()

  // Load teams from localStorage on initial render
  useEffect(() => {
    const loadTeams = () => {
      try {
        const saved = localStorage.getItem("forsure-teams")
        if (saved) {
          const parsedTeams = JSON.parse(saved) as Team[]
          // Only load teams that the current user is a member of
          const userTeams = parsedTeams.filter((team) => team.members.some((member) => member.userId === user?.id))
          setTeams(userTeams)
        }
      } catch (error) {
        console.error("Failed to load teams:", error)
      } finally {
        setIsLoaded(true)
      }
    }

    if (user) {
      loadTeams()
    } else {
      setTeams([])
      setIsLoaded(true)
    }
  }, [user])

  // Save teams to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      // Get all teams from localStorage first
      try {
        const saved = localStorage.getItem("forsure-teams")
        let allTeams: Team[] = []
        if (saved) {
          allTeams = JSON.parse(saved) as Team[]
        }

        // Update only the teams that have changed
        const updatedTeams = [...allTeams]
        teams.forEach((team) => {
          const index = updatedTeams.findIndex((t) => t.id === team.id)
          if (index >= 0) {
            updatedTeams[index] = team
          } else {
            updatedTeams.push(team)
          }
        })

        localStorage.setItem("forsure-teams", JSON.stringify(updatedTeams))
      } catch (error) {
        console.error("Failed to save teams:", error)
      }
    }
  }, [teams, isLoaded])

  const createTeam = async (name: string): Promise<Team> => {
    if (!user) throw new Error("User not authenticated")

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newTeam: Team = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
      members: [
        {
          userId: user.id,
          name: user.name,
          email: user.email,
          role: "owner",
          joinedAt: new Date().toISOString(),
          avatar: user.avatar,
          status: "online",
        },
      ],
      projects: [],
      chat: {
        messages: [],
      },
    }

    setTeams((prev) => [...prev, newTeam])
    return newTeam
  }

  const getTeam = (teamId: string): Team | undefined => {
    return teams.find((team) => team.id === teamId)
  }

  const updateTeam = async (
    teamId: string,
    data: {
      name?: string
      chat?: TeamChat
    },
  ): Promise<Team> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const teamIndex = teams.findIndex((team) => team.id === teamId)
    if (teamIndex === -1) throw new Error("Team not found")

    // For chat updates, we don't need to check permissions
    if (!data.name || user) {
      // Check if user has permission to update team name
      const userMember = teams[teamIndex].members.find((member) => member.userId === user?.id)
      if (!userMember || (userMember.role !== "admin" && userMember.role !== "owner")) {
        throw new Error("You don't have permission to update this team")
      }
    }

    const updatedTeam = {
      ...teams[teamIndex],
      ...(data.name && { name: data.name }),
      ...(data.chat && {
        chat: data.chat,
      }),
    }

    setTeams((prev) => {
      const updated = [...prev]
      updated[teamIndex] = updatedTeam
      return updated
    })

    return updatedTeam
  }

  const deleteTeam = async (teamId: string): Promise<void> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const teamIndex = teams.findIndex((team) => team.id === teamId)
    if (teamIndex === -1) throw new Error("Team not found")

    // Check if user is the owner
    const userMember = teams[teamIndex].members.find((member) => member.userId === user?.id)
    if (!userMember || userMember.role !== "owner") {
      throw new Error("Only the team owner can delete the team")
    }

    setTeams((prev) => prev.filter((team) => team.id !== teamId))
  }

  const inviteToTeam = async (teamId: string, email: string): Promise<void> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const teamIndex = teams.findIndex((team) => team.id === teamId)
    if (teamIndex === -1) throw new Error("Team not found")

    // Check if user has permission to invite
    const userMember = teams[teamIndex].members.find((member) => member.userId === user?.id)
    if (!userMember || (userMember.role !== "admin" && userMember.role !== "owner")) {
      throw new Error("You don't have permission to invite members to this team")
    }

    // In a real app, this would send an email invitation
    // For now, we'll simulate adding the user directly
    const mockUser = {
      userId: crypto.randomUUID(),
      name: email.split("@")[0],
      email,
      role: "member" as TeamRole,
      joinedAt: new Date().toISOString(),
      avatar: undefined,
      status: "offline" as const,
    }

    setTeams((prev) => {
      const updated = [...prev]
      updated[teamIndex] = {
        ...updated[teamIndex],
        members: [...updated[teamIndex].members, mockUser],
      }
      return updated
    })
  }

  const removeFromTeam = async (teamId: string, userId: string): Promise<void> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const teamIndex = teams.findIndex((team) => team.id === teamId)
    if (teamIndex === -1) throw new Error("Team not found")

    // Check if user has permission to remove members
    const userMember = teams[teamIndex].members.find((member) => member.userId === user?.id)
    if (!userMember || (userMember.role !== "admin" && userMember.role !== "owner")) {
      throw new Error("You don't have permission to remove members from this team")
    }

    // Cannot remove the owner
    const memberToRemove = teams[teamIndex].members.find((member) => member.userId === userId)
    if (memberToRemove?.role === "owner") {
      throw new Error("Cannot remove the team owner")
    }

    setTeams((prev) => {
      const updated = [...prev]
      updated[teamIndex] = {
        ...updated[teamIndex],
        members: updated[teamIndex].members.filter((member) => member.userId !== userId),
      }
      return updated
    })
  }

  const updateMemberRole = async (teamId: string, userId: string, role: TeamRole): Promise<void> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const teamIndex = teams.findIndex((team) => team.id === teamId)
    if (teamIndex === -1) throw new Error("Team not found")

    // Check if user is the owner
    const userMember = teams[teamIndex].members.find((member) => member.userId === user?.id)
    if (!userMember || userMember.role !== "owner") {
      throw new Error("Only the team owner can change member roles")
    }

    // Cannot change the owner's role
    const memberToUpdate = teams[teamIndex].members.find((member) => member.userId === userId)
    if (memberToUpdate?.role === "owner") {
      throw new Error("Cannot change the owner's role")
    }

    setTeams((prev) => {
      const updated = [...prev]
      updated[teamIndex] = {
        ...updated[teamIndex],
        members: updated[teamIndex].members.map((member) => (member.userId === userId ? { ...member, role } : member)),
      }
      return updated
    })
  }

  const leaveTeam = async (teamId: string): Promise<void> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const teamIndex = teams.findIndex((team) => team.id === teamId)
    if (teamIndex === -1) throw new Error("Team not found")

    // Check if user is a member
    const userMember = teams[teamIndex].members.find((member) => member.userId === user?.id)
    if (!userMember) {
      throw new Error("You are not a member of this team")
    }

    // Cannot leave if you're the owner
    if (userMember.role === "owner") {
      throw new Error("The team owner cannot leave the team. Transfer ownership or delete the team instead.")
    }

    setTeams((prev) => {
      const updated = [...prev]
      updated[teamIndex] = {
        ...updated[teamIndex],
        members: updated[teamIndex].members.filter((member) => member.userId !== user?.id),
      }
      return updated
    })
  }

  const generateInviteLink = async (teamId: string): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const teamIndex = teams.findIndex((team) => team.id === teamId)
    if (teamIndex === -1) throw new Error("Team not found")

    // Check if user has permission to generate invite links
    const userMember = teams[teamIndex].members.find((member) => member.userId === user?.id)
    if (!userMember || (userMember.role !== "admin" && userMember.role !== "owner")) {
      throw new Error("You don't have permission to generate invite links for this team")
    }

    // In a real app, this would generate a secure invite link
    // For now, we'll just return a mock link
    return `https://forsure.dev/invite/${teamId}/${crypto.randomUUID()}`
  }

  return {
    teams,
    getTeam,
    createTeam,
    updateTeam,
    deleteTeam,
    inviteToTeam,
    removeFromTeam,
    updateMemberRole,
    leaveTeam,
    generateInviteLink,
    isLoaded,
  }
}
