    const jwt = require('jsonwebtoken');
    const secretKey = process.env.SECRETKEY;
    
    function verifyToken(req, res, next) {
        const authHeader = req.header('Authorization');
        console.log(authHeader);
        

        if (!authHeader) {
            return res.status(401).send({
                message: 'Authorization header is missing.',
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).send({
                message: 'Bearer token is missing in the Authorization header.',
            });
        }

        try {
            const decoded = jwt.verify(token, secretKey);
            console.log("Decoded Token:", decoded); 
            req.customer = decoded;
            next();
        } catch (error) {
            console.error("Token Error:", error); 
            return res.status(401).send({
                message: 'Invalid or expired token.',
                error: error.message, 
            });
        }
    }

    module.exports = verifyToken;


