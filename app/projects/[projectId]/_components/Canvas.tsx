import React, {
    forwardRef,
    useImperativeHandle,
    useRef,
    useState
} from "react";
import ScreenFrame from "./ScreenFrame";
import html2canvas from "html2canvas";
import axios from "@/lib/axios";
import { toast } from "sonner";
import {Button} from "@/components/ui/button";
import {XIcon} from "lucide-react";

const Canvas = forwardRef(({ project, screenConfig, setApiKeyDialogOpen }: any, ref) => {
    const iframeMapRef = useRef<Record<string, HTMLIFrameElement | null>>({});
    const [screenshots, setScreenshots] = useState<{screenId: string, image: string}[]>([]);
    const [isGeneratingUI, setIsGeneratingUI] = useState(false);
    useImperativeHandle(ref, () => ({
        async takeScreenshot() {
            if (!screenConfig?.length) return;

            try {
                const newScreenshots: { screenId: string; image: string }[] = [];

                for (const screen of screenConfig) {
                    const iframe = iframeMapRef.current[screen.screenId];
                    if (!iframe) continue;

                    const screenshotDataUrl = await iframe.contentWindow?.takeScreenshot();
                    if (screenshotDataUrl) {
                        newScreenshots.push({
                            screenId: screen.screenId,
                            image: screenshotDataUrl,
                        });
                    }
                }

                setScreenshots(newScreenshots);

                // сохраняем на сервер
                await axios.post("/api/projects/save-screenshots", {
                    projectId: project.projectId,
                    screenshots: newScreenshots,
                });
                setCloseDownload(false)

                toast.success("Скриншоты сохранены ✅");
            } catch (e) {
                console.error(e);
                toast.error("Ошибка при создании скриншотов");
            }
        }
    }));
    console.log('screenshots')
    console.log(screenshots)
    const downloadScreenshot = (screen: {screenId: string, image: string}) => {
        const link = document.createElement("a");
        link.href = screen.image; // Base64 data URL
        link.download = `${screen.screenId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    console.log(screenshots)
    const [closeDownload, setCloseDownload] = useState<boolean>(false)
    return (
        <div className="w-full h-screen overflow-y-auto bg-gray-300">
            <div className="flex flex-col gap-24">
                {screenConfig?.map((screen: any) =>
                    screen.code ? (
                        <ScreenFrame setApiKeyDialogOpen={setApiKeyDialogOpen}
                            key={screen.screenId}
                            screen={screen}
                            project={project}
                            registerIframe={(el) => {
                                iframeMapRef.current[screen.screenId] = el;
                            }}
                        />
                    ) : null
                )}
            </div>
            { screenshots.length  > 0 && (
                <div className="fixed bottom-4 right-4 bg-white p-4 rounded shadow space-y-2">
                    <div className=' flex items-center justify-between'>
                        <h3 className="font-medium">Скачать скриншоты</h3>
                        <XIcon className='text-muted-foreground cursor-pointer' onClick={() => setScreenshots([])}/>
                    </div>

                    <div className='flex gap-4 items-center '>
                        {screenshots.map((s) => (
                            <Button
                                key={s.screenId}
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => downloadScreenshot(s)}
                            >
                                {s.screenId}
                            </Button>
                        ))}
                    </div>

                </div>
            )}

        </div>
    );
});

export default Canvas;
