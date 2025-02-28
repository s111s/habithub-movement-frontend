"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const RowModal = ({ title, children, isOpen, onClose }: { title: string; children: React.ReactNode; isOpen: boolean; onClose: () => void; }) => {

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-[100] w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-lg p-6",
            "dark:bg-gray-900"
          )}
        >
          <div className="flex justify-between items-center border-b pb-3">
            <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
            <button className="rounded-md p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" onClick={onClose}>
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center space-x-4">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export { RowModal };
