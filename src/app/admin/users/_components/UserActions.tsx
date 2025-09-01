'use client';

import { useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { DropdownMenuItem } from '@/components/ui/DropdownMenu';

import { deleteUser } from '../../_actions/users';


export function DeleteDropDownItem({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await deleteUser(id);
          router.refresh();
        })
      }
    >
      Delete
    </DropdownMenuItem>
  );
}
