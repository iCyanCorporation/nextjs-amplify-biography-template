import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import TiptapEditor, { type TiptapEditorRef } from "@/components/TiptapEditor";
import { FieldGroupIcon } from "@aws-amplify/ui-react";


interface PostForm {
  title: string;
  content: string;
}


interface EditFormProps {
  content: string;
  onChange: (content: string) => void;
}

export default function EditForm({ content, onChange }: EditFormProps) {
  const editorRef = useRef<TiptapEditorRef>(null);
  const [editorContent, setEditorContent] = useState<string>(content || '');
  const [isLoading, setIsLoading] = useState(true);
  const { control, reset, watch } = useForm<PostForm>({
    defaultValues: {
      content: content
    },
    mode: 'onChange'
  });

  useEffect(() => {
    // console.log("content:::", content);
    if (!content) return;
    reset({ content });
    setEditorContent(content);
    setIsLoading(false);
  }, [content]);

  useEffect(() => {
    const subscription = watch((values, { type }) => {
      if (type === "change") {
        const newContent = values.content as string;
        onChange(newContent);
        setEditorContent(newContent);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  if (isLoading) return;
  return (
    <div className="relative w-full h-full editor-container">
      <Controller
        control={control}
        name="content"
        render={({ field }) => (
          <TiptapEditor
            ref={editorRef}
            ssr={true}
            output="html"
            placeholder={{
              paragraph: "Type your content here...",
              imageCaption: "Type caption for image (optional)",
            }}
            contentMinHeight={256}
            contentMaxHeight={640}
            contentClass="prose max-w-none flex-1 h-full"
            onContentChange={field.onChange}
            initialContent={editorContent}
          />
        )}
      />
    </div>
  );
}