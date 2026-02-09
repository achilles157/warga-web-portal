"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Link as LinkIcon, Image as ImageIcon, List, ListOrdered, Quote, Heading1, Heading2, Undo, Redo } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
}

export function RichTextEditor({ value, onChange, className, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            ImageExtension.configure({
                inline: true,
                allowBase64: true,
            }),
            LinkExtension.configure({
                openOnClick: false,
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Mulai menulis...',
            }),
        ],
        content: value, // Initial content
        editorProps: {
            attributes: {
                class: 'prose prose-neutral max-w-none focus:outline-none min-h-[500px] p-6 text-sm',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) {
        return null;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL:', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const handleImageUpload = (result: any) => {
        if (result.event === "success") {
            const url = result.info.secure_url;
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className={cn("border border-neutral-200 rounded-xl bg-white flex flex-col", className)}>
            {/* Toolbar */}
            <div className="sticky top-20 z-20 flex items-center gap-1 p-2 border-b border-neutral-100 bg-white/95 backdrop-blur-sm flex-wrap rounded-t-xl">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    icon={Bold}
                    tooltip="Bold"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    icon={Italic}
                    tooltip="Italic"
                />
                <div className="w-px h-6 bg-neutral-200 mx-1" />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    icon={Heading1}
                    tooltip="Heading 1"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    icon={Heading2}
                    tooltip="Heading 2"
                />
                <div className="w-px h-6 bg-neutral-200 mx-1" />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    icon={List}
                    tooltip="Bullet List"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    icon={ListOrdered}
                    tooltip="Ordered List"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    icon={Quote}
                    tooltip="Quote"
                />
                <div className="w-px h-6 bg-neutral-200 mx-1" />
                <ToolbarButton
                    onClick={setLink}
                    isActive={editor.isActive('link')}
                    icon={LinkIcon}
                    tooltip="Link"
                />
                <CldUploadWidget
                    uploadPreset="warga_daily_unsigned"
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

                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    icon={Undo}
                    tooltip="Undo"
                    isActive={false}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    icon={Redo}
                    tooltip="Redo"
                    isActive={false}
                />
            </div>

            {/* Editor Area */}
            <div className="flex-1 overflow-y-auto min-h-[500px] cursor-text" onClick={() => editor.chain().focus().run()}>
                <EditorContent editor={editor} />
            </div>

            {/* Footer Status */}
            <div className="px-4 py-2 border-t border-neutral-100 bg-neutral-50 text-xs text-neutral-400 text-right rounded-b-xl">
                Rich Text Enabled
            </div>
        </div>
    );
}

function ToolbarButton({ onClick, icon: Icon, tooltip, isActive }: { onClick: () => void; icon: any; tooltip: string; isActive?: boolean }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "p-1.5 rounded-md transition-colors",
                isActive ? "bg-neutral-200 text-ink" : "text-neutral-500 hover:text-ink hover:bg-neutral-200"
            )}
            title={tooltip}
        >
            <Icon size={18} />
        </button>
    );
}
