'use client'
import React, { useEffect, useRef, useState } from 'react';
import ProjectHeader from "@/app/projects/[projectId]/_components/ProjectHeader";
import SettingsSection from "@/app/projects/[projectId]/_components/SettingsSection";
import Canvas from "@/app/projects/[projectId]/_components/Canvas";
import CanvasSkeleton from "@/app/projects/[projectId]/_components/CanvasSkeleton";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { LoaderOne } from "@/components/ui/loader";
import { useSettings } from "@/context/useSettings";
import { useRefreshData } from "@/context/RefreshDataProvider";
import axios from "@/lib/axios";
import { ChangeApiKeyDialog } from "@/app/projects/[projectId]/_components/ChangeApiKeyDialog";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

const ProjectIdPage = () => {
    const canvasRef = useRef<any>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isGeneratingUI, setIsGeneratingUI] = useState(false);
    const { refreshData, setRefreshData } = useRefreshData();
    const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<null | (() => void)>(null);
    const { projectId } = useParams();
    const [project, setProject] = useState<any>(null);
    const [screenConfig, setScreenConfig] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);
    const { settings, setSettings } = useSettings();

    const generatingScreenId = useRef<string | null>(null);

    useEffect(() => {
        if (!projectId) return;
        getProjectById();
    }, [projectId]);

    const getProjectById = async () => {
        try {
            setLoading(true);
            const result = await axios.get(`/api/projects/getOne?projectId=${projectId}`);
            setProject(result.data.project);
            setSettings(result.data.project);
            setScreenConfig(result.data.screenConfig);
        } catch {
            toast.error("Не удалось получить проект");
        } finally {
            setLoading(false);
        }
    };

    // Генерация экранов если пусто
    useEffect(() => {
        if (!project || screenConfig === null) return;
        if (screenConfig.length === 0) generateScreenConfig();
    }, [project, screenConfig]);

    const generateScreenConfig = async () => {
        try {
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
        } catch (e: any) {
            if (e?.response?.data?.error === "API_KEY_INVALID") {
                setPendingAction(() => () => generateScreenConfig());
                setApiKeyDialogOpen(true);
                return;
            }
            if (e?.response?.data?.error === "AI_REGION_BLOCKED") {
                toast.error("Gemini API недоступен в вашем регионе.");
                return;
            }
            toast.error("Не удалось сгенерировать конфиг");
        } finally {
            setLoading(false);
        }
    };

    // Генерация UI для отдельных экранов
    useEffect(() => {
        if (!project || !screenConfig) return;
        const screenToGenerate = screenConfig.find(
            s => !s.code && generatingScreenId.current !== s.screenId
        );
        if (screenToGenerate) generateScreenUIUX(screenToGenerate);
    }, [project, screenConfig]);

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
            if (updatedScreen?.code) {
                setScreenConfig(prev =>
                    prev!.map(item =>
                        item.screenId === screen.screenId
                            ? { ...item, code: updatedScreen.code }
                            : item
                    )
                );
            }
        } catch (error: any) {
            if (error?.response?.data?.error === "AI_REGION_BLOCKED") {
                toast.error("Gemini API недоступен в вашем регионе.");
                return;
            }
            if (["API_KEY_INVALID", "AI_QUOTA_EXCEEDED"].includes(error?.response?.data?.error)) {
                setPendingAction(() => () => generateScreenUIUX(screen));
                setApiKeyDialogOpen(true);
                toast.error("Закончилась квота на Gemini API ключ!");
                return;
            }
            toast.error("Ошибка генерации UI");
        } finally {
            generatingScreenId.current = null;
            setIsGeneratingUI(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center w-screen min-h-screen">
            <LoaderOne />
        </div>
    );

    return (
        <div className="flex flex-col h-screen">
            <ProjectHeader />

            {/* Кнопка переключения sidebar на мобильных и больших */}
            <div className="flex justify-end px-2 sm:px-4 py-1 bg-gray-50">
                <Button variant="outline" size="icon" onClick={() => setIsSidebarOpen(prev => !prev)}>
                    {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
                </Button>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <SettingsSection
                    setApiKeyDialogOpen={setApiKeyDialogOpen}
                    isSidebarOpen={isSidebarOpen}
                    takeScreenshot={() => canvasRef.current?.takeScreenshot()}
                    screenDescription={screenConfig && screenConfig[0]?.screenDescription}
                    project={project}
                />

                {/* Canvas */}
                <div className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? "sm:ml-0" : ""} overflow-auto`}>
                    {isGeneratingUI ? (
                        <CanvasSkeleton />
                    ) : (
                        <Canvas
                            ref={canvasRef}
                            project={project}
                            screenConfig={screenConfig}
                        />
                    )}
                </div>
            </div>

            {/* Диалог смены API ключа */}
            <ChangeApiKeyDialog
                open={apiKeyDialogOpen}
                projectId={projectId}
                onClose={() => setApiKeyDialogOpen(false)}
                onSuccess={() => {
                    pendingAction?.();
                    setPendingAction(null);
                }}
            />
        </div>
    );
};

export default ProjectIdPage;
