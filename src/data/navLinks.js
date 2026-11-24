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

export const EMAIL = 'asmawiabdulla0@gmail.com';

// The CV isn't downloadable from the site. Every CV button opens an email
// asking for it, so I know who has it and can send the current version.
// A mailto link also works inside LinkedIn's in-app browser, which crashed
// on the old direct download.
const CV_SUBJECT = 'CV request';
const CV_BODY = 'Hi Abdulla,\n\nCould you send me your CV?\n\nName:\nCompany:\nRole:\n';
export const CV_REQUEST_URL = `mailto:${EMAIL}?subject=${encodeURIComponent(CV_SUBJECT)}&body=${encodeURIComponent(CV_BODY)}`;
