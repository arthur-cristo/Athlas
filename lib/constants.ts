import { HandCoins, KeyRound, MessageCircleMore, ShoppingBag, Wallet } from "lucide-react";

export const dashboardOptions = [
    { label: 'Transactions', link: '/transactions', Icon: HandCoins },/* 
    { label: 'Stocks', link: '/stocks/', Icon: Wallet, disabled: true },
    { label: 'Store', link: '/store/', Icon: ShoppingBag, disabled: true }, */
    { label: 'Community', link: '/community/', Icon: MessageCircleMore },
]

export const transferOptions = [
    { title: 'Send Money', description: 'Transfer to another user', link: '/transactions/transfer', Icon: HandCoins },
    { title: 'My Keys', description: 'Your receivements keys', link: '/transactions/keys', Icon: KeyRound },
]