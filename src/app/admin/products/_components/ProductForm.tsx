'use client';

import { Button, Input, Label, Textarea } from '@/components/ui';
import { formatCurrency } from '@/lib/formatter';
import { useActionState } from 'react';
import { addProduct } from '../../_actions/product';
import { useFormStatus } from 'react-dom';

export function ProductForm() {
  const [state, formAction] = useActionState(addProduct, {
    data: {
      name: '',
      priceInCents: 0,
      description: '',
      file: null,
      image: null,
    },
    errors: {},
  });

  return (
    <form action={formAction} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          defaultValue={state.data.name}
          required
        />
        {state.errors.name && (
          <div className="text-destructive">{state.errors.name}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceInCents">Price In Cents</Label>
        <Input
          type="number"
          id="priceInCents"
          name="priceInCents"
          required
          defaultValue={state.data.priceInCents}
        />
        <div className="text-muted-foreground">
          {' '}
          {formatCurrency(state.data.priceInCents / 100)}{' '}
        </div>
        {state.errors.priceInCents && (
          <div className="text-destructive">{state.errors.priceInCents}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={state.data.description}
          required
        />
        {state.errors.description && (
          <div className="text-destructive">{state.errors.description}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input type="file" id="file" name="file" required />
        {state.errors.file && (
          <div className="text-destructive">{state.errors.file}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" name="image" required />
        {state.errors.image && (
          <div className="text-destructive">{state.errors.image}</div>
        )}
      </div>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </Button>
  );
}
