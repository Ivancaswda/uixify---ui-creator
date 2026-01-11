import React from "react";
import {
    DraggableCardBody,
    DraggableCardContainer,
} from "@/components/ui/draggable-card";

export function DraggableCardDemo() {
    const items = [
        {
            title: "Лендинг для стартапа",
            image: "/ui-landing.jpg",
            className: "absolute top-10 left-[15%] rotate-[-5deg]",
            description: "Современный лендинг с hero-блоком, CTA и анимацией кнопок"
        },
        {
            title: "Интернет-магазин",
            image: "/ui-eccomerce.jpg",
            className: "absolute top-32 left-[25%] rotate-[3deg]",
            description: "Каталог товаров, карточки продукта и корзина с checkout"
        },
        {
            title: "Дашборд аналитики",
            image: "/ui-dashboard.jpg",
            className: "absolute top-5 left-[40%] rotate-[7deg]",
            description: "Графики, таблицы, фильтры и статистика в реальном времени"
        },
        {
            title: "Портфолио дизайнера",
            image: "/ui-portfolio.png",
            className: "absolute top-24 left-[50%] rotate-[-6deg]",
            description: "Современный UI для портфолио с галереей и кейсами"
        },
        {
            title: "Корпоративный сайт",
            image: "/ui-corporate.jpg",
            className: "absolute top-20 right-[30%] rotate-[2deg]",
            description: "Секции о компании, услугах, команде и контактах"
        },
        {
            title: "Мобильное приложение",
            image: "/ui-mobileapp.jpg",
            className: "absolute top-24 left-[45%] rotate-[-8deg]",
            description: "UI для iOS и Android с адаптивным дизайном"
        },
        {
            title: "Новостной портал",
            image: "/ui-news.png",
            className: "absolute top-8 left-[30%] rotate-[4deg]",
            description: "Лента новостей, категории и карточки статей"
        },
    ];
    return (
        <DraggableCardContainer className="relative flex min-h-screen  items-center justify-center overflow-clip">
            <p className="absolute top-1/2 mx-auto max-w-sm -translate-y-3/4 text-center text-2xl  text-neutral-400 font-semibold md:text-4xl dark:text-neutral-800">
              Наслаждайтесь нашими красивыми ui-работами сделанными при помощи AI
            </p>
            {items.map((item) => (
                <DraggableCardBody  className={item.className}>
                    <img style={{width:'400px'}}
                        src={item.image}
                        alt={item.title}
                        className="pointer-events-none relative z-10 object-cover"
                    />
                    <h3 className="mt-4 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300">
                        {item.title}
                    </h3>
                </DraggableCardBody>
            ))}
        </DraggableCardContainer>
    );
}
