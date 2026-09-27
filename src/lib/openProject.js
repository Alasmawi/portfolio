import { scrollToSection } from './scrollToSection';

// Opens a project's dialog from anywhere on the page — the hero's trace panel,
// the focus cards, an experience entry — without threading state through App.
// ProjectBrowser listens for the event and owns the dialog; everyone else just
// names the project.
export const OPEN_PROJECT_EVENT = 'portfolio:open-project';

export function openProject(id) {
  scrollToSection('projects');
  // After the scroll has started, so the dialog opens over the section it
  // belongs to rather than over wherever the reader clicked from.
  window.setTimeout(() => {
    window.dispatchEvent(new CustomEvent(OPEN_PROJECT_EVENT, { detail: { id } }));
  }, 350);
}
