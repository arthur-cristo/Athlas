import { HandCoins, KeyRound, MessageCircleMore, PiggyBank, ShoppingBag, Wallet } from "lucide-react";

export const dashboardOptions = [
    { label: 'Transactions', link: '/transactions', Icon: HandCoins },
    { label: 'Stocks', link: '/stocks/', Icon: Wallet },
    { label: 'Store', link: '/store/', Icon: ShoppingBag },
    { label: 'Community', link: '/community/', Icon: MessageCircleMore },
]

export const transferOptions = [
    { title: 'Send Money', description: 'Transfer to another user', link: '/transactions/transfer', Icon: HandCoins },
    { title: 'My Keys', description: 'Your receivements keys', link: '/transactions/keys', Icon: KeyRound },
    { title: 'My Savings', description: 'Save your money', link: '/savings', Icon: PiggyBank }
]