import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { IconDotsVertical } from "@tabler/icons-react"
import { useSession } from "next-auth/react"

export default function NavUserDetails() {
  const { data: session } = useSession()

  return (
    <DropdownMenuTrigger asChild>
      <SidebarMenuButton
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <Avatar className="h-8 w-8 rounded-lg grayscale">
          <AvatarImage src={session?.user?.image ?? undefined} alt={session?.user?.name ?? "User"} />
          <AvatarFallback className="rounded-lg">
            {(session?.user?.name ?? "CN").substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{session?.user?.name}</span>
          <span className="text-muted-foreground truncate text-xs">
            {session?.user?.email}
          </span>
        </div>
        <IconDotsVertical className="ml-auto size-4" />
      </SidebarMenuButton>
    </DropdownMenuTrigger>
  )
}
