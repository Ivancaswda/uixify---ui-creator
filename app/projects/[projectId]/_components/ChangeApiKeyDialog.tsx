'use client'

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import { toast } from "sonner";

export const ChangeApiKeyDialog = ({
                                       open,
                                       onClose,
                                       projectId,
                                       onSuccess,
                                   }: any) => {
    const [apiKey, setApiKey] = useState("");
    const [loading, setLoading] = useState(false);

    const saveKey = async () => {
        try {
            setLoading(true);

            await axios.post("/api/projects/update-api-key", {
                projectId,
                apiKey,
            });

            toast.success("Gemini API key обновлён ✅");
            onSuccess?.();
            onClose();
        } catch {
            toast.error("Не удалось сохранить API ключ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-[90%] sm:w-[400px] p-4 sm:p-6 rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-sm sm:text-base">Изменить Gemini API Key</DialogTitle>
                </DialogHeader>

                <Input
                    className="mt-2 text-sm sm:text-base"
                    placeholder="Введите ваш API ключ"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                />

                <Button
                    className="mt-4 w-full sm:w-auto"
                    onClick={saveKey}
                    disabled={loading}
                >
                    {loading ? "Сохранение..." : "Сохранить"}
                </Button>
            </DialogContent>
        </Dialog>
    );
};
