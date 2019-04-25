const express = require('express');

const app = express();

app.use('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: 'dsd3deef',
      title: 'first post',
      content: 'You are the best!'
    },
    {
      id: 'dskdk2l2',
      title: 'second post',
      content: 'Never give up.'
    }
  ];
  res.status(200).json({
    message: 'Posts fetched successfully!',
    posts: posts
  });
});

module.exports = app;
