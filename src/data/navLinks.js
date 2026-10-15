import { User, Briefcase, FolderGit2, GraduationCap, Mail } from 'lucide-react';

// Single source of truth for section nav: the desktop link row and the phone
// dock both read from this list, in the page's own scroll order. Hero is not
// here — the wordmark returns to it.
//
// `dock: false` keeps a link out of the phone dock, which has room for five
// thumb-sized tabs and no more.
export const LINKS = [
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'about', label: 'About', icon: User },
];

export const DOCK_LINKS = [
  ...LINKS.filter((l) => l.dock !== false),
  { id: 'contact', label: 'Contact', icon: Mail, cta: true },
];

// Every section the page has, observed once in App. Hero and Focus are in it
// so that scrolling back to the top clears the highlight — without them the
// last link lit on the way down stayed lit over the hero, and the very first
// view of the page showed "Work" as current before anyone had scrolled.
export const SECTION_IDS = ['hero', 'focus', ...LINKS.map((l) => l.id), 'contact'];

// The CV lives in Dropbox, so it can be updated without touching the site:
// upload a new file with the same name to the same folder, choose Replace, and
// every "Download CV" button serves the new one. `dl=1` makes Dropbox send it
// as a download (as Abdulla_Alasmawi_CV.pdf) rather than open its preview page.
//
// The old address on this site, /Abdulla_Alasmawi_CV.pdf, redirects here (see
// vercel.json), so links to it shared before the move get the current CV too.
export const CV_URL =
  'https://www.dropbox.com/scl/fi/cysq8ud29lf1rxx32233i/Abdulla_Alasmawi_CV.pdf?rlkey=3lljq72npsgam3t6uzm77qpbf&st=4ducr8qq&dl=1';
