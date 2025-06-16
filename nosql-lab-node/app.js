// 1) .env'yi yükle
require('dotenv').config();

const express = require('express');
const Redis = require('redis');
const { MongoClient } = require('mongodb');
const { Client: HazelcastClient } = require('hazelcast-client');

async function main() {
    const app = express();

    // 2) Bağlantıları kur
    const rd = Redis.createClient({ url: process.env.REDIS_URL });
    await rd.connect();

    const mc = new MongoClient(process.env.MONGO_URL);
    await mc.connect();
    const mongoCol = mc.db(process.env.MONGO_DB).collection('students');

    const hzClient = await HazelcastClient.newHazelcastClient();
    const hzMap = await hzClient.getMap('students');

    // 3) Root rotası (health-check + linkler)
    app.get('/', (req, res) => {
        res.send(`
      <h1>NoSQL Lab API</h1>
      <ul>
        <li><a href="/nosql-lab-rd/2025000001">Redis’den Oku</a></li>
        <li><a href="/nosql-lab-mon/2025000001">MongoDB’den Oku</a></li>
        <li><a href="/nosql-lab-hz/2025000001">Hazelcast’ten Oku</a></li>
      </ul>
    `);
    });

    // 4) Redis endpoint
    app.get('/nosql-lab-rd/:sn', async (req, res, next) => {
        try {
            const raw = await rd.get(`student:${req.params.sn}`);
            if (!raw) return res.status(404).json({ error: 'Not found' });
            res.json(JSON.parse(raw));
        } catch (err) {
            next(err);
        }
    });

    // 5) MongoDB endpoint
    app.get('/nosql-lab-mon/:sn', async (req, res, next) => {
        try {
            const student = await mongoCol.findOne(
                { student_no: req.params.sn },
                { projection: { _id: 0 } }
            );
            if (!student) return res.status(404).json({ error: 'Not found' });
            res.json(student);
        } catch (err) {
            next(err);
        }
    });

    // 6) Hazelcast endpoint
    app.get('/nosql-lab-hz/:sn', async (req, res, next) => {
        try {
            const raw = await hzMap.get(req.params.sn);
            if (!raw) return res.status(404).json({ error: 'Not found' });
            res.json(JSON.parse(raw));
        } catch (err) {
            next(err);
        }
    });

    // 7) Hata yakalama
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    });

    // 8) Sunucuyu başlat
    const port = process.env.APP_PORT || 8080;
    app.listen(port, () =>
        console.log(`▶️  Server listening on http://localhost:${port}`)
    );
}

main().catch(console.error);
