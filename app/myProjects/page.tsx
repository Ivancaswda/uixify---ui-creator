'use client'
import React, { useEffect, useRef } from 'react'
import ProjectList from "@/components/ProjectList";
import {BackgroundBeamsWithCollision} from "@/components/ui/background-beams-with-collision";
import Header from "@/components/Header";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import { ArrowDownFromLine } from "lucide-react";

const MyProjectsPage = () => {
    const arrowRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        let direction = 1; // направление движения
        let position = 0; // текущее смещение
        const amplitude = 20; // пиксели вверх-вниз
        const speed = 0.5; // шаг за 16ms (~60fps)

        const interval = setInterval(() => {
            if (!arrowRef.current) return;

            position += direction * speed;
            if (position >= amplitude || position <= 0) direction *= -1;

            arrowRef.current.style.transform = `translateY(${position}px)`;
        }, 12); // ~60fps

        return () => clearInterval(interval);
    }, []);

    return (
        <div className='w-screen h-screen '>

            <BackgroundBeamsWithCollision>
                <h2 className="text-4xl mt-20 relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
                    Где же мои проекты?{" "}
                    <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                        <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-primary via-primary/50 to-primary/30 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                            <span className="">Так вот они.</span>
                        </div>
                        <div className="relative bg-clip-text text-transparent bg-no-repeat bg-primary py-4">
                            <span className="">Так вот они.</span>
                        </div>
                    </div>
                </h2>

                <div className='flex items-center justify-center w-full'>
                    <ArrowDownFromLine
                        ref={arrowRef}
                        className='mt-20'
                        style={{width: '100px', height: '100px', transition: 'transform 0.05s linear'}}
                    />
                </div>

                <div style={{marginTop: '220px'}} className='flex gap-4 mt-[120px] justify-center items-center'>
                    <Link href='/' >
                        <Button className='px-4 transition cursor-pointer hover:scale-105 py-6'>
                            Как создать проект?
                        </Button>
                    </Link>

                    <Button variant='outline' className='px-4 transition cursor-pointer hover:scale-105 py-6'>
                        Наша команда
                    </Button>
                </div>

            </BackgroundBeamsWithCollision>

            <div>
                <ProjectList/>
            </div>

        </div>
    )
}
export default MyProjectsPage
