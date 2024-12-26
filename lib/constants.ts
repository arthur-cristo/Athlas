import { GraduationCap, HandCoins, KeyRound, MessageCircleMore } from "lucide-react";

export const dashboardOptions = [
    { label: 'Transações', link: '/transactions', Icon: HandCoins },
    { label: 'Aprender', link: '/learn/', Icon: GraduationCap },
    { label: 'Comunidade', link: '/community/', Icon: MessageCircleMore },
]

export const transferOptions = [
    { title: 'Transferir', description: 'Envie Athlascoins', link: '/transactions/transfer', Icon: HandCoins },
    { title: 'Minhas Chaves', description: 'Veja suas chaves', link: '/transactions/keys', Icon: KeyRound },
]