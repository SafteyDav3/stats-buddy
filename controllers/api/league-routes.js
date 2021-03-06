const router = require("express").Router();
const { League, Team } = require("../../models");
const withAuth = require("../../utils/auth");
const badWords = require("../../utils/bad-words");

router.get('/', withAuth, (req, res) => {
  League.findAll({
    attributes: ["id", "name", "user_id"],
    order: [["name", "ASC"]],
    include: [
      {
        model: Team,
        attributes: ["id", "team_name", "manager", "league_id"],
      },
    ],
  })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', withAuth, (req, res) => {
  League.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "name", "user_id"],
    include: [
      {
        model: Team,
        attributes: ["id", "team_name", "manager", "league_id"],
      },
    ],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({
          message: "No league found with this id",
        });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/", withAuth, (req, res) => {
  if (badWords(req.body.name)) {
    res.status(400).send("No bad words allowed!");
    return;
  }
  League.create({
    name: req.body.name,
    user_id: req.session.user_id,
  })
    .then((dbPostData) => {
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put('/:id', withAuth, (req, res) => {
  League.update(
    {
      name: req.body.name,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({
          message: "No league found with this id",
        });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', withAuth, (req, res) => {
  League.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({
          message: "No league found with this id",
        });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
