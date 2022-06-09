import { Stack } from "@chakra-ui/react";
import { RiBarChart2Line, RiBookMarkFill, RiContactsLine, RiDashboardLine, RiFileList3Line, RiFolderUserLine, RiGift2Line, RiGitMergeLine, RiInputMethodLine, RiMailSendLine, RiMailUnreadLine, RiMedalLine } from "react-icons/ri"
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
        <NavLink icon={RiBookMarkFill} href="/guide">Guia do jogo</NavLink>
        {user?.role == 'PMO' && <NavLink icon={RiContactsLine} href="/users">Usuários</NavLink>}
        {user?.role == 'PMO' && <NavLink icon={RiGift2Line} href="/rewards">Recompensas</NavLink>}
        {user?.role == 'PMO' && <NavLink icon={RiMedalLine} href="/badges">Conquistas</NavLink>}
        {user?.role == 'PMO' && <NavLink icon={RiFileList3Line} href="/tasks">Entregas</NavLink>}
        {user?.role == 'PMO' && <NavLink icon={RiMailUnreadLine} href="/solicitations">Solicitações</NavLink>}
      </NavSection>
      <NavSection title="MEU ESPAÇO">
        <NavLink icon={RiBarChart2Line} href="/myperformance">Meu Desempenho</NavLink>
        {/* <NavLink icon={RiBarChart2Line} href="/performance">Desempenho</NavLink> */}
        <NavLink icon={RiFolderUserLine} href="/profile">Meu perfil</NavLink>
        <NavLink icon={RiMailSendLine} href="/my-solicitations">Minhas Solicitações</NavLink>
      </NavSection>
    </Stack>
  );
}