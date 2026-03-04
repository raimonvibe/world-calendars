import { Heart } from "lucide-react";

/**
 * Credits and "Made with love" footer.
 */
export default function Footer() {
  return (
    <footer className="mt-12 border-t border-zinc-200/60 py-6 text-center text-sm text-zinc-500 dark:border-zinc-700/50 dark:text-zinc-400">
      <p className="break-words px-2">
        World Calendar Hub — today&apos;s date across 18 calendars. No login, no database — just pure math and UI.
      </p>
      <p className="mt-1 flex items-center justify-center gap-1">
        <Heart className="size-4 fill-current" aria-hidden />
        Made with love for calendar enthusiasts.
      </p>
    </footer>
  );
}
