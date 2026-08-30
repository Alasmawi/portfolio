import { User, Briefcase, FolderGit2, GraduationCap } from 'lucide-react';

// Single source of truth for section nav: the desktop link row and the
// mobile sheet both read from this list so they can't drift out of sync
// with each other or with the section ids rendered in App.jsx. Order
// matches the page's own scroll order. Hero and Contact aren't here —
// the wordmark returns to the hero, and the CTA button goes to contact.
export const LINKS = [
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'about', label: 'About', icon: User },
];

// Every section either navigation can highlight — LINKS plus contact, which
// only the mobile tab bar carries. App observes this union once and passes the
// active id to both; each ignores the ids it doesn't render.
export const SECTION_IDS = [...LINKS.map((l) => l.id), 'contact'];
