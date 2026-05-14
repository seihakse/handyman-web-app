// src/app/api/admin/categories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// PATCH /api/admin/categories/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, description } = await req.json();

    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
      return NextResponse.json({ error: 'Category name cannot be empty' }, { status: 400 });
    }

    if (name) {
      const conflict = await prisma.serviceCategory.findFirst({
        where: { name: name.trim(), NOT: { id } },
      });
      if (conflict) {
        return NextResponse.json({ error: 'A category with this name already exists' }, { status: 409 });
      }
    }

    const updated = await prisma.serviceCategory.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && { description: description.trim() || null }),
      },
    });

    return NextResponse.json({ category: updated });
  } catch (error) {
    console.error('[PATCH /api/admin/categories/[id]]', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE /api/admin/categories/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.handymanProfile.updateMany({
      where: { categoryId: id },
      data: { categoryId: null },
    });

    await prisma.serviceCategory.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/admin/categories/[id]]', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}