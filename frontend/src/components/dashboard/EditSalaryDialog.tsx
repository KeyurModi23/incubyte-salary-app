import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Edit2 } from 'lucide-react'
import axios from 'axios'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  salary: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Salary must be a positive number.',
  }),
})

type EditSalaryDialogProps = {
  employeeId: string | number
  currentSalary: number
  employeeName: string
  onSuccess: () => void
}

export function EditSalaryDialog({ employeeId, currentSalary, employeeName, onSuccess }: EditSalaryDialogProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salary: currentSalary.toString(),
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await axios.put(`http://localhost:3001/api/employees/${employeeId}`, {
        salary: Number(values.salary),
      })
      
      toast({
        title: 'Salary Updated',
        description: `Successfully updated salary for ${employeeName}.`,
      })
      
      setOpen(false)
      onSuccess() // trigger refetch
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update salary. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <Edit2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Salary</DialogTitle>
          <DialogDescription>
            Update the base salary for {employeeName}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Salary (USD)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="120000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-4">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
