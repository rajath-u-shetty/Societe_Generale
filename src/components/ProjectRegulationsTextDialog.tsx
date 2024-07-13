"use client"
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from './ui/textarea';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useSOPStore } from '@/lib/stores/useSOP';
import { DialogClose } from '@radix-ui/react-dialog';
import { setProjectRegulationsText } from '@/app/(app)/_actions/userActions';

type Props = {
  organizationId: string;
  projectId: string;
}

const formSchema = z.object({
  regulationsText: z.string().min(2, {
    message: "Regulations text is required",
  }),
})

const ProjectRegulationsTextDialog = ({ projectId, organizationId }: Props) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const regulationsText = useSOPStore((state) => state.regulationsText)
  const setRegulationsText = useSOPStore((state) => state.setRegulationsText)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      regulationsText: regulationsText,
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setRegulationsText(values.regulationsText)
    await setProjectRegulationsText(projectId, values.regulationsText)
    setIsLoading(false)
    setIsOpen(false)
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="md:font-semibold text-sm md:block hidden"
          variant="default"
          size="sm"
        >
          Edit regulations text
        </Button>
      </DialogTrigger>
      <DialogContent className="md:min-w-[600px]">
        <DialogHeader>
          <DialogTitle className='leading-relaxed'>Write the regulations you want your project SOP&apos;s to follow and be compliant with.</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="regulationsText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Regulations text</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      defaultValue={regulationsText}
                      value={field.value} // use value instead of defaultValue
                      rows={7}
                      className="w-full h-full"
                      placeholder="Enter regulations text here"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" isLoading={isLoading} className="w-full"> Save </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ProjectRegulationsTextDialog
