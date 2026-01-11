import React, {useEffect, useState} from 'react'
import axios from "axios";
import {toast} from "sonner";
import ProjectCard from "@/components/ProjectCard";
import {Skeleton} from "@/components/ui/skeleton";
import {Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty";
import {ArrowUpRightIcon, FolderIcon, SparklesIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useAuth} from "@/context/useAuth";

const ProjectList = () => {

    const [projects, setProjects] = useState<any>([])
    const [loading, setLoading] = useState()
    const {user} = useAuth()
    useEffect(() => {
        getProjectList()
    }, []);
    const getProjectList = async () => {
        try {
            const result = await axios.get('/api/projects/getAll');
            setProjects(result.data.projects)

        }  catch (error) {
            toast.error('Не удалось получить проекты')
            console.log(error)
        }
    }

    return (
        <div className='px-10 md:px-24 mt-20 lg:px-44 xl:px-56'>
            <h2 className='font-bold text-xl '>Мои проекты</h2>
            <div >
                {!loading && projects?.length === 0 && <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <FolderIcon />
                        </EmptyMedia>
                        <EmptyTitle>Пока нету проектов</EmptyTitle>
                        <EmptyDescription>
                            Вы пока еще не создали ни одного проекта! Создайте его прямо сейчас выше!
                        </EmptyDescription>
                    </EmptyHeader>

                    <Button
                        variant="link"
                        asChild
                        className="text-muted-foreground"
                        size="sm"
                    >
                        <a href="#">
                            Узнать более<ArrowUpRightIcon />
                        </a>
                    </Button>
                </Empty>}
                {!loading ?
                   <div className='mt-5 flex flex-wrap gap-4'>
                       {projects?.map((project:any, index:number) => (
                           <ProjectCard
                               key={project.projectId}
                               project={project}
                               onDelete={(id: string) =>
                                   setProjects((prev: any[]) =>
                                       prev.filter(p => p.projectId !== id)
                                   )
                               }
                           />
                       ))}
                   </div> :  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
                        {[1,2,3,4,5].map((project:any, index:number) => (
                            <div>
                                <Skeleton className='w-full h-[200px] rounded-xl'/>
                                <Skeleton className='mt-3 w-full h-6'/>
                                <Skeleton className='mt-3 w-30 h-6'/>
                            </div>


                        ))}
                    </div>
                 }

            </div>


        </div>
    )
}
export default ProjectList
