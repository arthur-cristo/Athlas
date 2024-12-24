import { GraduationCap, HandCoins, KeyRound, MessageCircleMore, PiggyBank, ShoppingBag, Wallet } from "lucide-react";

export const dashboardOptions = [
    { label: 'Transações', link: '/transactions', Icon: HandCoins },
    /* { label: 'Stocks', link: '/stocks/', Icon: Wallet, disabled: true },
    { label: 'Store', link: '/store/', Icon: ShoppingBag, disabled: true }, */
    { label: 'Porquinho', link: '/piggy-bank/', Icon: PiggyBank, disabled: true },
    { label: 'Aprender', link: '/learn/', Icon: GraduationCap },
    { label: 'Comunidade', link: '/community/', Icon: MessageCircleMore },
]

export const transferOptions = [
    { title: 'Transferir', description: 'Envie Athlascoins', link: '/transactions/transfer', Icon: HandCoins },
    { title: 'Minhas Chaves', description: 'Veja suas chaves', link: '/transactions/keys', Icon: KeyRound },
]