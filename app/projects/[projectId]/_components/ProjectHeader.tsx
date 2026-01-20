'use client'
import React, {useState} from 'react'
import Image from "next/image";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useAuth} from "@/context/useAuth";
import {Button} from "@/components/ui/button";
import {Loader2Icon, SaveIcon, UserIcon} from "lucide-react";
import {useSettings} from "@/context/useSettings";
import {toast} from "sonner";
import axios from "@/lib/axios";
import Link from "next/link";


const ProjectHeader = () => {
    const {user} = useAuth()
    const {settings, setSettings} = useSettings()
    const [loading ,setLoading] = useState<boolean>(false)
    const onSave =  async () => {
        try {
            setLoading(true)
            const result = await axios.put('/api/projects/save', {
                projectId: settings?.projectId,
                theme: settings?.theme,
                projectName: settings?.projectName
            })
            setLoading(false)
            toast.success('Проект был сохранен!')
        } catch (error) {
            setLoading(false)
            toast.error('failed to save project')
        }
    }
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 shadow bg-white">
            <Link href="/">
                <Image src="/logo.png" alt="logo" width={100} height={40} className="mx-auto sm:mx-0"/>
            </Link>

            <ul className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm sm:text-lg mt-2 sm:mt-0 items-center">
                <li className="hover:text-primary transition cursor-pointer">Главная страница</li>
                <li className="hover:text-primary transition cursor-pointer">Услуги</li>
            </ul>

            <Button onClick={onSave} className="mt-2 sm:mt-0 flex items-center gap-2 text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2">
                {loading ? <Loader2Icon className="animate-spin w-4 h-4"/> : <SaveIcon className="w-4 h-4"/>}
                {loading ? 'Подождите...' : 'Сохранить'}
            </Button>
        </div>
    )
}
export default ProjectHeader
