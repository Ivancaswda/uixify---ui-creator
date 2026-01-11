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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Изменить Gemini API Key</DialogTitle>
                </DialogHeader>

                <Input
                    placeholder="AIza..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                />

                <Button onClick={saveKey} disabled={loading}>
                    {loading ? "Сохранение..." : "Сохранить"}
                </Button>
            </DialogContent>
        </Dialog>
    );
};
