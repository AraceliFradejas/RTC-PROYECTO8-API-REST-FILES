const source = {
  label: 'Setlist.fm - The Eras Tour average setlist',
  url: 'https://www.setlist.fm/stats/average-setlist/taylor-swift-3bd6bc5c.html?tour=6bde5e4e',
  accessedAt: new Date('2026-08-27')
}

const createSongs = (album, era, releaseYear, titles) =>
  titles.map((title) => ({
    title,
    artist: 'Taylor Swift',
    album,
    era,
    releaseYear,
    sources: [source]
  }))

export const songSeedData = [
  ...createSongs('Fearless', 'Fearless', 2008, [
    'Fearless',
    'You Belong With Me',
    'Love Story'
  ]),
  ...createSongs('Speak Now', 'Speak Now', 2010, [
    'Enchanted',
    'Long Live'
  ]),
  ...createSongs('Red', 'Red', 2012, [
    '22',
    'We Are Never Ever Getting Back Together',
    'I Knew You Were Trouble'
  ]),
  ...createSongs("Red (Taylor's Version)", 'Red', 2021, [
    'All Too Well (10 Minute Version)'
  ]),
  ...createSongs('1989', '1989', 2014, [
    'Style',
    'Blank Space',
    'Shake It Off',
    'Wildest Dreams',
    'Bad Blood'
  ]),
  ...createSongs('reputation', 'reputation', 2017, [
    '...Ready for It?',
    'Delicate',
    "Don't Blame Me",
    'Look What You Made Me Do'
  ]),
  ...createSongs('Lover', 'Lover', 2019, [
    'Miss Americana & the Heartbreak Prince',
    'Cruel Summer',
    'The Man',
    'You Need to Calm Down',
    'Lover',
    'The Archer'
  ]),
  ...createSongs('folklore', 'folklore', 2020, [
    'the 1',
    'cardigan',
    'the last great american dynasty',
    'my tears ricochet',
    'seven',
    'august',
    'illicit affairs',
    'invisible string',
    'betty'
  ]),
  ...createSongs('evermore', 'evermore', 2020, [
    'willow',
    'champagne problems',
    "'tis the damn season",
    'tolerate it',
    'no body, no crime',
    'marjorie'
  ]),
  ...createSongs('Midnights', 'Midnights', 2022, [
    'Lavender Haze',
    'Anti-Hero',
    'Midnight Rain',
    'Vigilante Shit',
    'Bejeweled',
    'Mastermind',
    'Karma'
  ]),
  ...createSongs('The Tortured Poets Department', 'TTPD', 2024, [
    'But Daddy I Love Him',
    'So High School',
    "Who's Afraid of Little Old Me?",
    'Down Bad',
    'Fortnight',
    'The Smallest Man Who Ever Lived',
    'I Can Do It With a Broken Heart',
    'Florida!!!'
  ]),
  ...createSongs("Red (Taylor's Version)", 'Red', 2021, ['Nothing New'])
]
