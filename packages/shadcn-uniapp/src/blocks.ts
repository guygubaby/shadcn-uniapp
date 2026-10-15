export const blocks = [
  {
    name: 'profile-card',
    title: 'Profile card',
    description: 'Profile details, workspace, and an edit action.',
    files: ['ProfileCard.vue'],
  },
  {
    name: 'settings-form',
    title: 'Preferences',
    description: 'Email, notifications, and local form validation.',
    files: ['SettingsForm.vue'],
  },
  {
    name: 'filter-list',
    title: 'Filter list',
    description: 'Instant filtering, empty states, and item selection.',
    files: ['FilterList.vue'],
  },
] as const

export type BlockName = (typeof blocks)[number]['name']
