'use client'
import React, {JSX, useState} from 'react'
import TextareaAutosize from "react-textarea-autosize"
import {v4 as uuidv4} from 'uuid'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton, InputGroupTextarea,
} from "@/components/ui/input-group"
import {
    Briefcase,
    ChevronRight, Laptop,
    Layers,
    LayoutTemplate, Loader2Icon, Newspaper,
    Palette,
    SendIcon,
    ShoppingCart,
    Smartphone
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {AnimatedGradientText} from "@/components/ui/animated-gradient-text";
import {cn} from "@/lib/utils";
import {useAuth} from "@/context/useAuth";
import {useRouter} from "next/navigation";
import axios from "axios";
import {toast} from "sonner";
import {GeminiKeyDialog} from "@/components/GeminiKeyDialog";
import {useGeminiApiKey} from "@/context/GeminiApiKeyProvider";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
type Suggestion = {
    name: string
    prompt: string
    icon: JSX.Element
}
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
    const [userInput, setUserInput] = useState<string>()
    const [device, setDevice] = useState<"mobile" | "desktop">('desktop')
    const {user} = useAuth()
    const [screenCount, setScreenCount] = useState<number>(3)
    const [showKeyDialog, setShowKeyDialog] = useState(false)

    const [loading, setLoading] = useState<boolean>()
    const router = useRouter()
    const [key, setKey] = useState("")

    const saveKey = () => {
        if (!key.startsWith("AIza")) {
            toast.error("Похоже, это не Gemini API Key")
            return
        }


        toast.success("API ключ сохранён")
        setShowKeyDialog(false)
    }
    const onCreateProject = async () => {


        if (!key) {
            setShowKeyDialog(true)
            return
        }

        try {
            setLoading(true);

            if (!user) {
                router.replace("/sign-up");
                return;
            }

            if (!userInput) {
                toast.warning("Введите промпт");
                return;
            }

            const projectId = uuidv4();

            await axios.post("/api/projects/create", {
                user,
                userInput,
                projectId,
                device,
                screenCount,
                apiKey: key,
            });

            router.replace(`/projects/${projectId}`);
        } catch (e: any) {
            if (e.response?.data?.error === "PROJECT_LIMIT_REACHED") {
                toast.error("Лимит 3 проекта. Перейдите на Premium 🚀");
                router.push("/pricing");
            } else {
                toast.error("Не удалось создать проект");
            }
        } finally {
            setLoading(false);
        }
    }
    return (
        <section className="flex justify-center mt-32 px-4">


            <div className=" w-full text-center">
                <div className='flex items-center justify-center '>
                    <div className="group relative max-w-sm flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
                  <span
                      className={cn(
                          "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[oklch(0.7109 0.1385 171.5194)]/50 via-[oklch(0.7109 0.1385 171.5194)]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
                      )}
                      style={{
                          WebkitMask:
                              "linear-gradient(oklch(0.7109 0.1385 171.5194) 0 0) content-box, linear-gradient(oklch(0.7109 0.1385 171.5194) 0 0)",
                          WebkitMaskComposite: "destination-out",
                          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                          maskComposite: "subtract",
                          WebkitClipPath: "padding-box",
                      }}
                  />
                        🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
                        <AnimatedGradientText className="text-sm font-medium">
                            Встречайте Uixify AI
                        </AnimatedGradientText>
                        <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                    </div>

                </div>
                 <div className='flex items-center justify-center'>
                    <h1 className="text-5xl  w-[80%] font-bold  leading-tight">
                        Проектируйте веб-сайты и мобильные приложения
                        <span className="text-primary"> высокого качества</span>
                    </h1>
                </div>


                <p className="mt-4 text-gray-400 text-base">
                    Опишите идею — мы превратим её в современный UI-дизайн
                    за считанные секунды.
                </p>


                <div style={{width: '750px'}} className="flex items-center  mx-auto mt-4 justify-center gap-6">
                    <InputGroup className=''>
                        <InputGroupTextarea value={userInput} style={{width: '750px'}}
                            data-slot="input-group-control"
                            className="flex field-sizing-content min-h-22 bg-white  resize-none rounded-md  px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
                            placeholder="Введите промпт ui который вы хотите создать..."
                        />

                        <InputGroupAddon align="block-end" className='bg-white ' >
                            <Select defaultValue='desktop' onValueChange={(val) => setDevice(val)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Выберите размер экрана" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Экран</SelectLabel>
                                        <SelectItem value="mobile">Телефон</SelectItem>
                                        <SelectItem value="desktop">ПК</SelectItem>

                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Select
                                value={String(screenCount)}
                                onValueChange={(v) => setScreenCount(Number(v))}
                            >
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Экраны" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Кол-во экранов</SelectLabel>
                                        <SelectItem value="1">1 экран</SelectItem>
                                        <SelectItem value="2">2 экрана</SelectItem>
                                        <SelectItem value="3">3 экрана</SelectItem>
                                        <SelectItem value="4">4 экрана</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>



                            <InputGroupButton disabled={loading} onClick={onCreateProject} className="ml-auto " size="sm" variant="default">

                                {loading ? <Loader2Icon className='animate-spin'/> : <SendIcon/>}
                            </InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>
                </div>
                <div className='flex items-center justify-center w-full gap-4 mt-4'>
                    {suggestions?.map((suggestion, index) => (
                        <div onClick={() => setUserInput(suggestion.prompt)}
                             key={index} className='p-2 flex bg-white z-10 items-center cursor-pointer flex-col border rounded-2xl'>
                            <h2 className='text-lg'>{suggestion?.icon}</h2>
                            <h2 className='text-center text-sm line-clamp'>{suggestion?.name}</h2>
                        </div>
                    ))}
                </div>
            </div>
            <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Gemini API Key</DialogTitle>
                        <DialogDescription className="space-y-2">
                            <p>
                                Введите ваш Gemini API ключ. Он используется для генерации UI и
                                хранится <b>только в вашем браузере</b>.
                            </p>

                            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                                <li>
                                    Перейдите на{" "}
                                    <a
                                        href="https://ai.google.dev/"
                                        target="_blank"
                                        className="underline"
                                    >
                                        https://ai.google.dev
                                    </a>
                                </li>
                                <li>Нажмите <b>Get API key</b></li>
                                <li>Войдите в Google аккаунт</li>
                                <li>Создайте новый API ключ</li>
                                <li>Скопируйте ключ, начинающийся с <b>AIza</b></li>
                            </ol>

                            <p className="text-xs text-muted-foreground">
                                Если генерация перестала работать — скорее всего, у ключа закончился лимит.
                                Просто создайте новый и замените его здесь.
                            </p>
                        </DialogDescription>
                    </DialogHeader>

                    <Input
                        placeholder="AIza..."
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                    />

                    <Button onClick={saveKey}>Сохранить</Button>
                </DialogContent>
            </Dialog>



        </section>
    )
}

export default Hero
