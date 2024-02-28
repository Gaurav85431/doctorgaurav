const jwt = require('jsonwebtoken');
const secretKey = require('../config/configuragtion');

module.exports = async (req, res, next) => {
  try {

    const token = req.headers['authorization'].split(" ")[1]//split kr denge taki Bearer remove ho jayen. aur 1st index i.e. 2nd value se hm token ko get karenge.

    // Hmne JWT_SECRET ki help se hmne encrypt kiya thha to ab hm JWT_SECRET ki hi help se token ko decrypt karenge.
    jwt.verify(token, secretKey.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(200).send({
          message: 'Auth Failed',
          success: false
        })
      }
      else {//isme hm req ko hndle krenge. ki yha per req.body.userID ka mtlb ye hai ki jo hm controller me login me token me jo userEmail._id pass kren hia wo hi
        req.body.userId = decode.id //for decodee hm id paas kr diy
        next()
      }
    })

  } catch (error) {
    console.log(error);
    res.status(401).send({
      message: "Auth Failed",
      success: false
    })
  }
}