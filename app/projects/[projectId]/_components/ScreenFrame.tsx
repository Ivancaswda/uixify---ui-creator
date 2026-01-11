import React, {useEffect, useRef} from "react";
import { THEMES } from "@/app/projects/[projectId]/_components/SettingsSection";
import { useSettings } from "@/context/useSettings";
import ScreenHandler from "@/app/projects/[projectId]/_components/ScreenHandler";
import { themeToCssVars } from "@/lib/prompt";

const HEADER_HEIGHT = 48;

const ScreenFrame = ({ project, screen, registerIframe, setApiKeyDialogOpen  }: any) => {
    const { settings } = useSettings();

    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    // @ts-ignore
    const theme = THEMES[settings?.theme ?? project?.theme ?? ""];
    useEffect(() => {
        registerIframe?.(iframeRef.current);
    }, []);
    if (!screen?.code) return null;

    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script>
  window.takeScreenshot = async () => {
    const canvas = await html2canvas(document.body);
    return canvas.toDataURL("image/png");
  }
</script>
<style>
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; height: 100%; }
${themeToCssVars(theme)}
</style>
</head>
<body>
${screen.code}
</body>
</html>`;

    return (
        <section className="w-screen h-screen  flex flex-col bg-gray-200">
            {/* Header */}
            <div
                className="flex items-center px-4 text-xs text-gray-600 bg-white border-b shrink-0"
                style={{ height: HEADER_HEIGHT }}
            >
                <ScreenHandler setApiKeyDialogOpen={setApiKeyDialogOpen}
                    projectId={project?.projectId}
                    iframeRef={iframeRef}
                    theme={theme}
                    screen={screen}
                />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden  bg-gray-100">
                <iframe
                    ref={iframeRef}
                    className="w-full border border-gray-500 h-full border-0"
                    sandbox="allow-same-origin allow-scripts"
                    srcDoc={html}
                />
            </div>
        </section>
    );
};

export default ScreenFrame;
