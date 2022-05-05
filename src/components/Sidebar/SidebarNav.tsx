import { Stack } from "@chakra-ui/react";
import { RiBarChart2Line, RiContactsLine, RiDashboardLine, RiFileList3Line, RiFolderUserLine, RiGift2Line, RiGitMergeLine, RiInputMethodLine, RiMailSendLine, RiMailUnreadLine, RiMedalLine } from "react-icons/ri"
;
import useSWR from "swr";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";



export function SidebarNav() {
  const fetcher = (url) => fetch(url).then((r) => r.json());

const { data: user, mutate: mutateUser } = useSWR('/api/user', fetcher);
  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="GERAL">
        <NavLink icon={RiDashboardLine} href="/dashboard">Dashboard</NavLink>
        {user?.role == 'pmo' && <NavLink icon={RiContactsLine} href="/users">Usuários</NavLink>}
        {user?.role == 'pmo' && <NavLink icon={RiGift2Line} href="/rewards">Recompensas</NavLink>}
        {user?.role == 'pmo' && <NavLink icon={RiMedalLine} href="/badges">Conquistas</NavLink>}
        {user?.role == 'pmo' && <NavLink icon={RiFileList3Line} href="/tasks">Entregas</NavLink>}
        {user?.role == 'pmo' && <NavLink icon={RiMailUnreadLine} href="/tasks">Solicitações</NavLink>}
      </NavSection>
      <NavSection title="MEU ESPAÇO">
        <NavLink icon={RiBarChart2Line} href="/performance">Desempenho</NavLink>
        <NavLink icon={RiFolderUserLine} href="/profile">Meu perfil</NavLink>
        <NavLink icon={RiMailSendLine} href="/solicitations">Minhas Solicitações</NavLink>
      </NavSection>
    </Stack>
  );
}