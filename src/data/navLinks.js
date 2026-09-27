import { User, Briefcase, FolderGit2, GraduationCap, Mail } from 'lucide-react';

// Single source of truth for section nav: the desktop link row and the phone
// dock both read from this list, in the page's own scroll order. Hero is not
// here — the wordmark returns to it.
//
// `dock: false` keeps a link out of the phone dock, which has room for five
// thumb-sized tabs and no more. Skills is a short section between two that are
// in the dock, so it is reachable by scrolling either way.
export const LINKS = [
  { id: 'projects', label: 'Work', icon: FolderGit2 },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'skills', label: 'Skills', dock: false },
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

// The CV, as a file in public/. Named for the person saving it, not for us:
// "cv.pdf" in a downloads folder full of them tells a recruiter nothing.
export const CV_URL = `${import.meta.env.BASE_URL}Abdulla_Alasmawi_CV.pdf`;
