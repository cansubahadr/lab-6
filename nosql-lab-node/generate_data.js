// 1) .env'yi yükle
require('dotenv').config();

const { faker } = require('@faker-js/faker');
const Redis = require('redis');
const { MongoClient } = require('mongodb');
const { Client: HazelcastClient } = require('hazelcast-client');

async function run() {
    // 2) Redis
    const rd = Redis.createClient({ url: process.env.REDIS_URL });
    await rd.connect();
    await rd.flushDb();

    // 3) MongoDB
    const mc = new MongoClient(process.env.MONGO_URL);
    await mc.connect();
    const mongoCol = mc.db(process.env.MONGO_DB).collection('students');
    await mongoCol.deleteMany({});

    // 4) Hazelcast
    const hzClient = await HazelcastClient.newHazelcastClient();
    const hzMap = await hzClient.getMap('students');
    await hzMap.clear();


    const BASE = 2025000001;
    const BATCH = 500;
    for (let i = 0; i < 10000; i += BATCH) {
        const ops = [];
        for (let j = 0; j < BATCH; j++) {
            const sn = String(BASE + i + j);
            const student = {
                student_no: sn,
                name: faker.person.fullName(),
                department: faker.person.jobTitle()
            };
            ops.push(rd.set(`student:${sn}`, JSON.stringify(student)));
            ops.push(mongoCol.insertOne(student));
            ops.push(hzMap.put(sn, JSON.stringify(student)));
        }
        await Promise.all(ops);
        process.stdout.write(`Yüklendi: ${i + BATCH}/10000\r`);
    }

    console.log('\n✅ 10.000 kayıt yüklendi.');

    // 6) Kapatmalar
    await rd.disconnect();
    await mc.close();
    await hzClient.shutdown();
}

run().catch(console.error);
