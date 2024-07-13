import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from './ui/textarea'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useSOPStore } from '@/lib/stores/useSOP'
import { getProjectRegulationsText, setProjectRegulationsText } from '@/app/(app)/_actions/userActions'

type Props = {
  organizationId: string
  projectId: string
}

const formSchema = z.object({
  regulationsText: z.string().min(2, {
    message: "Regulations text is required",
  }),
})

const ProjectRegulationsTextDialog = ({ projectId, organizationId }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const regulationsText = useSOPStore((state) => state.regulationsText)
  const setRegulationsText = useSOPStore((state) => state.setRegulationsText)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      regulationsText: '',
    },
  })

  useEffect(() => {
    const getDbRegulationsText = async () => {
      const dbRegulationsText = await getProjectRegulationsText(projectId)
      const textToUse = regulationsText || dbRegulationsText.data?.regulation || ''
      form.setValue('regulationsText', textToUse)
    }
    getDbRegulationsText()
  }, [projectId, regulationsText, form])

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
                      rows={7}
                      className="w-full h-full"
                      placeholder="Enter regulations text here"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ProjectRegulationsTextDialog
