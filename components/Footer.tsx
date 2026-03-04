import { Heart } from "lucide-react";

/**
 * Credits, "Made with love", and social links footer.
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
      <ul className="footer-social-icons" aria-label="Social links">
        <li>
          <a href="https://x.com/raimonvibe/" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
            <i className="fa-brands fa-xl fa-x-twitter" aria-hidden />
          </a>
        </li>
        <li>
          <a href="https://www.youtube.com/channel/UCDGDNuYb2b2Ets9CYCNVbuA/videos/" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <i className="fa-brands fa-xl fa-youtube" aria-hidden />
          </a>
        </li>
        <li>
          <a href="https://www.tiktok.com/@raimonvibe/" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <i className="fa-brands fa-xl fa-tiktok" aria-hidden />
          </a>
        </li>
        <li>
          <a href="https://www.instagram.com/raimonvibe/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i className="fa-brands fa-xl fa-instagram" aria-hidden />
          </a>
        </li>
        <li>
          <a href="https://medium.com/@raimonvibe/" target="_blank" rel="noopener noreferrer" aria-label="Medium">
            <i className="fa-brands fa-xl fa-medium" aria-hidden />
          </a>
        </li>
        <li>
          <a href="https://github.com/raimonvibe/" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <i className="fa-brands fa-xl fa-github" aria-hidden />
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/raimonvibe/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <i className="fa-brands fa-xl fa-linkedin-in" aria-hidden />
          </a>
        </li>
        <li>
          <a href="https://www.facebook.com/profile.php?id=61563450007849" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <i className="fa-brands fa-xl fa-facebook-f" aria-hidden />
          </a>
        </li>
        <li>
          <a href="mailto:info@raimonvibe.com" aria-label="Email">
            <i className="fa-solid fa-xl fa-envelope" aria-hidden />
          </a>
        </li>
      </ul>
    </footer>
  );
}
