const express = require("express");
const bodyParser = require("body-parser");
//const admin = require("firebase-admin");

var admin = require("firebase-admin");

var serviceAccount = require(" url");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "url",
});
const db = admin.firestore();
const app = express();
app.use(bodyParser.json());
const collection = "customers";
app.post("/create", async (req, resp) => {
  try {
    const data = req.body;
    const docRef = await db.collection(collection).add(data);
    resp.status(201).json({ message: "saved..", id: docRef.id });
  } catch (error) {
    resp.status(500).send({ error: error.message });
  }
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log("server is running");
});
app.get("/find-all", async (req, resp) => {
  try {
    const snapshot = await db.collection(collection).get();
    if (snapshot.empty) {
      return resp.status(200).json({ message: "no data ..", dataList: [] });
    }
    const result = [];
    snapshot.forEach((doc) => {
      result.push({ id: doc.id, ...doc.data() });
    });
    resp.status(200).json({ message: "data list..", dataList: result });
  } catch (error) {
    resp.status(500).send({ error: error.message });
  }
});
app.get("/find-by-id/:id", async (req, resp) => {
  const docId = req.params.id;
  try {
    const docRef = db.collection(collection).doc(docId);
    const doc = await docRef.get();
    if (!doc.exists) {
      resp.status(404).json({ message: "not found ..", dataList: null });
    }
    resp
      .status(200)
      .json({ message: "data  ..", data: { id: doc.id, ...doc.data() } });
  } catch (error) {
    resp.status(500).send({ error: error.message });
  }
});
app.put("/update-by-id/:id", async (req, resp) => {
  const docId = req.params.id;
  const data = req.body;
  try {
    const docRef = db.collection(collection).doc(docId);
    await docRef.update(data);
    resp.status(201).json({ message: "data updated .." });
  } catch (error) {
    resp.status(500).send({ error: error.message });
  }
});
app.delete("/update-by-id/:id", async (req, resp) => {
  const docId = req.params.id;

  try {
    await db.collection(collection).doc(docId).delete();

    resp.status(200).json({ message: "data deleted .." });
  } catch (error) {
    resp.status(500).send({ error: error.message });
  }
});
