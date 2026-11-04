export interface PhotoItem {
  url: string
  caption: string
  placeholderColor?: string
}

export interface ReasonItem {
  id: string
  order: number
  text: string
  photoUrl?: string
}

export interface TimelineItem {
  id: string
  order: number
  date: string
  text: string
  icon: string
  character: string
}

export interface SiteContent {
  gateHint: string
  letter: string
  finalMessage: string
  songTitle: string
  songUrl: string
  bubuLines?: string[]
  reasons: ReasonItem[]
  timeline: TimelineItem[]
  photos: PhotoItem[]
}

export const DEFAULT_CONTENT: SiteContent = {
  gateHint: 'Hint: hamara pyara naam 🤍',
  letter: `Meri pyari Jaan,

Aaj tum 25 saal ki ho gayi ho, aur main bas yeh chahta tha ke tum jaano ke tum mere liye kya ho.

Subah ki pehli chai se le kar raat ki aakhri baat tak, tum meri zindagi ka sab se khoobsurat hissa ban chuki ho. Tumhari smile meri har thaki hui shaam ka sukoon hai, aur tumhari hansi meri favourite awaaz.

Mujhe pata hai ke humare beech faaslay bhi aate hain, par dil se hum hamesha saath hain. Tumne mujhe himmat di, mujhe behtar banaya, aur mere dil ko ek ghar diya.

Aaj tumhara din hai, meri Jaan. Bohot muskurana, bohot khush rehna, aur hamesha aise hi chamakti rehna.

Tumhara Ganda Bachha 🤍 (Mera Shehzada)`,
  finalMessage:
    'Maria, meri Jaan, 25 saal mubarak ho. Tum bohot khush rehna, bohot muskurana. Tumhara Ganda Bachha hamesha tumhare saath hai, inshallah. 🤍',
  songTitle: 'Dil Ibadat Kar Raha Hai',
  songUrl: '',
  bubuLines: [
    'Aaj sirf tumhara din hai, Maria!',
    'Mujhe pata hai tum muskura rahi ho 🤍',
    'Dudu ne kaha hai ke tum duniya ki sab se pyari ho.',
    'Chai bani hai, aa jao, thandi ho jayegi!',
    'Tum thak gayi ho? Chalo, thori der ruk jao, main yahin hoon.',
    'Meri taraf se ek bara sa hug 🤗',
    'Tum jitni pyari ho na, utni to meri chai bhi meethi nahi.',
    'Aaj koi tension nahi, sirf khushi.',
    'Dudu thora sharmila hai, par dil se tumse bohot pyaar karta hai.',
    'Sab kuch dekh lo, phir mujhe batana kya pasand aya.',
    'Tumhari smile meri favourite hai, Jaan.',
    '25 saal ki ho gayi ho, par dil se wohi pyari bacchi ho.',
    'Ek raaz ki baat: akhri screen mein ek surprise hai.',
  ],
  photos: [
    { url: '/api/photos/01', caption: 'Pencil Portrait — Tumhari pehli jhalak jo dil mein utar gayi 🤍', placeholderColor: '#FFE5EC' },
    { url: '/api/photos/02', caption: 'Teal Kurti — Woh pyari bangs aur tumhari maasoom smile ✨', placeholderColor: '#FFF0F3' },
    { url: '/api/photos/03', caption: 'Red Dupatta & Pink Wall — Waqt ruk gaya tha jab tumhein dekha 🕰️', placeholderColor: '#FFF5F0' },
    { url: '/api/photos/04', caption: 'Crisp White Shirt — Noor jaisi, clean and graceful 🤍', placeholderColor: '#FDF2F4' },
    { url: '/api/photos/05', caption: 'Peach Dupatta — Haya aur saadgi ka sab se pyara roop 🌸', placeholderColor: '#FFF1F2' },
    { url: '/api/photos/06', caption: 'Dolphin Ring — Hamara chota sa wada aur tumhara haath 💍', placeholderColor: '#FFE5EC' },
    { url: '/api/photos/07', caption: 'Sunset Rooftop — Tum, main, aur chai ka pyara ghunt ☕', placeholderColor: '#FFF0F3' },
    { url: '/api/photos/08', caption: 'Maroon & Silver Hoops — Meri classy Begum ka andaaz ✨', placeholderColor: '#FFF5F0' },
    { url: '/api/photos/09', caption: 'Phoolon ki Khushboo — Tumhare baalon mein gulab aur chehre pe noor 🌹', placeholderColor: '#FDF2F4' },
    { url: '/api/photos/10', caption: 'Pink Dupatta — Soch mein gum, par dil ke sab se kareeb 🌸', placeholderColor: '#FFF1F2' },
    { url: '/api/photos/11', caption: 'White Outfits — You & Me Always, ek jaisa sukoon 🤍', placeholderColor: '#FFE5EC' },
    { url: '/api/photos/12', caption: 'Side Profile — Chaand ka tukda jaisi tumhari saadgi 🌙', placeholderColor: '#FFF0F3' },
    { url: '/api/photos/13', caption: 'Soft Close-up — Meri Zindagi ki sab se pyari muskurahat 🤍', placeholderColor: '#FFF5F0' },
    { url: '/api/photos/14', caption: 'Advocate Maria — Tumhari mehnat aur library ke lambe din 📚⚖️', placeholderColor: '#FDF2F4' },
    { url: '/api/photos/15', caption: 'Courthouse Steps — Tumhara khwab jo bohot jald sach hoga 🏛️⚖️', placeholderColor: '#FFF1F2' },
    { url: '/api/photos/16', caption: 'Red Scarf & Eyes — Yeh aankhein dil jeet leti hain hamesha ✨', placeholderColor: '#FFE5EC' },
    { url: '/api/photos/17', caption: 'Meri favourite gaze — In aankhon mein mera jahan basta hai 🤍', placeholderColor: '#FFF0F3' },
    { url: '/api/photos/18', caption: 'Sabz Hawaayein — Azaadi, sukoon aur khuli fizayein 🌾🕊️', placeholderColor: '#FFF5F0' },
    { url: '/api/photos/19', caption: 'Nayi Subah — Tumhara udta dupatta aur khushgawar din 🌅✨', placeholderColor: '#FDF2F4' },
    { url: '/api/photos/20', caption: 'Chhupi hui Jaan — Parde mein bhi roshni nahi chhupti 🤍', placeholderColor: '#FFF1F2' },
    { url: '/api/photos/21', caption: 'Shaam ki Chai — Do cup, do dil, aur dher saari baatein ☕', placeholderColor: '#FFE5EC' },
    { url: '/api/photos/22', caption: 'Shehzadi & Shehzada — Hamari pyari daastan-e-ishq 👑✨', placeholderColor: '#FFF0F3' },
    { url: '/api/photos/23', caption: 'Pastel Flowers — Zindagi gulzar hai jab tum muskurao 🌸', placeholderColor: '#FFF5F0' },
    { url: '/api/photos/24', caption: 'Sukoon-e-Jaan — Jab tum mere paas hoti ho toh duniya thehr jaati hai 🤍', placeholderColor: '#FDF2F4' },
    { url: '/api/photos/25', caption: 'Aaj ki Maria — 25th Birthday, 5 November 2026. Hamesha khush raho Jaan 🎂🤍', placeholderColor: '#FFF1F2' },
  ],
  reasons: [
    { id: '1', order: 1, text: 'Tumhari smile meri har thaki hui shaam ka sukoon hai.', photoUrl: '/api/photos/01' },
    { id: '2', order: 2, text: 'Tum ho to chai bhi zyada meethi lagti hai ☕', photoUrl: '/api/photos/02' },
    { id: '3', order: 3, text: 'Tumne mujhe himmat di, Begum.', photoUrl: '/api/photos/03' },
    { id: '4', order: 4, text: 'Tumhari hansi meri favourite awaaz hai.', photoUrl: '/api/photos/04' },
    { id: '5', order: 5, text: 'Tum saath ho to ghar jaisa lagta hai.', photoUrl: '/api/photos/05' },
    { id: '6', order: 6, text: 'Tum mujhe behtar insaan banati ho.', photoUrl: '/api/photos/06' },
    { id: '7', order: 7, text: 'Tumhare saath khamoshi bhi pyari lagti hai.', photoUrl: '/api/photos/07' },
    { id: '8', order: 8, text: 'Tum meri Zindagi ho, aur mere dil ka Sukoon.', photoUrl: '/api/photos/08' },
    { id: '9', order: 9, text: 'Tumhari baatein sunna meri favourite aadat ban chuki hai.', photoUrl: '/api/photos/09' },
    { id: '10', order: 10, text: 'Tumhara gussa bhi bohot cute hota hai 🥺', photoUrl: '/api/photos/10' },
    { id: '11', order: 11, text: 'Tum mere har chote baday dukh ko bhula deti ho.', photoUrl: '/api/photos/11' },
    { id: '12', order: 12, text: 'Tumhari masoomiyat dil jeet leti hai.', photoUrl: '/api/photos/12' },
    { id: '13', order: 13, text: 'Jab tum "Ganda Bachha" kehti ho, dil pighal jaata hai.', photoUrl: '/api/photos/13' },
    { id: '14', order: 14, text: 'Lambi calls mein jab tum so jaati ho, woh lamha anmol hota hai.', photoUrl: '/api/photos/14' },
    { id: '15', order: 15, text: 'Tum meri har dua mein shamil rehti ho.', photoUrl: '/api/photos/15' },
    { id: '16', order: 16, text: 'Tumhara care karna mujhe hamesha mehfooz feel karata hai.', photoUrl: '/api/photos/16' },
    { id: '17', order: 17, text: 'Tumhara favourite colour white hai, aur tum khud noor jaisi ho 🤍', photoUrl: '/api/photos/17' },
    { id: '18', order: 18, text: 'Tumhare baghair sab kuch adhoora lagta hai.', photoUrl: '/api/photos/18' },
    { id: '19', order: 19, text: 'Tum mere khwabon ko apni umeed bana leti ho.', photoUrl: '/api/photos/19' },
    { id: '20', order: 20, text: 'Tumhari har choti baat mere liye maayne rakhti hai.', photoUrl: '/api/photos/20' },
    { id: '21', order: 21, text: 'Tum meri sab se achi dost aur meri Begum ho.', photoUrl: '/api/photos/21' },
    { id: '22', order: 22, text: 'Tumhare saath waqt kitni jaldi guzar jata hai pata hi nahi chalta.', photoUrl: '/api/photos/22' },
    { id: '23', order: 23, text: 'Tum meri aankhon mein khushi dekhna chahti ho.', photoUrl: '/api/photos/23' },
    { id: '24', order: 24, text: 'Tum meri taqat aur meri kamzori dono ho.', photoUrl: '/api/photos/24' },
    { id: '25', order: 25, text: 'Kyunkay Maria, tum jaisi poori dunya mein koi nahi hai 🤍', photoUrl: '/api/photos/25' },
  ],
  timeline: [
    {
      id: '1',
      order: 1,
      date: '8 Sept',
      text: 'Pehli mulaqat. Mujhe nahi pata tha ke meri zindagi badalne wali hai.',
      icon: '🌟',
      character: 'dudu-bubu-box',
    },
    {
      id: '2',
      order: 2,
      date: 'Nashta',
      text: 'Subah subah meetha chawal, chane aur naan. Aur Rehan bhi saath tha 😄',
      icon: '🍚',
      character: 'dudu-bubu-nashta',
    },
    {
      id: '3',
      order: 3,
      date: 'Chai',
      text: 'Tumhare liye chai lana meri favourite aadat ban gayi ☕',
      icon: '☕',
      character: 'dudu-bubu-chai',
    },
    {
      id: '4',
      order: 4,
      date: 'IT room',
      text: 'Saath baith ke baatein, hansi, aur bohot saari yaadein.',
      icon: '💻',
      character: 'dudu-bubu-hug',
    },
    {
      id: '5',
      order: 5,
      date: 'Calls',
      text: 'Lambi calls, lambi video calls… neend bhi baad mein.',
      icon: '📱',
      character: 'dudu-bubu-hug',
    },
    {
      id: '6',
      order: 6,
      date: '25 Sept',
      text: 'Tum chali gayi, magar dil wahin reh gaya.',
      icon: '🌧️',
      character: 'bubu-sad',
    },
    {
      id: '7',
      order: 7,
      date: '15 Oct',
      text: 'Us din tumne mujhe bohot special mehsoos karaya.',
      icon: '💌',
      character: 'dudu-bubu-hug',
    },
    {
      id: '8',
      order: 8,
      date: '5 Nov',
      text: 'Aaj tumhara din hai, meri Jaan. Happy 25th Birthday 🎂',
      icon: '🎂',
      character: 'dudu-bubu-bday',
    },
  ],
}

