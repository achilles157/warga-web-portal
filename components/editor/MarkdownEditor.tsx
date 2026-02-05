"use client";

import { useRef, useState } from "react";
import {
    Bold, Italic, Link as LinkIcon, Image as ImageIcon,
    List, ListOrdered, Quote, Heading1, Heading2, Eye, EyeOff
} from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
}

export function MarkdownEditor({ value, onChange, className, placeholder }: MarkdownEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [previewMode, setPreviewMode] = useState(false);

    const insertText = (before: string, after: string = "") => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const previousValue = textarea.value;
        const selectedText = previousValue.substring(start, end);

        const newValue =
            previousValue.substring(0, start) +
            before + selectedText + after +
            previousValue.substring(end);

        onChange(newValue);

        // Reset cursor position
        requestAnimationFrame(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, end + before.length);
        });
    };

    const handleImageUpload = (result: any) => {
        if (result.event === "success") {
            const url = result.info.secure_url;
            const caption = result.info.original_filename || "image";
            insertText(`![${caption}](${url})`);
        }
    };

    return (
        <div className={cn("border border-neutral-200 rounded-xl overflow-hidden bg-white flex flex-col", className)}>
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b border-neutral-100 bg-neutral-50/50 flex-wrap">
                <ToolbarButton onClick={() => insertText("**", "**")} icon={Bold} tooltip="Bold" />
                <ToolbarButton onClick={() => insertText("*", "*")} icon={Italic} tooltip="Italic" />
                <div className="w-px h-6 bg-neutral-200 mx-1" />
                <ToolbarButton onClick={() => insertText("# ")} icon={Heading1} tooltip="Heading 1" />
                <ToolbarButton onClick={() => insertText("## ")} icon={Heading2} tooltip="Heading 2" />
                <div className="w-px h-6 bg-neutral-200 mx-1" />
                <ToolbarButton onClick={() => insertText("- ")} icon={List} tooltip="Bullet List" />
                <ToolbarButton onClick={() => insertText("1. ")} icon={ListOrdered} tooltip="Numbered List" />
                <ToolbarButton onClick={() => insertText("> ")} icon={Quote} tooltip="Quote" />
                <div className="w-px h-6 bg-neutral-200 mx-1" />
                <ToolbarButton onClick={() => insertText("[", "](url)")} icon={LinkIcon} tooltip="Link" />

                <CldUploadWidget
                    uploadPreset="warga_daily_unsigned" // Note: This needs to be set in Cloudinary Settings
                    onSuccess={handleImageUpload}
                >
                    {({ open }) => (
                        <button
                            type="button"
                            onClick={() => open()}
                            className="p-1.5 text-neutral-500 hover:text-ink hover:bg-neutral-200 rounded-md transition-colors"
                            title="Upload Image"
                        >
                            <ImageIcon size={18} />
                        </button>
                    )}
                </CldUploadWidget>

                <div className="flex-1" />
                <button
                    type="button"
                    onClick={() => setPreviewMode(!previewMode)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-600 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50"
                >
                    {previewMode ? <EyeOff size={14} /> : <Eye size={14} />}
                    {previewMode ? "Edit" : "Preview"}
                </button>
            </div>

            {/* Editor / Preview Area */}
            <div className="flex-1 relative min-h-[500px]">
                {previewMode ? (
                    <div className="prose prose-neutral max-w-none p-6 overflow-y-auto h-full absolute inset-0">
                        {/* Simple Preview Render (For now just whitespace preservation, later can be react-markdown) */}
                        <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed">{value}</div>
                    </div>
                ) : (
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full h-full p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed text-ink bg-transparent absolute inset-0"
                    />
                )}
            </div>

            {/* Footer Status */}
            <div className="px-4 py-2 border-t border-neutral-100 bg-neutral-50 text-xs text-neutral-400 text-right">
                {value.length} characters • Markdown Supported
            </div>
        </div>
    );
}

function ToolbarButton({ onClick, icon: Icon, tooltip }: { onClick: () => void; icon: any; tooltip: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="p-1.5 text-neutral-500 hover:text-ink hover:bg-neutral-200 rounded-md transition-colors"
            title={tooltip}
        >
            <Icon size={18} />
        </button>
    );
}
