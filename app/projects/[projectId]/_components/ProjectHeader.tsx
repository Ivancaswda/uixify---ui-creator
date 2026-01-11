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
        <div className="flex items-center justify-between p-4 shadow">
            <Link href='/'>
                <Image src='/logo.png' alt='lgoo' width={140} height={140}/>
            </Link>

            <ul className='flex gap-4 text-lg items-center '>
                <li className='hover:text-primary transition text-sm cursor-pointer'>Главная страница</li>
                <li className='hover:text-primary transition text-sm cursor-pointer'>Услуги</li>
            </ul>
          <Button onClick={onSave}>
              {loading ? <Loader2Icon className='animate-spin'/> : <SaveIcon/> }
              {loading ? 'Подождите...' :"Сохранить"}

            </Button>
        </div>
    )
}
export default ProjectHeader
