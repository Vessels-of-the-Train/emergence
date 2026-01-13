'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold过渡-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                default:
                    'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
                secondary:
                    'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
                destructive:
                    'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
                outline: 'text-foreground',
                neon: 'border-[#00f0ff]/50 bg-[#00f0ff]/10 text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.15)]',
                'neon-purple': 'border-[#b794f6]/50 bg-[#b794f6]/10 text-[#b794f6] shadow-[0_0_10px_rgba(183,148,246,0.15)]',
                'neon-orange': 'border-[#ff9900]/50 bg-[#ff9900]/10 text-[#ff9900] shadow-[0_0_10px_rgba(255,153,0,0.15)]',
                glass: 'border-white/20 bg-white/10 text-white backdrop-blur-sm',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
