'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useCalendar } from '@/hooks/calendar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

export interface CalendarRecord {
  uuid: string;
  session: string;
  term: string | null;
  next_term_resumption_date: string;
  open_date: string | null;
  close_date: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface CalendarFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calendarItem?: CalendarRecord | null;
  onSaved: () => void;
}

const TERM_OPTIONS = ['1st term', '2nd term', '3rd term'];

const emptyForm = {
  session: '',
  term: '',
  open_date: '',
  close_date: '',
  next_term_resumption_date: '',
};

export function CalendarFormSheet({
  open,
  onOpenChange,
  calendarItem,
  onSaved,
}: CalendarFormSheetProps) {
  const { create, update } = useCalendar();
  const [formData, setFormData] = useState(emptyForm);
  const [isActive, setIsActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isEdit = !!calendarItem;

  useEffect(() => {
    if (open) {
      setFormData(
        calendarItem
          ? {
              session: calendarItem.session || '',
              term: calendarItem.term || '',

              open_date: calendarItem.open_date
                ? calendarItem.open_date.slice(0, 10)
                : '',
              close_date: calendarItem.close_date
                ? calendarItem.close_date.slice(0, 10)
                : '',
              next_term_resumption_date: calendarItem.next_term_resumption_date
                ? calendarItem.next_term_resumption_date.slice(0, 10)
                : '',
            }
          : emptyForm,
      );
      setIsActive(calendarItem?.status === 'ACTIVE');
    }
  }, [open, calendarItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.session ||
      !formData.term ||
      !formData.next_term_resumption_date ||
      !formData.close_date
    ) {
      toast.error('All fields are required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        status: isActive ? ('ACTIVE' as const) : ('INACTIVE' as const),
      };
      const response = isEdit
        ? await update(calendarItem!.uuid, payload)
        : await create(payload);

      if (response.success) {
        toast.success(`Section ${isEdit ? 'updated' : 'added'} successfully`);
        onOpenChange(false);
        onSaved();
      } else {
        toast.error(response.message || 'Something went wrong');
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-full sm:max-w-md'>
        <SheetHeader>
          <SheetTitle>{isEdit ? 'Edit Section' : 'Add Section'}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className='flex flex-col gap-5 px-4 pb-6'>
          <div className='space-y-2'>
            <Label htmlFor='session'>Session</Label>
            <Input
              id='session'
              placeholder='E.g 2025/2026'
              value={formData.session}
              onChange={(e) =>
                setFormData({ ...formData, session: e.target.value })
              }
            />
          </div>

          <div className='space-y-2'>
            <Label>Term</Label>
            <Select
              value={formData.term}
              onValueChange={(value) =>
                setFormData({ ...formData, term: value })
              }
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select term' />
              </SelectTrigger>
              <SelectContent>
                {TERM_OPTIONS.map((term) => (
                  <SelectItem key={term} value={term}>
                    {term.charAt(0).toUpperCase() + term.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isEdit && calendarItem?.open_date ? (
            <div className='space-y-1 rounded-md border bg-muted/40 px-3 py-2'>
              <Label className='text-xs text-muted-foreground'>Open date</Label>
              <p className='text-sm'>
                {new Date(calendarItem.open_date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <p className='text-xs text-muted-foreground'>
                Derived automatically from the previous term&apos;s resumption
                date.
              </p>
            </div>
          ) : (
            <div className='space-y-1 rounded-md border bg-muted/40 px-3 py-2'>
              <Label className='text-xs text-muted-foreground'>Open date</Label>
              <p className='text-sm'>
                Automatically added when the section is created
              </p>
              <p className='text-xs text-muted-foreground'>
                Derived automatically from the previous term&apos;s resumption
                date.
              </p>
            </div>
          )}

          <div className='grid grid-cols-1 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='close_date'>Close date</Label>
              <Input
                id='close_date'
                type='date'
                value={formData.close_date}
                onChange={(e) =>
                  setFormData({ ...formData, close_date: e.target.value })
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='next_term_resumption_date'>
                Next term resumption date
              </Label>
              <Input
                id='next_term_resumption_date'
                type='date'
                value={formData.next_term_resumption_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    next_term_resumption_date: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className='flex items-start gap-2 rounded-md border px-3 py-2.5'>
            <Checkbox
              id='is-active'
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(checked === true)}
              className='mt-0.5'
            />
            <div>
              <Label htmlFor='is-active' className='cursor-pointer'>
                Set as active term
              </Label>
              <p className='text-xs text-muted-foreground'>
                Only one term can be active at a time - this replaces whichever
                term is currently active, and it&apos;s the term reports are
                generated against by default.
              </p>
            </div>
          </div>

          <Button type='submit' disabled={submitting} className='w-full'>
            {submitting ? 'Saving...' : isEdit ? 'Save changes' : 'Add section'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
