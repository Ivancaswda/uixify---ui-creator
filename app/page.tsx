"use client"
import React from 'react'
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProjectList from "@/components/ProjectList";
import {useAuth} from "@/context/useAuth";
import {SparklesIcon} from "lucide-react";
import {DraggableCardDemo} from "@/components/DraggableCard";
import Image from "next/image";
import {
    FaDiscord, FaGithub,
    FaGoogle,
    FaSlack,
    FaStripe,
    FaTelegram,
    FaTwitter,
    FaVk,
    FaWhatsapp,
    FaYandex
} from "react-icons/fa";
import {InfiniteMovingCards} from "@/components/ui/infinite-moving-cards";
const logoIcons = [
    { name: "ВКонтакте", icon: FaVk},
    { name: "Google", icon: FaGoogle },
    { name: "Яндекс", icon: FaYandex },
    { name: "Stripe", icon: FaStripe },
    { name: "Discord", icon: FaDiscord },
    { name: "Slack", icon: FaSlack },
    { name: "WhatsApp", icon: FaWhatsapp },
    { name: "Telegram", icon: FaTelegram },
    { name: "ВКонтакте", icon: FaVk},
    { name: "Google", icon: FaGoogle },
    { name: "Яндекс", icon: FaYandex },
    { name: "Stripe", icon: FaStripe },
    { name: "Discord", icon: FaDiscord },
    { name: "Slack", icon: FaSlack },
    { name: "WhatsApp", icon: FaWhatsapp },
    { name: "Telegram", icon: FaTelegram }
];
const socialLinks = [
    { icon: FaTwitter, url: "https://twitter.com" },
    { icon: FaDiscord, url: "https://discord.com" },
    { icon: FaGithub, url: "https://github.com" },
    { icon: FaTelegram, url: "https://t.me" },
]
const testimonials = [
    {
        quote:
            "UIxify полностью изменил мой рабочий процесс! Я могу создавать прототипы интерфейсов за считанные минуты, а результат выглядит профессионально.",
        name: "Алексей Иванов",
        title: "UX/UI Дизайнер",
    },
    {
        quote:
            "С UIxify я наконец-то могу быстро протестировать идеи для приложения, не тратя дни на дизайн. Инструмент невероятно удобный и интуитивный.",
        name: "Мария Петрова",
        title: "Продуктовый дизайнер",
    },
    {
        quote:
            "Мне нравится, что UIxify генерирует современные интерфейсы, и я сразу вижу, как будет выглядеть конечный продукт. Это экономит массу времени.",
        name: "Дмитрий Смирнов",
        title: "Разработчик Frontend",
    },
    {
        quote:
            "UIxify — просто находка для стартапов! Можно быстро создавать лендинги и мобильные UI без лишних затрат. Настоящий AI-дизайнер под рукой.",
        name: "Екатерина Кузнецова",
        title: "Основатель стартапа",
    },
    {
        quote:
            "Каждый раз удивляюсь, насколько точными и красивыми получаются дизайны. UIxify экономит мое время и вдохновляет на новые проекты.",
        name: "Игорь Лебедев",
        title: "Дизайнер продукта",
    },
];
const HomePage = () => {
    const {user} = useAuth()
    console.log(user)
    return (
        <div>
            <div className="relative min-h-screen w-full overflow-hidden bg-[var(--background)]">

                {/* Абстрактные градиентные фигуры */}
                <div className="absolute h-[500px] w-[500px] bg-purple-500/30 blur-[140px] rounded-full -top-40 -left-40"/>
                <div className="absolute h-[400px] w-[400px] bg-blue-500/30 blur-[140px] rounded-full top-20 right-[-200px]"/>
                <div className="absolute h-[500px] w-[500px] bg-pink-500/30 blur-[140px] rounded-full bottom-[-200px] left-1/3"/>
                <div className="absolute h-[400px] w-[400px] bg-indigo-500/30 blur-[140px] rounded-full top-[300px] left-1/2"/>

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <Header/>
                    <Hero/>
                    <ProjectList/>
                    {user?.isPremium === 1 && (
                        <div className="relative my-12 w-full max-w-7xl mx-auto rounded-3xl overflow-hidden p-6">
                            {/* Анимированный фон */}
                            <div
                                className="absolute inset-0 animate-gradient-xy bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 opacity-70 blur-3xl"
                                style={{
                                    zIndex: 0,
                                    backgroundSize: "300% 300%",
                                }}
                            ></div>

                            {/* Контент баннера */}
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                                        ✨ Premium активен!
                                    </h2>
                                    <p className="mt-2 text-lg opacity-90">
                                        Наслаждайтесь безлимитными проектами и генерациями UI с помощью AI
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <button className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-xl font-semibold hover:bg-white/30 transition">
                                        Создать новый проект
                                    </button>
                                    <button className="px-6 py-3 border border-white/30 rounded-xl font-semibold hover:bg-white/10 transition">
                                        Подробнее о Premium
                                    </button>
                                </div>
                            </div>

                            <style jsx>{`
      @keyframes gradientXY {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
      .animate-gradient-xy {
        animation: gradientXY 8s ease infinite;
      }
    `}</style>
                        </div>
                    )}

                    <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
                        <InfiniteMovingCards items={testimonials} direction="left" speed="slow" />
                    </div>
                    <DraggableCardDemo/>



                </div>


            </div>

            <div className="overflow-hidden py-8">
                <div className="flex animate-marquee whitespace-nowrap gap-12">
                    {logoIcons.concat(logoIcons).map((logo, index) => {
                        const Icon = logo.icon;
                        return (
                            <div
                                key={index}
                                className="flex items-center justify-center w-16 h-16 text-gray-300 hover:text-primary transition text-4xl"
                            >
                                <Icon />
                            </div>
                        );
                    })}
                </div>

                <style jsx>{`
                    .animate-marquee {
                        display: inline-flex;
                        animation: marquee 60s linear infinite;
                    }
                    @keyframes marquee {
                        0% {
                            transform: translateX(0%);
                        }
                        100% {
                            transform: translateX(-50%);
                        }
                    }
                `}</style>
            </div>
            <footer className="bg-red-900 mt-auto">
                <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center px-4 mb-4 cursor-pointer gap-2 text-xl justify-start font-bold text-primary  ">

                            <Image src={"/logo.png"} alt={'logo'} width={120} height={120} />
                        </div>
                        <p className="text-gray-400">Автоматизация бизнеса и управление воркфлоу в одном месте.</p>
                        <div className="flex gap-3 mt-2">
                            {socialLinks.map((s, idx) => {
                                const Icon = s.icon
                                return (
                                    <a key={idx} href={s.url} target="_blank" rel="noreferrer" className="hover:text-primary transition">
                                        <Icon className="size-5" />
                                    </a>
                                )
                            })}
                        </div>
                    </div>


                    <div className="flex flex-col gap-2 text-gray-400">
                        <h3 className="font-semibold text-white mb-2">Полезные ссылки</h3>
                        <a href="#" className="hover:text-primary transition">Документация</a>
                        <a href="#" className="hover:text-primary transition">Тарифы</a>
                        <a href="#" className="hover:text-primary transition">Поддержка</a>
                        <a href="#" className="hover:text-primary transition">Блог</a>
                    </div>


                    <div className="flex flex-col gap-2 text-gray-400">
                        <h3 className="font-semibold text-white mb-2">Контакты</h3>
                        <p>Email: <a href="mailto:katkovskiji@gmail.com" className="hover:text-primary transition">katkovskiji@gmail.com</a></p>
                        <p>Телефон: <a href="tel:+1234567890" className="hover:text-primary transition">+79521637168</a></p>
                        <p>Адрес: Томск, Россия</p>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-6 py-4 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} UIxify. Все права защищены.
                </div>
            </footer>
        </div>

    )
}

export default HomePage
