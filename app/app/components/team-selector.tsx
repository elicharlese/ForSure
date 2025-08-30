'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Users, UserPlus, ChevronDown } from 'lucide-react'
import { TeamManagementDialog } from './team-management-dialog'
import { useTeams } from '../hooks/use-teams'
import type { Team } from '../types/team'

interface TeamSelectorProps {
  onTeamChange: (team: Team | null) => void
  currentTeam: Team | null
}

export function TeamSelector({ onTeamChange, currentTeam }: TeamSelectorProps) {
  const { teams } = useTeams()
  const [teamDialogOpen, setTeamDialogOpen] = useState(false)
  const [managingTeam, setManagingTeam] = useState<Team | null>(null)

  const handleTeamSelect = (team: Team | null) => {
    onTeamChange(team)
  }

  const handleManageTeam = (team: Team | null) => {
    setManagingTeam(team)
    setTeamDialogOpen(true)
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            {currentTeam ? (
              <>
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-xs">
                    {currentTeam.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="max-w-[100px] truncate">
                  {currentTeam.name}
                </span>
              </>
            ) : (
              <>
                <Users className="h-4 w-4" />
                <span>Personal</span>
              </>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Switch Team</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={!currentTeam ? 'bg-accent' : ''}
            onClick={() => handleTeamSelect(null)}
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback>P</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span>Personal</span>
                <span className="text-xs text-muted-foreground">
                  Your personal projects
                </span>
              </div>
            </div>
          </DropdownMenuItem>

          {teams.length > 0 && <DropdownMenuSeparator />}

          {teams.map(team => (
            <DropdownMenuItem
              key={team.id}
              className={currentTeam?.id === team.id ? 'bg-accent' : ''}
              onClick={() => handleTeamSelect(team)}
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span>{team.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {team.members.length} members
                  </span>
                </div>
              </div>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleManageTeam(null)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Create New Team
          </DropdownMenuItem>
          {currentTeam && (
            <DropdownMenuItem onClick={() => handleManageTeam(currentTeam)}>
              <Users className="h-4 w-4 mr-2" />
              Manage Current Team
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <TeamManagementDialog
        currentTeam={managingTeam}
        onTeamChange={team => {
          if (team) {
            onTeamChange(team)
          }
          setManagingTeam(null)
        }}
      />
    </div>
  )
}
