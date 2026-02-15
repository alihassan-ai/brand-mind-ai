"use client";

import { Plus } from "lucide-react";
import { useGoalStore } from "@/store/goalStore";

// Define the expected shape of the goal store state for type safety
interface GoalStoreState {
    openModal: () => void;
    // Add other state properties if they exist in your store, e.g.:
    // isModalOpen: boolean;
    // goals: any[];
}

export function NewGoalButton() {
    // Explicitly type the state parameter when accessing the store
    const openModal = useGoalStore((state: GoalStoreState) => state.openModal);

    // The onClick handler's type is inferred correctly from `openModal` which is a function.
    // If `openModal` needed to accept an event, its type would be `React.MouseEvent<HTMLButtonElement>`.
    return (
        <button
            onClick={openModal}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-foreground)] font-clash font-bold text-sm transition-all duration-300 shadow-[var(--shadow-primary)]"
        >
            <Plus className="w-4 h-4" />
            New Goal
        </button>
    );
}
