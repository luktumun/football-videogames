import fs from 'fs';
import axios from 'axios';

// ✅ Replace with your actual values
const apiUrl = 'https://ap-south-1.aws.data.mongodb-api.com/app/data-koewh/endpoint/data/v1/action/find';
const apiKey = 'CQk2k1fBnHLvnoZFqALRZPTHzMgUUa9cYivK9VPOdo3tpNlyBKNjSNr6w14UoC7S'; // Store securely in env for production
const baseUrl = 'https://pcgame-sportvideo.netlify.app/'; // Public-facing route

// 🔹 Interfaces for your MongoDB documents
interface Game {
  id: string;
  title?: string;
  url: string;
  url1?: string;
  description?: string;
  image?: string;
  thumbnail?: string;
  sourceType: string;
}

interface Video {
  id: string;
  soccermatch?: string;
  videourl: string;
  description?: string;
  mediacontent?: string;
  subtitle?: string;
  torrentdownloadlink?: string;
  thumbnail?: string;
  sourceType: string;
}

interface MongoResponse<T> {
  documents: T[];
}

// 🔹 Slugify utility for SEO-friendly URLs
function slugify(text: string | undefined): string {
  if (!text || typeof text !== 'string') {
    console.warn('⚠️ slugify received invalid input:', text);
    return 'untitled-' + Math.random().toString(36).slice(2);
  }
  const slug = encodeURIComponent(
    text.toLowerCase()
      .replace(/\.[^/.]+$/, '')        // remove file extension
      .replace(/[^a-z0-9\s-]/g, '')    // remove special chars
      .replace(/\s+/g, '-')            // replace spaces with hyphens
  );
  if (!slug) {
    console.warn('⚠️ slugify produced empty slug for:', text);
    return 'untitled-' + Math.random().toString(36).slice(2);
  }
  return slug;
}

// 🔹 Fetch documents from a MongoDB Atlas Data API collection
async function fetchCollection<T>(collection: string): Promise<T[]> {
  try {
    const response = await axios.post(apiUrl, {
      dataSource: 'Cluster0',
      database: 'videoplayer',
      collection,
      filter: {}
    }, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      }
    });

    const data = response.data as MongoResponse<T>;
    console.log(`📦 Fetched ${data.documents.length} documents from "${collection}"`);
    return data.documents;
  } catch (error) {
    console.error(`❌ Failed to fetch collection "${collection}":`, error);
    return [];
  }
}

// 🔹 Generate sitemap.xml from both collections
async function generateSitemap() {
  const games = await fetchCollection<Game>('videos');
  const videos = await fetchCollection<Video>('torrentfiles');

  const today = new Date().toISOString().split('T')[0];

  const gameUrls = games.map(game => {
    const source = game.title ?? game.id;
    if (!source) {
      console.warn('⚠️ Skipping game with missing title and id:', game);
      return '';
    }
    const slug = slugify(source);
    return `
  <url>
    <loc>${baseUrl}${slug}</loc>
    <lastmod>${today}</lastmod>
  </url>`;
  }).filter(Boolean);

  const videoUrls = videos.map(video => {
    const source = video.soccermatch ?? video.id;
    if (!source) {
      console.warn('⚠️ Skipping video with missing soccermatch and id:', video);
      return '';
    }
    const slug = slugify(source);
    return `
  <url>
    <loc>${baseUrl}${slug}</loc>
    <lastmod>${today}</lastmod>
  </url>`;
  }).filter(Boolean);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${[...gameUrls, ...videoUrls].join('\n')}
</urlset>`;

  try {
    fs.mkdirSync('dist', { recursive: true });
    fs.writeFileSync('dist/sitemap.xml', sitemap);
    console.log(`✅ Sitemap generated with ${gameUrls.length + videoUrls.length} entries`);
  } catch (err) {
    console.error('❌ Failed to write sitemap.xml:', err);
  }
}

generateSitemap();