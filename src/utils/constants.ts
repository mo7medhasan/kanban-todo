
import { Column } from '@/types/task.types';

export const COLUMNS: Column[] = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' }
];

export const INITIAL_TASKS = [
  {
    id: '1',
    title: 'Design login page',
    description: 'Create a mockup for the new login page',
    column: 'backlog' as const
  },
  {
    id: '2',
    title: 'Draft user survey',
    description: 'Prepare questions for the user feedback survey',
    column: 'backlog' as const
  },
  {
    id: '3',
    title: 'Implement authentication',
    description: 'Add OAuth2 support for user logins',
    column: 'in-progress' as const
  },
  {
    id: '4',
    title: 'Update dependencies',
    description: 'Upgrade project to use latest libraries',
    column: 'in-progress' as const
  },
  {
    id: '5',
    title: 'Code cleanup',
    description: 'Refactor code to improve readability',
    column: 'review' as const
  },
  {
    id: '6',
    title: 'Write documentation',
    description: 'Document the API endpoints and usage',
    column: 'review' as const
  },
  {
    id: '7',
    title: 'Fix login bug',
    description: 'Resolve the issue with login errors',
    column: 'done' as const
  },
  {
    id: '8',
    title: 'Deploy to production',
    description: 'Push the latest changes to the live server',
    column: 'done' as const
  }
];