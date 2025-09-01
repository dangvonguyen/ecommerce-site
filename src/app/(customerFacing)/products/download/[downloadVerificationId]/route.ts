import fs from 'fs/promises';

import { and, eq, gt } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db, downloadVerifications } from '@/db';


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ downloadVerificationId: string }> }
) {
  const { downloadVerificationId } = await params;
  const data = await db.query.downloadVerifications.findFirst({
    columns: {},
    where: and(
      eq(downloadVerifications.id, downloadVerificationId),
      gt(downloadVerifications.expiresAt, new Date())
    ),
    with: {
      product: {
        columns: { name: true, filePath: true },
      },
    },
  });

  if (data == null) {
    return NextResponse.redirect(
      new URL('/products/download/expired', req.url)
    );
  }

  const { size } = await fs.stat(data.product.filePath);
  const file = await fs.readFile(data.product.filePath);
  const extension = data.product.filePath.split('.').pop();

  return new NextResponse(new Uint8Array(file), {
    headers: {
      'Content-Disposition': `attachment; filename="${data.product.name}.${extension}"`,
      'Content-Length': size.toString(),
      'Content-Type': 'application/octet-stream',
    },
  });
}
