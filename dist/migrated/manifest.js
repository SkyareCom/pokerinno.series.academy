export const migratedAcademyModules={
  status:'IMPORTED_NOT_WIRED',
  source:'SkyareCom/stackup.academy-original@feat/pokerino-ludic-front',
  rule:'Preserve Pokerinno visual structure, cards, positions and navigation. Migrate system modules first and wire them one by one.',
  modules:[
    'content/academy-course-map.js',
    'services/content-service.js',
    'services/progress-service.js',
    'services/training-history-service.js',
    'services/evolution-service.js',
    'services/plan-access-service.js',
    'services/training-preference-service.js',
    'screens/practice-tools-screen.js',
    'screens/study-tools-screen.js',
    'screens/profile-screen.js',
    'screens/stage-screen.js'
  ]
};
