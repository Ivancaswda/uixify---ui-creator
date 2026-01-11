'use client'
import React, {useEffect, useRef, useState} from 'react'
import ProjectHeader from "@/app/projects/[projectId]/_components/ProjectHeader";
import SettingsSection, {THEMES} from "@/app/projects/[projectId]/_components/SettingsSection";
import {useParams} from "next/navigation";

import {toast} from "sonner";
import {LoaderOne} from "@/components/ui/loader";
import Canvas from "@/app/projects/[projectId]/_components/Canvas";
import {useSettings} from "@/context/useSettings";
import {useRefreshData} from "@/context/RefreshDataProvider";
import axios from "@/lib/axios";
import {ChangeApiKeyDialog} from "@/app/projects/[projectId]/_components/ChangeApiKeyDialog";
import CanvasSkeleton from "@/app/projects/[projectId]/_components/CanvasSkeleton";
import {Button} from "@/components/ui/button";
import {PanelLeftClose, PanelLeftOpen} from "lucide-react";





const ProjectIdPage = () => {
    const canvasRef = useRef<any>(null);
   // const isGeneratingUI = useRef(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isGeneratingUI, setIsGeneratingUI] = useState(false);
    const [takeScreenshot, setTakeScreenshot] = useState<any>()
    const {refreshData, setRefreshData} = useRefreshData()
    const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false)
    const [pendingAction, setPendingAction] = useState<null | (() => void)>(null)
    const {projectId} = useParams()
    const generatingScreenId = useRef<string | null>(null)
    const {settings, setSettings} = useSettings()
    const [project, setProject] = useState<any>(null)
    const [projectName, setProjectName] = useState(project?.projectName ?? '')
    const [screenConfig, setScreenConfig] = useState<any[] | null>(null)
    const [loading, setLoading] = useState(false)
    const [configGenerated, setConfigGenerated] = useState(false)
    useEffect(() => {
        if (!projectId) return;
        getProjectById();
    }, [projectId]);
    const getProjectById = async () => {
        try {
            setLoading(true)
            const result = await axios.get(`/api/projects/getOne?projectId=${projectId}`)
            setProject(result.data.project)
            setSettings(result.data.project)
            setScreenConfig(result.data.screenConfig)
        } catch (e) {
            toast.error("Не удалось получить проект")
        } finally {
            setLoading(false)
        }
    };
    useEffect(() => {
        if (!project) return;
        if (screenConfig === null) return;

        if (screenConfig.length === 0) {
            generateScreenConfig();
        }
    }, [project, screenConfig]);

    useEffect(() => {
        if (!project || !screenConfig) return;

        const screenToGenerate = screenConfig.find(
            s => !s.code && generatingScreenId.current !== s.screenId
        )

        if (screenToGenerate) {
            generateScreenUIUX(screenToGenerate)
        }
    }, [project, screenConfig])
    useEffect(() => {
        if (refreshData?.method === 'screenConfig') {
            getProjectById()
        }
    }, [refreshData]);

    console.log('project===')
    console.log(project)

    console.log('screenConfig')
    console.log(screenConfig)


    const generateScreenConfig = async () => {
        try {
            setConfigGenerated(true);
            setLoading(true);

            const result = await axios.post("/api/generate-config", {
                projectId,
                deviceType: project.device,
                userInput: project.userInput,
                screenCount: project?.screenCount,
                apiKey: project?.apiKey
            });


            setScreenConfig(prev =>
                prev ? [...prev, ...result.data.screens] : result.data.screens
            );


        } catch (e) {
            if (e?.response?.data?.error === "API_KEY_INVALID") {
                setPendingAction(() => () => generateScreenConfig())
                setApiKeyDialogOpen(true)
                return
            }
            if (e?.response?.data?.error === "AI_REGION_BLOCKED") {
                toast.error(
                    "Gemini API недоступен в вашем регионе. Используйте VPN или другой AI-провайдер."
                );
                return;
            }
            console.log(e)
            toast.error("Не удалось сгенерировать конфиг");
        } finally {
            setLoading(false);
        }
    };



    const generateScreenUIUX = async (screen: any) => {
        if (generatingScreenId.current) return;

        generatingScreenId.current = screen.screenId;
        setIsGeneratingUI(true);

        try {
            const result = await axios.post('/api/generate-screen-ui', {
                projectId,
                screenId: screen.screenId,
                screenName: screen.screenName,
                purpose: screen.purpose,
                screenDescription: screen.screenDescription,
                apiKey: project?.apiKey,
                deviceType: project?.device
            });

            const updatedScreen = result.data.aiResult?.[0];
            if (!updatedScreen?.code) return;

            setScreenConfig(prev =>
                prev!.map(item =>
                    item.screenId === screen.screenId
                        ? { ...item, code: updatedScreen.code }
                        : item
                )
            );
        } catch (error: any) {
            if (error?.response?.data?.error === "AI_REGION_BLOCKED") {
                toast.error(
                    "Gemini API недоступен в вашем регионе. Используйте VPN или другой AI-провайдер."
                );
                return;
            }
            if (error?.response?.data?.error === "API_KEY_INVALID" || error?.response?.data?.error === "AI_QUOTA_EXCEEDED") {
                setPendingAction(() => () => generateScreenUIUX(screen))
                setApiKeyDialogOpen(true)
                toast.error('У вас закончилась квота на geminiApi key поменяйте его и подождите 60 секунд!')
                return
            }
                toast.error("Ошибка генерации UI")



        } finally {
            generatingScreenId.current = null;
            setIsGeneratingUI(false);
        }
    };
    console.log(screenConfig)

    if (loading) {
        return <div className='flex items-center justify-center w-screen min-h-screen'>
            <LoaderOne/>
        </div>
    }
    console.log(apiKeyDialogOpen)
    return (
        <div className='max-w-screen!'>
            <div className=''>

                <ProjectHeader/>
                <Button
                    variant="outline"
                    size="icon" className='' style={{margin: "10px"}}
                    onClick={() => setIsSidebarOpen(prev => !prev)}
                >
                    {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
                </Button>
            </div>



            <div className="flex h-[calc(100vh-64px)] overflow-hidden">

                <div

                >
                    <SettingsSection setApiKeyDialogOpen={setApiKeyDialogOpen} setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen}
                        takeScreenshot={() => canvasRef.current?.takeScreenshot()}
                        screenDescription={screenConfig && screenConfig[0]?.screenDescription}
                        project={project}
                    />
                </div>


                <div className="flex-1 transition-all duration-300 ease-in-out">
                    {isGeneratingUI ? (
                        <CanvasSkeleton />
                    ) : (
                        <Canvas setApiKeyDialogOpen={setApiKeyDialogOpen}
                            ref={canvasRef}
                            project={project}
                            screenConfig={screenConfig}
                            loading={loading}
                        />
                    )}
                </div>
            </div>
            <ChangeApiKeyDialog
                open={apiKeyDialogOpen}
                projectId={projectId}
                onClose={() => setApiKeyDialogOpen(false)}
                onSuccess={() => {
                    pendingAction?.()
                    setPendingAction(null)
                }}
            />
        </div>
    )
}
export default ProjectIdPage
