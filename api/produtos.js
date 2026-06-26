export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug, ...bodyParams } = req.body || {};
  const envKey = 'DIVULGALINKS_TOKEN_' + (slug || '').toUpperCase().replace(/-/g, '_');
  const token = process.env[envKey] || process.env.DIVULGALINKS_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'Token nao configurado para: ' + (slug || 'default') });
  }

  try {
    const upstream = await fetch('https://pro.divulgalinks.com.br/api/wp', {
      method: 'POST',
      headers: {
        'apiKey': token,
        'X-Requested-From': process.env.SITE_URL || 'https://vaideclick.com',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyParams),
    });

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: 'Upstream error', status: upstream.status });
    }

    const data = await upstream.json();
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'Falha ao conectar com a API' });
  }
}
