'use client'
import React, {JSX, useState} from 'react'
import TextareaAutosize from "react-textarea-autosize"
import {v4 as uuidv4} from 'uuid'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupTextarea
} from "@/components/ui/input-group"
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from "@/components/ui/select";
import {AnimatedGradientText} from "@/components/ui/animated-gradient-text";
import {cn} from "@/lib/utils";
import {useAuth} from "@/context/useAuth";
import {useRouter} from "next/navigation";
import axios from "axios";
import {toast} from "sonner";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Briefcase, Layers, LayoutTemplate, Loader2Icon, Newspaper, Palette, SendIcon, ShoppingCart} from "lucide-react";

type Suggestion = { name: string; prompt: string; icon: JSX.Element }

export const suggestions: Suggestion[] = [
    {
        name: "Лендинг",
        icon: <LayoutTemplate className="w-5 h-5" />,
        prompt: "Создай современный лендинг для стартапа с hero-блоком, CTA и минималистичным дизайном",
    },
    {
        name: "Интернет-магазин",
        icon: <ShoppingCart className="w-5 h-5" />,
        prompt: "Спроектируй UI интернет-магазина с каталогом, карточкой товара и корзиной",
    },
    {
        name: "Корпоративный сайт",
        icon: <Briefcase className="w-5 h-5" />,
        prompt: "Создай корпоративный сайт для IT-компании с разделами О нас, Услуги и Контакты",
    },
    {
        name: "Дашборд",
        icon: <Layers className="w-5 h-5" />,
        prompt: "Разработай аналитический dashboard с графиками, таблицами и фильтрами",
    },

    {
        name: "Портфолио",
        icon: <Palette className="w-5 h-5" />,
        prompt: "Сделай персональное портфолио дизайнера в современном стиле",
    },
    {
        name: "Новостной сайт",
        icon: <Newspaper className="w-5 h-5" />,
        prompt: "Спроектируй новостной сайт с лентой, категориями и карточками статей",
    },

]

const Hero = () => {
    const [userInput, setUserInput] = useState<string>("")
    const [device, setDevice] = useState<"mobile" | "desktop">('desktop')
    const {user} = useAuth()
    const [screenCount, setScreenCount] = useState<number>(3)
    const [showKeyDialog, setShowKeyDialog] = useState(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [key, setKey] = useState("")
    const router = useRouter()

    const saveKey = () => {
        if (!key.startsWith("AIza")) {
            toast.error("Похоже, это не Gemini API Key")
            return
        }
        toast.success("API ключ сохранён")
        setShowKeyDialog(false)
    }

    const onCreateProject = async () => {
        if (!key) { setShowKeyDialog(true); return }
        if (!user) { router.replace("/sign-up"); return }
        if (!userInput) { toast.warning("Введите промпт"); return }

        try {
            setLoading(true)
            const projectId = uuidv4()
            await axios.post("/api/projects/create", { user, userInput, projectId, device, screenCount, apiKey: key })
            router.replace(`/projects/${projectId}`)
        } catch (e: any) {
            if (e.response?.data?.error === "PROJECT_LIMIT_REACHED") {
                toast.error("Лимит 3 проекта. Перейдите на Premium 🚀")
                router.push("/pricing")
            } else toast.error("Не удалось создать проект")
        } finally { setLoading(false) }
    }

    return (
        <section className="flex flex-col items-center px-4 py-8 space-y-6 sm:py-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center leading-snug">
                Проектируйте веб-сайты и мобильные приложения <span className="text-primary">высокого качества</span>
            </h1>
            <p className="text-center text-gray-400 text-sm sm:text-base">
                Опишите идею — мы превратим её в современный UI-дизайн за считанные секунды.
            </p>

            {/* Input Group */}
            <div className="w-full max-w-md flex flex-col gap-2">
                <InputGroup className="flex flex-col gap-2">
                    <InputGroupTextarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Введите промпт ui который вы хотите создать..."
                        className="min-h-[80px] resize-none px-3 py-2 rounded-md border"
                    />
                    <div className="flex flex-col sm:flex-row gap-2 items-center">
                        <Select value={device} onValueChange={(val) => setDevice(val)}>
                            <SelectTrigger className="w-full sm:w-[120px]">
                                <SelectValue placeholder="Экран"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Экран</SelectLabel>
                                    <SelectItem value="mobile">Телефон</SelectItem>
                                    <SelectItem value="desktop">ПК</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Select value={String(screenCount)} onValueChange={(v) => setScreenCount(Number(v))}>
                            <SelectTrigger className="w-full sm:w-[120px]">
                                <SelectValue placeholder="Экраны"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Кол-во экранов</SelectLabel>
                                    {[1,2,3,4].map(i => <SelectItem value={String(i)} key={i}>{i} экран</SelectItem>)}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <InputGroupButton
                            disabled={loading}
                            onClick={onCreateProject}
                            className="w-full sm:w-auto"
                        >
                            {loading ? <Loader2Icon className="animate-spin"/> : <SendIcon/>}
                        </InputGroupButton>
                    </div>
                </InputGroup>
            </div>

            {/* Suggestions */}
            <div className="flex flex-wrap justify-center gap-3 mt-4 w-full max-w-md">
                {suggestions.map((s, idx) => (
                    <button
                        key={idx}
                        onClick={() => setUserInput(s.prompt)}
                        className="flex flex-col items-center justify-center p-2 bg-white rounded-xl border shadow hover:scale-105 transition"
                    >
                        <span>{s.icon}</span>
                        <span className="text-xs text-center">{s.name}</span>
                    </button>
                ))}
            </div>

            {/* Gemini API Key Dialog */}
            <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Gemini API Key</DialogTitle>
                        <DialogDescription>
                            <p>Введите ваш Gemini API ключ. Он хранится только в вашем браузере.</p>
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                        placeholder="AIza..."
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                    />
                    <Button onClick={saveKey} className="mt-2 w-full">Сохранить</Button>
                </DialogContent>
            </Dialog>
        </section>
    )
}

export default Hero
