// src/app/api/admin/categories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// PATCH /api/admin/categories/[id]
// Body: { name?: string, description?: string }
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, description } = await req.json();

    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
      return NextResponse.json({ error: 'Category name cannot be empty' }, { status: 400 });
    }

    // Check for name conflict on rename
    if (name) {
      const conflict = await prisma.serviceCategory.findFirst({
        where: { name: name.trim(), NOT: { id: params.id } },
      });
      if (conflict) {
        return NextResponse.json({ error: 'A category with this name already exists' }, { status: 409 });
      }
    }

    const updated = await prisma.serviceCategory.update({
      where: { id: params.id },
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
// Sets categoryId = null on all associated handyman_profiles before deleting
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Unlink handymen first (FK is SetNull but safer to be explicit)
    await prisma.handymanProfile.updateMany({
      where: { categoryId: params.id },
      data: { categoryId: null },
    });

    await prisma.serviceCategory.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/admin/categories/[id]]', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}