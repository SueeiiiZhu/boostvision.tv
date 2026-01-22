"use client";

import React from 'react';
import { useQRCode } from 'next-qrcode';
import { cn } from '@/lib/utils';

interface QRCodeProps {
  data: string;
  size?: number;
  className?: string;
  label?: string;
}

export function QRCode({ data, size = 150, className, label }: QRCodeProps) {
  const { Canvas } = useQRCode();

  if (!data) return null;

  return (
    <div className={cn(
      "p-3 bg-white shadow-2xl rounded-2xl border border-gray-100 flex flex-col items-center",
      className
    )}>
      <div className="relative overflow-hidden rounded-lg flex items-center justify-center" style={{ width: size, height: size }}>
        <Canvas
          text={data}
          options={{
            errorCorrectionLevel: 'M', // 使用 M 级别纠错，避免过于密集
            margin: 2,
            scale: 4,
            width: size,
            color: {
              dark: '#000d24', // 匹配主题 heading 颜色
              light: '#ffffff',
            },
          }}
        />
      </div>
      {label && (
        <div className="mt-2 text-[12px] font-black text-heading uppercase tracking-wider whitespace-nowrap">
          {label}
        </div>
      )}
      {/* Arrow pointing up */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45"></div>
    </div>
  );
}
