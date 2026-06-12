const YOUTUBE = {
  channel: "https://www.youtube.com/@shravilifeinabroad",
  subscribe: "https://www.youtube.com/@shravilifeinabroad?sub_confirmation=1",
  handle: "shravilifeinabroad",
};

// `thumb` is the video ID of each playlist's lead video — used to build
// real YouTube thumbnail URLs for cards and the inline player poster.
const SERIES = [
  {
    id: "PL1fmFICKiHAEihBf0hBbWnNh_jjapaY4n",
    title: "Portugal Series",
    region: "europe",
    flag: "🇵🇹",
    thumb: "U9AVXL3ZSd8",
    desc: "Coastlines, cities, and culture across Portugal.",
  },
  {
    id: "PL1fmFICKiHAHjaYi8g9uZKRuOn1-bR9Kl",
    title: "Spain Series",
    region: "europe",
    flag: "🇪🇸",
    thumb: "zRk-_lJ_YeQ",
    desc: "Spanish adventures, food, and unforgettable stops.",
  },
  {
    id: "PL1fmFICKiHAEyYV6XWHSmgS8tM5GADiJY",
    title: "India 2025",
    region: "asia",
    flag: "🇮🇳",
    thumb: "I97ipOKgRRE",
    desc: "Family, festivals, and travel across India in 2025.",
  },
  {
    id: "PL1fmFICKiHAEyYutXsQFG-zUjk6gpMNDz",
    title: "Paris Series",
    region: "europe",
    flag: "🇫🇷",
    thumb: "HSFwa4FLrKs",
    desc: "Streets, sights, and everyday magic in Paris.",
  },
  {
    id: "PL1fmFICKiHAHQbFrpZN-d1W3z_Xb-W-Y9",
    title: "Switzerland Series",
    region: "europe",
    flag: "🇨🇭",
    thumb: "1f7XliL1bu8",
    desc: "Alpine views, trains, and Swiss city escapes.",
  },
  {
    id: "PL1fmFICKiHAHr_IbaLVipASemtOTEDEHC",
    title: "Italy Series",
    region: "europe",
    flag: "🇮🇹",
    thumb: "tFDF0Q9-zbM",
    desc: "Italian food, history, and scenic road-trip moments.",
  },
  {
    id: "PL1fmFICKiHAG94wzaMXeWvc6r12skEfqo",
    title: "Tromsø Series",
    region: "europe",
    flag: "🇳🇴",
    thumb: "ioOFl9upwz8",
    desc: "Northern lights, Arctic views, and winter adventures in Tromsø.",
    featured: true,
  },
  {
    id: "PL1fmFICKiHAHQiA6fEqz5e9Rm5dLrK4kx",
    title: "Kawaguchiko Series",
    region: "japan",
    flag: "🇯🇵",
    thumb: "D7HwlxuoJ6c",
    desc: "Lake Kawaguchi, Mount Fuji views, and lakeside adventures.",
  },
  {
    id: "PL1fmFICKiHAFk-Q5w3vO1h2232lUrm3aG",
    title: "Hokkaido Series",
    region: "japan",
    flag: "🇯🇵",
    thumb: "NN8KR5vazsc",
    desc: "Snow, seafood, and northern Japan road-trip vibes.",
  },
  {
    id: "PL1fmFICKiHAHPW4xvri-NwJxoiadcUinu",
    title: "Osaka–Nara Series",
    region: "japan",
    flag: "🇯🇵",
    thumb: "ikdbTeFRpCg",
    desc: "Street food, temples, deer parks, and city hopping.",
  },
  {
    id: "PL1fmFICKiHAFHyvlWOCSCCmQlcQA07bD7",
    title: "Tokyo Disney Sea",
    region: "japan",
    flag: "🇯🇵",
    thumb: "emmjOp0P84w",
    desc: "Theme park magic, rides, and a full day of Disney fun.",
  },
  {
    id: "PL1fmFICKiHAF-ghw1s3Kd_kowDxoMeX2D",
    title: "Okinawa Series",
    region: "japan",
    flag: "🇯🇵",
    thumb: "kRaGXIwqtJ4",
    desc: "Beaches, islands, and tropical Japan getaways.",
  },
  {
    id: "PL1fmFICKiHAFcUoaX6aHtNIBKEiIKNo2_",
    title: "Pregnancy in Germany",
    region: "life",
    flag: "🇩🇪",
    thumb: "ydBGEAzjXgQ",
    desc: "Healthcare, culture, and expat life while expecting in Germany.",
  },
];

const REGION_LABELS = {
  europe: "Europe",
  japan: "Japan",
  asia: "Asia",
  life: "Life abroad",
};

function playlistUrl(id) {
  return `https://www.youtube.com/playlist?list=${id}`;
}

function embedUrl(id) {
  return `https://www.youtube.com/embed/videoseries?list=${id}`;
}

// size: "mq" = 320×180 (16:9, cards), "hq" = 480×360 (poster/spotlight)
function thumbUrl(item, size = "hq") {
  return `https://i.ytimg.com/vi/${item.thumb}/${size}default.jpg`;
}
