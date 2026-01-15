const app = express();

app.get('/', (req, res) => {
  res.send({ hi: 'there' });
  res.send({ hi: 'there friend' });
});

const PORT = process.env.PORT || 5000;