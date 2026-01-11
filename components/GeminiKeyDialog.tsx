'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "sonner"
import {useGeminiApiKey} from "@/context/GeminiApiKeyProvider";

type Props = {
    open: boolean
    onClose: () => void
}

export function GeminiKeyDialog({ open, onClose }: Props) {


    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Gemini API Key</DialogTitle>
                    <DialogDescription className="space-y-2">
                        <p>
                            Введите ваш Gemini API ключ. Он используется для генерации UI и
                            хранится <b>только в вашем браузере</b>.
                        </p>

                        <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                            <li>
                                Перейдите на{" "}
                                <a
                                    href="https://ai.google.dev/"
                                    target="_blank"
                                    className="underline"
                                >
                                    https://ai.google.dev
                                </a>
                            </li>
                            <li>Нажмите <b>Get API key</b></li>
                            <li>Войдите в Google аккаунт</li>
                            <li>Создайте новый API ключ</li>
                            <li>Скопируйте ключ, начинающийся с <b>AIza</b></li>
                        </ol>

                        <p className="text-xs text-muted-foreground">
                            Если генерация перестала работать — скорее всего, у ключа закончился лимит.
                            Просто создайте новый и замените его здесь.
                        </p>
                    </DialogDescription>
                </DialogHeader>

                <Input
                    placeholder="AIza..."
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                />

                <Button onClick={saveKey}>Сохранить</Button>
            </DialogContent>
        </Dialog>
    )
}
