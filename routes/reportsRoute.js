import express from 'express';
import { connectMongo } from '../connection.js';
import { ObjectId } from 'bson';
import { checkBody } from './middleware.js';

export const reportsRouter = express.Router();

reportsRouter.post('/', checkBody, async (req, res) => {
  try {
    const body = req.body;
    const db = await connectMongo();
    if (!body.timestamp) body['timestamp'] = new Date().toDateString();
    const report = await db.collection('intel_reports').insertOne(body);
    console.log(report);

    res.status(200).json({ report: report.insertedId });
  } catch (error) {
    console.error(error);
  }
});

reportsRouter.get('/', async (req, res) => {
  try {
    const db = await connectMongo();
    const reports = await db.collection('intel_reports').find().toArray();
    res.status(200).json({ reports: reports });
  } catch (error) {
    console.error(error);
  }
});

reportsRouter.get('/high', async (req, res) => {
  try {
    const db = await connectMongo();
    const reports = await db
      .collection('intel_reports')
      .find({ threatLevel: { $gte: 4 } })
      .toArray();
    res.status(200).json({ reports: reports });
  } catch (error) {
    console.error(error);
  }
});

reportsRouter.get('/getreport/:id', async (req, res) => {
  try {
    const db = await connectMongo();
    const report = await db
      .collection('intel_reports')
      .findOne({ _id: new ObjectId(req.params.id) });
    return report
      ? res.status(200).send(report)
      : res.status(404).send('Report Not Found');
  } catch (error) {
    console.error(error);
  }
});

reportsRouter.get('/agent/:fieldCode', async (req, res) => {
  try {
    const db = await connectMongo();
    const reports = await db
      .collection('intel_reports')
      .find({ fieldCode: req.params.fieldCode })
      .toArray();
    return reports.length > 0
      ? res.status(200).send(reports)
      : res.status(404).send('Report Not Found');
  } catch (error) {
    console.error(error);
  }
});

reportsRouter.get('/stats', async (req, res) => {
  try {
    const db = await connectMongo();
    const all = await db.collection('intel_reports').find().toArray();
    const high = await db
      .collection('intel_reports')
      .find({ threatLevel: { $gte: 4 } })
      .toArray();
    const confirmed = await db
      .collection('intel_reports')
      .find({ confirmed: true })
      .toArray();
    res.status(200).json({
      all: all.length,
      high: high.length,
      confirmed: confirmed.length,
    });
  } catch (error) {
    console.error(error);
  }
});

reportsRouter.put('/:id/confirm', async (req, res) => {
  try {
    const db = await connectMongo();
    await db
      .collection('intel_reports')
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { confirmed: true } }
      );
    const report = await db
      .collection('intel_reports')
      .findOne({ _id: new ObjectId(req.params.id) });
    if (report) {
      return res.status(200).send(report);
    }
    return res.status(404).send('Report Not Found');
  } catch (error) {
    console.error(error);
  }
});

reportsRouter.delete('/:id', async (req, res) => {
  try {
    const db = await connectMongo();
    const report = await db
      .collection('intel_reports')
      .findOne({ _id: new ObjectId(req.params.id) });
    if (report) {
      await db
        .collection('intel_reports')
        .deleteOne({ _id: new ObjectId(req.params.id) });
      return res.status(200).send('Report deleted successfully');
    }
    return res.status(404).send('Report Not Found');
  } catch (error) {
    console.error(error);
  }
});
