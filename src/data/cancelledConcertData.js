const viennaNote =
  'Las tres fechas de Viena fueron canceladas después de que las autoridades austríacas confirmaran la detención de sospechosos vinculados a un plan de atentado contra los conciertos. Tras la cancelación, numerosos swifties se reunieron en calles de Viena, especialmente en Corneliusgasse, para cantar y compartir pulseras de la amistad.'

const sources = [
  {
    label: 'Wikipedia - The Eras Tour: cancelled Vienna shows',
    url: 'https://en.wikipedia.org/wiki/The_Eras_Tour#Cancelled_shows',
    accessedAt: '2026-08-27'
  },
  {
    label: 'Euronews - Vienna concerts cancelled after police foil plot',
    url: 'https://www.euronews.com/my-europe/2024/08/07/two-held-on-suspicion-of-plotting-attack-on-taylor-swift-concert-in-vienna',
    accessedAt: '2026-08-27'
  },
  {
    label: 'Billboard - Fans sing in the streets of Vienna',
    url: 'https://www.billboard.com/music/music-news/taylor-swift-fans-sing-vienna-streets-eras-tour-shows-canceled-1235749372/',
    accessedAt: '2026-08-27'
  }
]

export const cancelledConcertData = [
  {
    date: '2024-08-08',
    city: 'Vienna',
    country: 'Austria',
    venue: 'Ernst-Happel-Stadion',
    openingActs: ['Paramore'],
    status: 'cancelled',
    reason: 'Security threat',
    notes: viennaNote,
    communityImage: null,
    sources
  },
  {
    date: '2024-08-09',
    city: 'Vienna',
    country: 'Austria',
    venue: 'Ernst-Happel-Stadion',
    openingActs: ['Paramore'],
    status: 'cancelled',
    reason: 'Security threat',
    notes: viennaNote,
    communityImage: null,
    sources
  },
  {
    date: '2024-08-10',
    city: 'Vienna',
    country: 'Austria',
    venue: 'Ernst-Happel-Stadion',
    openingActs: ['Paramore'],
    status: 'cancelled',
    reason: 'Security threat',
    notes: viennaNote,
    communityImage: null,
    sources
  }
]
