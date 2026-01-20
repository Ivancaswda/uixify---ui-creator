import React, {useState} from 'react'
import {
    Code,
    CopyIcon,
    DownloadIcon,
    GripVertical,
    Loader2Icon,
    MoreVertical,
    SparkleIcon,
    TrashIcon
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import SyntaxHighlighter from "react-syntax-highlighter/dist/cjs/prism";
import {toast} from "sonner";
import {themeToCssVars} from "@/lib/prompt";
import html2canvas from "html2canvas";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import axios from "@/lib/axios";
import {useRefreshData} from "@/context/RefreshDataProvider";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Textarea} from "@/components/ui/textarea";
import {LoaderOne} from "@/components/ui/loader";


const ScreenHandler = ({screen, theme, iframeRef, projectId, setApiKeyDialogOpen}:any) => {
    const [loading, setLoading] = useState<boolean>()
    const html = `<!doctype html>
         <html>
                <head>
                    <meta charset="utf-8"/>
                    <meta name="viewport" content="width=device-width, initial-scale-1"/>
        <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>

<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
/>

<script src="https://cdn.tailwindcss.com"></script>
                     <style>
                     * {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
                     ${themeToCssVars(theme)}
</style>
                </head> 
      <body class="bg-[var(--background)] text-[var(--foreground)] w-full min-h-screen">
                    ${screen?.code}      
                </body>
        </html>
`
    const [editUserInput, setEditUserInput] = useState<string>()
    const {refreshData, setRefreshData} = useRefreshData()
    const takeIframeScreenShot =  async () => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        try {
            const doc = iframe.contentDocument;
            if (!doc) return;

            const body = doc.body;

            // wait one frame to ensure layout is stable
            await new Promise((res) => requestAnimationFrame(res));

            const canvas = await html2canvas(body, {
                backgroundColor: null,
                useCORS: true,
                scale: window.devicePixelRatio || 1,
            });

            const image = canvas.toDataURL("image/png");

            // download automatically
            const link = document.createElement("a");
            link.href = image;
            link.download = `${screen.screenName || "screen"}.png`;
            link.click();
        } catch (err) {
            console.error("Screenshot failed:", err);
        }
    }
    const onDelete = async () => {
        try {
            setLoading(true)
            const result = await axios.delete(`/api/screens/remove?projectId=${projectId}&screenId=${screen?.screenId}`, {

            })
            if (result.data.success) {
                setRefreshData({method: 'screenConfig', date: Date.now()})
                toast.success('Скрин был удален успешно!')
                setLoading(false)
            }

        } catch (error) {
            toast.error('failed to delete a screen')
            setLoading(false)
        }
    }

    const editScreen = async () => {
        try {
            setLoading(true)
            const result = await axios.post("/api/edit-screen-ai", {
                projectId: projectId,
                screenId: screen?.screenId,
                userInput: editUserInput,
                oldCode: screen?.code
            })
            if (result.data.success) {
                setRefreshData({method: 'screenConfig', date: Date.now()})
                toast.success(" Скрин был изменен")
                setLoading(false)
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
            setLoading(false)
            console.log(error)
            toast.error('Не удалось изменить скрин')
        }
    }
    return (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2 sm:gap-4">
                <div className="flex items-center gap-2 text-sm sm:text-base">
                <GripVertical className="w-4 h-4" />
                <h2>{screen?.screenName}</h2>
            </div>
                <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 sm:mt-0">

                <Dialog>
                    <DialogTrigger>
                        <Button variant='ghost'>
                            <Code
                            />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-6xl w-full h-[70vh] flex flex-col'>
                        <DialogTitle>
                            HTML + Tailwindcss Код
                        </DialogTitle>
                        <DialogDescription className='flex-1 overflow-y-auto rounded-md border bg-muted p-4'>
                            <SyntaxHighlighter
                                codeTagProps={{
                                    style: {
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word'
                                    }
                                }}
                                customStyle={{
                                margin: 0,
                                padding: 0,
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                overflowX: 'hidden',
                                    height: '50vh'
                            }} language="html">
                                {html}
                            </SyntaxHighlighter>
                            <Button onClick={() => {
                                navigator.clipboard.writeText(screen?.code)
                                toast.success('Код скопирован!')
                            }} className='mt-4' variant='outline'>
                                Скопировать
                                <CopyIcon />
                            </Button>
                        </DialogDescription>

                    </DialogContent>

                </Dialog>
                <Button onClick={takeIframeScreenShot} variant='ghost'>
                    <DownloadIcon/>
                </Button>
                <Popover>
                    <PopoverTrigger>
                        <Button variant="ghost" size="sm">
                            {loading ? <Loader2Icon className="animate-spin w-4 h-4"/> : <SparkleIcon className="w-4 h-4"/>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[90vw] sm:w-[300px]">
                        <Textarea value={editUserInput} onChange={(e) => setEditUserInput(e.target.value)} placeholder="Какие изменения вы хотите?"/>
                        <Button disabled={loading} className="mt-2 w-full sm:w-auto" onClick={() => editScreen()}>
                            {loading ? <Loader2Icon className="animate-spin w-4 h-4"/> : <SparkleIcon className="w-4 h-4"/>}
                            {loading ? 'Генерация...' : 'Редактировать'}
                        </Button>
                    </PopoverContent>
                </Popover>


                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant='ghost'>
                            <MoreVertical/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                            <DropdownMenuItem>
                                <Button onClick={() => onDelete()} variant='destructive'>
                                    {loading ? <Loader2Icon className='animate-spin'/> :<TrashIcon className='text-white'/>}
                                    {loading ? 'Подождите...' : "Удалить"}

                                </Button>
                            </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>


            </div>
        </div>
    )
}
export default ScreenHandler
