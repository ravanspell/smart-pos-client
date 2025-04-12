"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/atoms/Form"
import FormFileUploader, {
  type UploadFile,
} from "@/components/molecules/FormFileUploader"
import { useConfirmFileUploadMutation } from "@/redux/api/fileManagmentAPI"
import ModalActionButtons from "../../molecules/ModalActionButtons"
import { useErrorHandler } from "@/hooks/useErrorHandler";

const formSchema = z.object({
  files: z
    .array(z.any())
    .min(1, { message: "Please upload at least one file." }),
})

type FormValues = z.infer<typeof formSchema>

export interface FileUploadFormProps {
  /**
   * The parent ID for the file upload.
   * @type string
   * @example parentId="123"
   */
  parentId?: string

  /**
   * The callback function to be called when the form is canceled.
   * @type () => void
   * @example onCancel={() => {}}
   */
  onCancel: () => void
}

const FileUploadForm = ({
  parentId,
  onCancel,
}: FileUploadFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmFileUpload, { isLoading }] = useConfirmFileUploadMutation()
  const { handleError } = useErrorHandler();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
    },
  })

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      console.log("values.files.files", values.files);
      
      // Only submit files that have been uploaded to S3
      const filesToSubmit = values.files.filter(
        (file: UploadFile) => file.s3ObjectKey
      ) as UploadFile[]
      console.log("filesToSubmit", filesToSubmit);
      
      if (filesToSubmit.length === 0) {
        form.setError("files", {
          type: "manual",
          message: "Please wait for all files to finish uploading.",
        })
        return
      }

      // Prepare the files array for the API request
      const filesToUpload = filesToSubmit.map(file => ({
        fileName: file.name,
        parentId: parentId || null,
        s3ObjectKey: file.s3ObjectKey || `temp/${Date.now()}/${file.name}`, // Use the s3ObjectKey from the file if available
        fileSize: file.size
      }))

      // Call the confirmFileUpload mutation with all files
      await confirmFileUpload({
        files: filesToUpload
      }).unwrap()

      // close the modal on success
      onCancel();
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="files"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FormFileUploader
                  files={field.value}
                  onChange={(files) => {
                    field.onChange(files)
                  }}
                  accept="*"
                  maxSize={1024 * 1024 * 1024 * 2} // 2GB
                  maxFileCount={20}
                  multiple={true}
                  disabled={isLoading || isSubmitting}
                  error={!!form.formState.errors.files}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ModalActionButtons
          isLoading={isLoading || isSubmitting}
          secondaryAction={onCancel}
          primaryAction={() => form.handleSubmit(handleSubmit)()}
          primaryLabel="Upload"
          secondaryLabel="Cancel"
        />
      </form>
    </Form>
  )
}

export default FileUploadForm 