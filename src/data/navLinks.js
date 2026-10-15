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

// The CV opens a page on this site (public/cv.html) rather than linking to the
// file. LinkedIn's in-app browser, and others like it, crash or do nothing on a
// link that answers with a download; the page starts the download in a normal
// browser and offers a viewer in an in-app one. The file itself lives in
// Dropbox and is replaced there, so updating it needs no change here.
//
// No `download` attribute on the links: this is a page, not the file.
export const CV_URL = '/cv';
