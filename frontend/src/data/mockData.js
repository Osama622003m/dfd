// Mock data for manga reader template
export const mockMangas = [
  {
    id: "1",
    title: "أسطورة الساموراي المفقود",
    englishTitle: "Lost Samurai Legend",
    description: "قصة ملحمية عن ساموراي شاب يسعى لاستعادة شرف عائلته المفقود في عالم مليء بالسحر والخطر",
    coverImage: "https://picsum.photos/300/400?random=1",
    genres: ["أكشن", "مغامرة", "فانتازيا"],
    status: "مستمر",
    rating: 4.8,
    totalChapters: 45,
    views: 125000,
    author: "هيروشي تاناكا",
    lastUpdated: "2025-01-15",
    chapters: [
      {
        id: "ch1",
        number: 1,
        title: "البداية",
        pages: 24,
        releaseDate: "2024-01-01",
        images: Array.from({length: 24}, (_, i) => `https://picsum.photos/800/1200?random=${i+1}`)
      },
      {
        id: "ch2", 
        number: 2,
        title: "القوة المخفية",
        pages: 28,
        releaseDate: "2024-01-08",
        images: Array.from({length: 28}, (_, i) => `https://picsum.photos/800/1200?random=${i+25}`)
      }
    ]
  },
  {
    id: "2",
    title: "أكاديمية الأبطال الخارقين",
    englishTitle: "Heroes Academy",
    description: "في عالم حيث يمتلك 80% من السكان قوى خارقة، يحلم فتى بلا قوى ليصبح البطل الأعظم",
    coverImage: "https://picsum.photos/300/400?random=2",
    genres: ["أكشن", "مدرسي", "خارق"],
    status: "مكتمل",
    rating: 4.9,
    totalChapters: 322,
    views: 2500000,
    author: "كوهي هوريكوشي",
    lastUpdated: "2024-12-20",
    chapters: [
      {
        id: "ch1-2",
        number: 1,
        title: "ولادة بطل",
        pages: 20,
        releaseDate: "2023-01-01",
        images: Array.from({length: 20}, (_, i) => `https://picsum.photos/800/1200?random=${i+50}`)
      }
    ]
  },
  {
    id: "3",
    title: "مملكة الظلال",
    englishTitle: "Shadow Kingdom",
    description: "أمير منفي يعود لاستعادة مملكته من قوى الظلام التي استولت عليها",
    coverImage: "https://picsum.photos/300/400?random=3",
    genres: ["فانتازيا", "دراما", "رومانسي"],
    status: "مستمر",
    rating: 4.6,
    totalChapters: 67,
    views: 890000,
    author: "يوكي شيمادا",
    lastUpdated: "2025-01-10"
  }
];

export const mockUsers = [
  {
    id: "user1",
    username: "أحمد_المانجا",
    email: "ahmed@example.com",
    avatar: "https://picsum.photos/100/100?random=user1",
    favorites: ["1", "2"],
    readingHistory: [
      { mangaId: "1", chapterId: "ch1", progress: 100, lastRead: "2025-01-15" },
      { mangaId: "1", chapterId: "ch2", progress: 45, lastRead: "2025-01-14" }
    ],
    ratings: [
      { mangaId: "1", rating: 5 },
      { mangaId: "2", rating: 4 }
    ]
  }
];

export const mockComments = [
  {
    id: "comment1",
    mangaId: "1",
    chapterId: "ch1",
    userId: "user1",
    username: "أحمد_المانجا",
    content: "فصل رائع جداً! أسلوب الرسم مذهل والقصة مشوقة",
    timestamp: "2025-01-15T10:30:00Z",
    likes: 15,
    replies: [
      {
        id: "reply1",
        userId: "user2",
        username: "سارة_أوتاكو",
        content: "أتفق معك تماماً، لا أستطيع الانتظار للفصل القادم",
        timestamp: "2025-01-15T11:00:00Z",
        likes: 3
      }
    ]
  }
];

export const mockGenres = [
  "أكشن", "مغامرة", "فانتازيا", "رومانسي", "كوميدي", "دراما", 
  "خارق", "مدرسي", "رياضي", "رعب", "غموض", "علمي خيالي"
];

export const mockNotifications = [
  {
    id: "notif1",
    type: "new_chapter",
    title: "فصل جديد متاح!",
    message: "الفصل 46 من أسطورة الساموراي المفقود متاح الآن",
    timestamp: "2025-01-15T09:00:00Z",
    read: false
  },
  {
    id: "notif2",
    type: "like",
    title: "إعجاب جديد",
    message: "أعجب أحد الأشخاص بتعليقك على مملكة الظلال",
    timestamp: "2025-01-14T15:30:00Z", 
    read: true
  }
];