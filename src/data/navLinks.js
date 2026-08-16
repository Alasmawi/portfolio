import {
  User,
  Briefcase,
  FolderGit2,
  BarChart3,
  GraduationCap,
  Mail,
} from 'lucide-react';

// Single source of truth for section nav: the desktop nav, the mobile
// hamburger dropdown, and the mobile bottom tab bar all read from this list
// so they can never drift out of sync with each other or with the actual
// section ids rendered in App.jsx.
export const LINKS = [
  { id: 'about', label: 'about', icon: User },
  { id: 'experience', label: 'experience', icon: Briefcase },
  { id: 'projects', label: 'projects', icon: FolderGit2 },
  { id: 'skills', label: 'skills', icon: BarChart3 },
  { id: 'education', label: 'education', icon: GraduationCap },
  { id: 'contact', label: 'contact', icon: Mail },
];
