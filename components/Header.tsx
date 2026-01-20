'use client'
import React from 'react'
import Image from "next/image";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useAuth} from "@/context/useAuth";
import {Button} from "@/components/ui/button";
import {LoaderOne} from "@/components/ui/loader";
import { UserIcon, } from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {useRouter} from "next/navigation";

const Header = () => {
    const {user, logout, loading} = useAuth()
    const router = useRouter()

    if (loading) return <div className="flex items-center justify-center w-full h-20"><LoaderOne/></div>

    return (
        <header className="flex flex-col sm:flex-row items-center justify-between p-4 gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
                <Image src="/logo.png" alt="logo" width={120} height={120}/>
            </div>

            <nav className="flex gap-4 text-sm sm:text-base">
                <Button variant="link" onClick={() => router.push("/")} className="p-0">Главная</Button>
                <Button variant="link" onClick={() => router.push("/pricing")} className="p-0">Услуги</Button>
            </nav>

            <div className="flex items-center gap-2">
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="cursor-pointer w-8 h-8 sm:w-10 sm:h-10">
                                <AvatarImage src={user.avatarUrl}/>
                                <AvatarFallback>{user.userName[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl shadow-md">
                            <div className="border-b mb-2 p-2">
                                <p className="text-sm font-medium">{user.userName}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                            <Button variant="ghost" onClick={() => router.push("/myProjects")}>Мои проекты</Button>
                            <Button variant="secondary" onClick={() => router.push("/pricing")}>Premium</Button>
                            <Button variant="destructive" size="sm" className="w-full mt-2" onClick={logout}>Выйти</Button>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button onClick={() => router.replace('/sign-up')}><UserIcon/> Войти</Button>
                )}
            </div>
        </header>
    )
}

export default Header
