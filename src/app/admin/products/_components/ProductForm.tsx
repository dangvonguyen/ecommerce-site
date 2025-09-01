'use client';

import { Button, Input, Label, Textarea } from '@/components/ui';
import { formatCurrency } from '@/lib/formatter';
import { useActionState, useState } from 'react';
import { addProduct, updateProduct } from '../../_actions/product';
import { useFormStatus } from 'react-dom';
import { products } from '@/db/schema';
import Image from 'next/image';

export function ProductForm({
  product,
}: {
  product?: typeof products.$inferSelect;
}) {
  const [state, formAction] = useActionState(
    product == null ? addProduct : updateProduct.bind(null, product.id),
    {
      data: {
        name: product?.name || '',
        priceInCents: product?.priceInCents || 0,
        description: product?.description || '',
        file: null,
        image: null,
      },
      errors: {},
    }
  );
  const [priceInCents, setPriceInCents] = useState(product?.priceInCents || undefined);

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
          value={priceInCents}
          onChange={(e) => setPriceInCents(Number(e.target.value) || undefined)}
        />
        <div className="text-muted-foreground">
          {' '}
          {formatCurrency((priceInCents || 0) / 100)}{' '}
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
        <Input type="file" id="file" name="file" required={product == null} />
        {product != null && (
          <div className="text-muted-foreground">{product.filePath}</div>
        )}
        {state.errors.file && (
          <div className="text-destructive">{state.errors.file}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" name="image" required={product == null} />
        {product != null && (
          <div className="flex justify-around">
            <Image
              src={product.imagePath}
              height="400"
              width="400"
              style={{ width: 'auto', height: 'auto' }}
              alt="Product Image"
              priority
            />
          </div>
        )}
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
