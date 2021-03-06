const Sauce = require('../models/Sauce');

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    let imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    const sauce = new Sauce({
    ...sauceObject,
    imageUrl: imageUrl,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Sauce ajoutée avec succés !'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.updateSauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
      ...req.body
    }
  
  Sauce.updateOne({_id: req.params.id}, sauceObject).then(
    () => {
      res.status(201).json({
        message: 'Sauce mise à jours avec succés !'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.deleteSauce = (req, res, next) => {
  Sauce.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Sauce supprimée !'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      if (req.body.like === 1){ console.log('cas 1 début')
        if (sauce.usersDisliked.find(e => e === req.body.userId)){ console.log('cas 1-1')
          Sauce.updateOne( { _id: req.params.id }, { $inc:{ dislikes:-1 }, $pull:{ userDisliked: req.body.userId, _id : req.params.id } } )
        }
        if (!sauce.usersLiked.find(e => e === req.body.userId)){ console.log('cas 1-2')
          Sauce.updateOne( { _id: req.params.id }, { $inc:{ likes:+1 }, $push:{ userLiked: req.body.userId, _id : req.params.id } } )
        }
        console.log('cas 1')
      }
      if (req.body.like === -1){ console.log('cas -1 début')
        if (sauce.usersLiked.find(e => e === req.body.userId)){ console.log('cas -1-1')
          Sauce.updateOne( { _id: req.params.id }, { $inc:{ likes:-1 }, $pull:{ userLiked: req.body.userId, _id : req.params.id } } )
        }
        if (!sauce.usersDisliked.find(e => e === req.body.userId)){ console.log('cas -1-2')
          Sauce.updateOne( { _id: req.params.id }, { $inc:{ dislikes:+1 }, $push:{ userLiked: req.body.userId, _id : req.params.id } } )
        }
        console.log('cas -1')
      }
      if (req.body.like === 0){ console.log('cas 0 début')
        if (sauce.usersLiked.find(e => e === req.body.userId)){ console.log('cas 0-1')
          Sauce.updateOne( { _id: req.params.id }, { $inc:{ likes:-1 }, $pull:{ userLiked: req.body.userId, _id : req.params.id } } )
        }
        if (sauce.usersDisliked.find(e => e === req.body.userId)){ console.log('cas 0-2')
          Sauce.updateOne( { _id: req.params.id }, { $inc:{ dislikes:-1 }, $pull:{ userLiked: req.body.userId, _id : req.params.id } } )
        }
        console.log('cas 0')
      }
      return res.status(201).json({
        message: 'Merci pour votre avis !'})
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};
