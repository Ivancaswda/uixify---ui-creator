import React, {useState} from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import {Loader2Icon, Trash2} from "lucide-react";
import {Button} from "@/components/ui/button";

const ProjectCard = ({ project, onDelete }: any) => {
    const screenshots = project?.screenShot
        ? Array.isArray(project.screenShot)
            ? project.screenShot
            : JSON.parse(project.screenShot)
        : [];
    const [deleting, setDeleting] = useState<boolean>(false)

    const preview = screenshots?.[0]?.image;

    const deleteProject = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDeleting(true)
        try {
            await axios.delete("/api/projects/remove", {
                data: { projectId: project.projectId },
            });

            toast.success("Проект удалён");
            onDelete?.(project.projectId);
            setDeleting(false)
        } catch (e) {
            setDeleting(false)
            console.log(e)
            toast.error("Не удалось удалить проект");
        }
    };

    return (
        <div className="relative">
            <Link
                className="h-[350px] w-[200px] mt-[22px] transition-all hover:scale-105 cursor-pointer block"
                href={`projects/${project.projectId}`}
            >
                {preview ? (
                    <img
                        src={preview}
                        alt={project?.projectName}
                        className="rounded-xl object-cover h-[120px] w-[200px]"
                    />
                ) : (
                    <div className="h-[120px] w-[200px] bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                        No preview
                    </div>
                )}
                <div className='flex items-center gap-2'>
                    <div className="mt-2">
                        <h2 className="font-medium">{project?.projectName}</h2>
                        <p className="text-gray-500 text-sm">{project?.createdOn}</p>

                    </div>
                    <Button disabled={deleting}
                        onClick={deleteProject}
                        variant='outline'      >
                        {deleting ? <Loader2Icon className='animate-spin'/> : <Trash2 size={16} />}

                    </Button>
                </div>

            </Link>



        </div>
    );
};

export default ProjectCard;
