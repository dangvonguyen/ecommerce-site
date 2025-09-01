'use client';

import { useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { DropdownMenuItem } from '@/components/ui/DropdownMenu';

import { deleteOrder } from '../../_actions/orders';


export function DeleteDropDownItem({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await deleteOrder(id);
          router.refresh();
        })
      }
    >
      Delete
    </DropdownMenuItem>
  );
}
