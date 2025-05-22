"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { Users, Copy, Check, MoreHorizontal, Shield, ShieldAlert, UserMinus, AlertCircle, UserCog } from "lucide-react"
import type { Team, TeamRole } from "../types/team"
import { useTeams } from "../hooks/use-teams"
import { useAuth } from "@/contexts/auth-context"

interface TeamManagementDialogProps {
  trigger?: React.ReactNode
  currentTeam?: Team | null
  onTeamChange?: (team: Team | null) => void
}

export function TeamManagementDialog({ trigger, currentTeam, onTeamChange }: TeamManagementDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("members")
  const [newTeamName, setNewTeamName] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [isCreatingTeam, setIsCreatingTeam] = useState(false)
  const [isSendingInvite, setIsSendingInvite] = useState(false)
  const [inviteLink, setInviteLink] = useState("")
  const [inviteLinkCopied, setInviteLinkCopied] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const {
    teams,
    createTeam,
    updateTeam,
    deleteTeam,
    inviteToTeam,
    removeFromTeam,
    updateMemberRole,
    leaveTeam,
    generateInviteLink,
  } = useTeams()

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setNewTeamName(currentTeam?.name || "")
      setInviteEmail("")
      setInviteLink("")
      setInviteLinkCopied(false)
      setActiveTab("members")
    }
  }, [isOpen, currentTeam])

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      toast({
        title: "Team name required",
        description: "Please enter a name for your team",
        variant: "destructive",
      })
      return
    }

    setIsCreatingTeam(true)
    try {
      const team = await createTeam(newTeamName)
      toast({
        title: "Team created",
        description: `Your team "${team.name}" has been created successfully.`,
      })
      if (onTeamChange) {
        onTeamChange(team)
      }
      setIsOpen(false)
    } catch (error) {
      toast({
        title: "Failed to create team",
        description: "There was an error creating your team. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingTeam(false)
    }
  }

  const handleUpdateTeam = async () => {
    if (!currentTeam || !newTeamName.trim()) return

    try {
      const updatedTeam = await updateTeam(currentTeam.id, { name: newTeamName })
      toast({
        title: "Team updated",
        description: `Team name updated to "${updatedTeam.name}".`,
      })
      if (onTeamChange) {
        onTeamChange(updatedTeam)
      }
    } catch (error) {
      toast({
        title: "Failed to update team",
        description: "There was an error updating your team. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTeam = async () => {
    if (!currentTeam) return

    if (
      window.confirm(`Are you sure you want to delete the team "${currentTeam.name}"? This action cannot be undone.`)
    ) {
      try {
        await deleteTeam(currentTeam.id)
        toast({
          title: "Team deleted",
          description: `The team "${currentTeam.name}" has been deleted.`,
        })
        if (onTeamChange) {
          onTeamChange(null)
        }
        setIsOpen(false)
      } catch (error) {
        toast({
          title: "Failed to delete team",
          description: "There was an error deleting the team. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleLeaveTeam = async () => {
    if (!currentTeam) return

    if (
      window.confirm(
        `Are you sure you want to leave the team "${currentTeam.name}"? You will lose access to all team projects.`,
      )
    ) {
      try {
        await leaveTeam(currentTeam.id)
        toast({
          title: "Left team",
          description: `You have left the team "${currentTeam.name}".`,
        })
        if (onTeamChange) {
          onTeamChange(null)
        }
        setIsOpen(false)
      } catch (error) {
        toast({
          title: "Failed to leave team",
          description: "There was an error leaving the team. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleInviteMember = async () => {
    if (!currentTeam || !inviteEmail.trim()) return

    setIsSendingInvite(true)
    try {
      await inviteToTeam(currentTeam.id, inviteEmail)
      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${inviteEmail}.`,
      })
      setInviteEmail("")
    } catch (error) {
      toast({
        title: "Failed to send invitation",
        description: "There was an error sending the invitation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSendingInvite(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!currentTeam) return

    if (window.confirm("Are you sure you want to remove this member from the team?")) {
      try {
        await removeFromTeam(currentTeam.id, memberId)
        toast({
          title: "Member removed",
          description: "The member has been removed from the team.",
        })
      } catch (error) {
        toast({
          title: "Failed to remove member",
          description: "There was an error removing the member. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleRoleChange = async (memberId: string, role: TeamRole) => {
    if (!currentTeam) return

    try {
      await updateMemberRole(currentTeam.id, memberId, role)
      toast({
        title: "Role updated",
        description: `The member's role has been updated to ${role}.`,
      })
    } catch (error) {
      toast({
        title: "Failed to update role",
        description: "There was an error updating the member's role. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleGenerateInviteLink = async () => {
    if (!currentTeam) return

    try {
      const link = await generateInviteLink(currentTeam.id)
      setInviteLink(link)
    } catch (error) {
      toast({
        title: "Failed to generate invite link",
        description: "There was an error generating the invite link. Please try again.",
        variant: "destructive",
      })
    }
  }

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink)
    setInviteLinkCopied(true)
    setTimeout(() => setInviteLinkCopied(false), 2000)
  }

  const isAdmin = currentTeam?.members.some(
    (member) => member.userId === user?.id && (member.role === "admin" || member.role === "owner"),
  )

  const isOwner = currentTeam?.members.some((member) => member.userId === user?.id && member.role === "owner")

  const getRoleBadge = (role: TeamRole) => {
    switch (role) {
      case "owner":
        return (
          <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
            <ShieldAlert className="h-3 w-3 mr-1" />
            Owner
          </Badge>
        )
      case "admin":
        return (
          <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        )
      case "member":
        return (
          <Badge variant="outline">
            <Users className="h-3 w-3 mr-1" />
            Member
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-1">
            <Users className="h-4 w-4" />
            <span>Manage Team</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{currentTeam ? `Team: ${currentTeam.name}` : "Create a Team"}</DialogTitle>
          <DialogDescription>
            {currentTeam
              ? "Manage your team members and settings"
              : "Create a new team to collaborate on projects with others"}
          </DialogDescription>
        </DialogHeader>

        {currentTeam ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="members" className="space-y-4 py-4">
              {isAdmin && (
                <div className="space-y-2">
                  <Label htmlFor="invite-email">Invite a new member</Label>
                  <div className="flex gap-2">
                    <Input
                      id="invite-email"
                      placeholder="Email address"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                    <Button
                      onClick={handleInviteMember}
                      disabled={!inviteEmail.trim() || isSendingInvite}
                      className="shrink-0"
                    >
                      {isSendingInvite ? "Sending..." : "Invite"}
                    </Button>
                  </div>

                  <div className="pt-2">
                    <Label className="text-sm text-muted-foreground">Or share an invite link</Label>
                    {inviteLink ? (
                      <div className="flex mt-1 gap-2">
                        <Input value={inviteLink} readOnly className="text-xs" />
                        <Button
                          variant="outline"
                          size="icon"
                          className="shrink-0"
                          onClick={copyInviteLink}
                          title="Copy to clipboard"
                        >
                          {inviteLinkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" onClick={handleGenerateInviteLink} className="mt-1 text-xs">
                        Generate Invite Link
                      </Button>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Team Members ({currentTeam.members.length})</h3>
                <div className="rounded-md border">
                  {currentTeam.members.map((member) => (
                    <div key={member.userId} className="flex items-center justify-between p-2 border-b last:border-0">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm flex items-center gap-2">
                            {member.name}
                            {member.userId === user?.id && (
                              <Badge variant="outline" className="text-xs">
                                You
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{member.email}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {getRoleBadge(member.role)}

                        {isAdmin && member.userId !== user?.id && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {isOwner && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => handleRoleChange(member.userId, "admin")}
                                    disabled={member.role === "admin"}
                                  >
                                    <Shield className="h-4 w-4 mr-2" />
                                    Make Admin
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleRoleChange(member.userId, "member")}
                                    disabled={member.role === "member"}
                                  >
                                    <Users className="h-4 w-4 mr-2" />
                                    Make Member
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                </>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleRemoveMember(member.userId)}
                                className="text-red-600"
                              >
                                <UserMinus className="h-4 w-4 mr-2" />
                                Remove from Team
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 py-4">
              {isAdmin ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="team-name">Team Name</Label>
                    <div className="flex gap-2">
                      <Input
                        id="team-name"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        placeholder="Enter team name"
                      />
                      <Button
                        onClick={handleUpdateTeam}
                        disabled={!newTeamName.trim() || newTeamName === currentTeam.name}
                        className="shrink-0"
                      >
                        Update
                      </Button>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-destructive">Danger Zone</h3>
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Warning</AlertTitle>
                      <AlertDescription>
                        Deleting a team will remove all team members and their access to team projects. This action
                        cannot be undone.
                      </AlertDescription>
                    </Alert>
                    <Button variant="destructive" onClick={handleDeleteTeam} className="w-full">
                      Delete Team
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Alert>
                      <UserCog className="h-4 w-4" />
                      <AlertTitle>Team Settings</AlertTitle>
                      <AlertDescription>
                        Only team admins can modify team settings. Contact a team admin if you need to make changes.
                      </AlertDescription>
                    </Alert>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Your Membership</h3>
                    <Button variant="outline" onClick={handleLeaveTeam} className="w-full text-red-600">
                      Leave Team
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-team-name">Team Name</Label>
              <Input
                id="new-team-name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Enter team name"
              />
            </div>

            <Alert>
              <Users className="h-4 w-4" />
              <AlertTitle>Team Collaboration</AlertTitle>
              <AlertDescription>
                Creating a team allows you to collaborate on projects with other users. You'll be able to invite team
                members and manage their access to your projects.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          {currentTeam ? (
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTeam} disabled={!newTeamName.trim() || isCreatingTeam}>
                {isCreatingTeam ? "Creating..." : "Create Team"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
