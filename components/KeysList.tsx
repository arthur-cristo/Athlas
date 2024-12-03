'use client'

import { useUser } from '@/app/UserContext';
import { Input } from './ui/input';
import { Copy, MailIcon, Phone, Shuffle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProfileType } from '@/types/Profile';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

const CopyButton = ({ type, value }: { type: string, value: string }) => {

    const { toast } = useToast();
    const handleCopy = (type: string, value: string) => {
        navigator.clipboard.writeText(value);
        toast({
            title: type + " Key Copied",
            description: value,
            className: 'border-none ring-1 ring-green-500',
        });
    }
    return (
        <Copy className="h-6 w-6 cursor-pointer mx-2 "
            onClick={() => handleCopy(type, value)} />
    )
}

const Keys = () => {

    const user = useUser();
    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [randomKey, setRandomKey] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!user) return;

        const fetchProfile = async () => {
            try {
                const response = await fetch(`/api/users/search?id=${user.id}`);
                const data = await response.json();
                setProfile(data);
                setRandomKey(data.random_key);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        };

        fetchProfile();
    }, [user]);

    const handleGenerateRandomKey = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/users/${user?.id}/random_key`, { method: 'PATCH' });
            const data = await response.json();
            setRandomKey(data.random_key);
        } catch (error) {
            console.error("Failed to generate random key:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='flex flex-col gap-4 mx-4 w-full sm:w-[640px]'>
            <div className="bg-input flex items-center border-none placeholder:text-muted-foreground rounded-md">
                <MailIcon className="mx-2 h-6 w-6 text-muted-foreground" />
                <Input placeholder='Email' className="border-none placeholder:text-muted-foreground focus-visible:ring-0 cursor-default" readOnly={true} value={profile?.email} />
                {profile && (<CopyButton type='Email' value={profile.email} />)}
            </div>
            <div className="bg-input flex items-center border-none  placeholder:text-muted-foreground rounded-md">
                <Phone className="mx-2 h-6 w-6 text-muted-foreground" />
                <Input placeholder='Phone Number' className="border-none placeholder:text-muted-foreground focus-visible:ring-0 cursor-default" readOnly={true} value={profile?.phone_number} />
                {profile && (<CopyButton type='Phone Number' value={profile.phone_number} />)}
            </div>
            <div className="bg-input flex items-center border-none  placeholder:text-muted-foreground rounded-md">
                <Shuffle className="mx-2 h-6 w-6 text-muted-foreground" />
                <Input placeholder='Random Key' className="border-none placeholder:text-muted-foreground focus-visible:ring-0 cursor-default" readOnly={true} value={randomKey || ''} />
                {profile && randomKey && (<CopyButton type='Random Key' value={randomKey} />)}
            </div>
            <Button onClick={handleGenerateRandomKey} disabled={loading}>Generate New Random Key</Button>
        </div>
    )
}

export default Keys