'use client'
import React, {useEffect, useState} from 'react'
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Camera, Loader2Icon, PanelLeftClose, PanelLeftOpen, SettingsIcon, Share, SparkleIcon} from "lucide-react";
import {useSettings} from "@/context/useSettings";
import axios from "@/lib/axios";
import {useRefreshData} from "@/context/RefreshDataProvider";
import {toast} from "sonner";
export const THEMES = {
    AURORA_INK: {
        background: "#0b1020",
        foreground: "#f4f6ff",

        card: "#121a33",
        cardForeground: "#f4f6ff",

        popover: "#121a33",
        popoverForeground: "#f4f6ff",

        primary: "#7c5cff",
        primaryRgb: "124, 92, 255",
        primaryForeground: "#0b1020",

        secondary: "#1a2547",
        secondaryForeground: "#e8ebff",

        muted: "#141d3a",
        mutedForeground: "#a9b2d6",

        accent: "#2fe6c7",
        accentForeground: "#0b1020",

        destructive: "#ff4d6d",

        border: "#202c56",
        input: "#202c56",
        ring: "#7c5cff",

        radius: "0.9rem",

        chart: [
            "#7c5cff",
            "#2fe6c7",
            "#ffb84d",
            "#ff4d6d",
            "#6b6aff",
        ],
    },

    NEON_NIGHT: {
        background: "#05050a",
        foreground: "#f8f9ff",

        card: "#0f1224",
        cardForeground: "#f8f9ff",

        popover: "#0f1224",
        popoverForeground: "#f8f9ff",

        primary: "#00eaff",
        primaryRgb: "0, 234, 255",
        primaryForeground: "#05050a",

        secondary: "#1c1f3a",
        secondaryForeground: "#cfd3ff",

        muted: "#15182e",
        mutedForeground: "#8c92c7",

        accent: "#ff3d81",
        accentForeground: "#05050a",

        destructive: "#ff3b3b",

        border: "#262a55",
        input: "#262a55",
        ring: "#00eaff",

        radius: "0.9rem",

        chart: [
            "#00eaff",
            "#ff3d81",
            "#7c5cff",
            "#2fe6c7",
            "#ffd166",
        ],
    },

    SOLAR_DAWN: {
        background: "#fff8f1",
        foreground: "#1f2937",

        card: "#ffffff",
        cardForeground: "#1f2937",

        popover: "#ffffff",
        popoverForeground: "#1f2937",

        primary: "#ff8a00",
        primaryRgb: "255, 138, 0",
        primaryForeground: "#ffffff",

        secondary: "#fde68a",
        secondaryForeground: "#92400e",

        muted: "#fef3c7",
        mutedForeground: "#92400e",

        accent: "#fb7185",
        accentForeground: "#ffffff",

        destructive: "#dc2626",

        border: "#fde68a",
        input: "#fde68a",
        ring: "#ff8a00",

        radius: "0.9rem",

        chart: [
            "#ff8a00",
            "#fb7185",
            "#facc15",
            "#4ade80",
            "#60a5fa",
        ],
    },
} as const
const SettingsSection = ({project, setApiKeyDialogOpen, screenDescription, takeScreenshot, isSidebarOpen}:any) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [selectedTheme, setSelectedTheme] = useState("AURORA_INK")
    const [projectName, setProjectName] = useState()
    const [userNewScreenInput, setUserNewScreenInput] = useState()
    const {refreshData, setRefreshData} = useRefreshData()
    const {settings, setSettings} = useSettings()
    useEffect(() => {
        project && setProjectName(project?.projectName)
        setSelectedTheme(project?.theme)

    }, [project]);

    const onThemeSelect = (theme: string) => {
        setSelectedTheme(theme)
        setSettings((prev:any) => ({
            ...prev,
            theme: theme
        }))
    }

    const generateNewScreen = async () => {
        try {
            setLoading(true)

            const result = await axios.post('/api/generate-config', {
                projectName: project?.projectName,
                projectId: project?.projectId,
                deviceType: project?.deviceType,
                theme: project?.theme,
                oldScreenDescription: screenDescription,
                userInput: userNewScreenInput,
                apiKey: project?.apiKey
            })

            if (result.data.screens) {
                setRefreshData({ method: 'screenConfig', date: new Date() })
            }
        } catch (error) {
            if (error?.response?.data?.error === "AI_REGION_BLOCKED") {
                toast.error(
                    "Gemini API недоступен в вашем регионе. Используйте VPN или другой AI-провайдер."
                );
                return;
            }
            if (error?.response?.data?.error === "API_KEY_INVALID") {
                toast.error('Ваш gemini-AI ключ достиг лимита, измените его и подождите 60 секунд!')
                setApiKeyDialogOpen(true)
                return
            }
            toast.error('Не удалось сгенерировать новый скрин')
        } finally {
            setLoading(false)
        }
    }
    const downloadScreenshot = (screen: {screenId: string, image: string}) => {
        const link = document.createElement("a");
        link.href = screen.image; // Base64 data URL
        link.download = `${screen.screenId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const handleShare = async () => {
        if (!project?.projectId) return

        const url = `https://uixify-ai.vercel.app/projects/${project.projectId}`

        try {
            await navigator.clipboard.writeText(url)
            toast.success("Ссылка скопирована в буфер обмена 🔗")
        } catch (err) {
            // fallback для старых браузеров
            try {
                const textarea = document.createElement("textarea")
                textarea.value = url
                textarea.style.position = "fixed"
                textarea.style.opacity = "0"
                document.body.appendChild(textarea)
                textarea.select()
                document.execCommand("copy")
                document.body.removeChild(textarea)

                toast.success("Ссылка скопирована в буфер обмена 🔗")
            } catch {
                toast.error("Не удалось скопировать ссылку")
            }
        }
    }
    return (
        <div  className={`
            
            transition-all duration-300 ease-in-out
            ${isSidebarOpen ? "w-[520px] opacity-100" : "w-0 opacity-0"}
            overflow-hidden p-4 h-[90vh]
        `} >
            <div className=' flex items-center gap-6'>
                <h1 className='font-medium text-lg flex items-center gap-4'>
                    <SettingsIcon/>
                    Настройки
                </h1>


            </div>
            <div className='mt-6'>
                <label className='text-sm mb-1'>Название проекта</label>
                <Input value={projectName} onChange={(event) =>  {
                    setProjectName(event.target.value);
                    setSettings((prev:any) => ({
                        ...prev,
                        projectName: projectName
                    }))
                }} placeholder='Введите название проекта'/>
            </div>
            <div className='mt-5'>
                <label className='text-sm mb-1'>Сгенерировать новые экраны</label>
                <Textarea value={userNewScreenInput} onChange={(event) =>  setUserNewScreenInput(event.target.value)} placeholder='Введите промпт чтобы сгенерировать экран при помощи ИИ'/>
                <Button onClick={generateNewScreen} size='sm' disabled={loading} className='mt-2 '>
                    {loading ? <Loader2Icon className='animate-spin'/> :  <SparkleIcon/>}
                    {loading ? 'Генерация...' : 'Сгенерировать UI'}

                </Button>
            </div>
            <div className='mt-5'>
                <h2 className='text-sm mb-1'>Темы</h2>
                <div className='h-[200px] overflow-auto'>
                    <div>
                        {Object.keys(THEMES).map((theme) => (
                            <div
                                key={theme}
                                className={`p-3 border rounded-xl mb-2 cursor-pointer transition
      ${theme === selectedTheme && "border-primary bg-primary/20"}
    `}
                                onClick={() => onThemeSelect(theme)}
                            >
                                <h2 className="text-sm font-medium">{theme}</h2>

                                <div className="flex gap-2 mt-2">
                                    <div className="h-4 w-4 rounded-full" style={{ background: THEMES[theme].primary }} />
                                    <div className="h-4 w-4 rounded-full" style={{ background: THEMES[theme].secondary }} />
                                    <div className="h-4 w-4 rounded-full" style={{ background: THEMES[theme].accent }} />
                                    <div className="h-4 w-4 rounded-full" style={{ background: THEMES[theme].background }} />
                                    <div
                                        className="h-4 w-4 rounded-full"
                                        style={{
                                            background: `linear-gradient(135deg,
            ${THEMES[theme].background},
            ${THEMES[theme].primary},
            ${THEMES[theme].accent}
          )`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className='mt-5'>
                <h2 className='text-sm mb-1'>Дополнительно</h2>
                <div className='flex gap-3'>
                    <Button onClick={takeScreenshot} variant='outline' size='sm' className='mt-2 '>
                        <Camera/>
                        Сделать скриншот
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={handleShare}
                    >
                        <Share />
                        Поделиться
                    </Button>

                </div>
                {project?.screenShot && project?.screenShot.length > 0 && (
                    <div className="bg-white   p-4 rounded shadow space-y-2">
                        <h3 className="font-medium">Скачать скриншоты</h3>
                        <div className='flex gap-4 items-center flex-wrap'>
                            {project?.screenShot.map((s) => (
                                <Button
                                    key={s.screenId}
                                    className="px-3 py-1 "
                                    onClick={() => downloadScreenshot(s)}
                                >
                                    {s.screenId}
                                </Button>
                            ))}
                        </div>

                    </div>
                )}
            </div>
        </div>
    )
}
export default SettingsSection
