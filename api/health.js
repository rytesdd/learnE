// Vercel Serverless Function - /api/health
export default async function handler(req, res) {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  });
}

