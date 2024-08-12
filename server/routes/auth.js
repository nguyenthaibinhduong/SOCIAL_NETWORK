var Express = require('express');
const router = Express.Router();
const Auth = require('../controllers/auth');

router.post("/login",Auth.login);
router.post("/register", Auth.register);
router.post("/register/verify_email",Auth.RegisterVerifyEmail);
router.post("/logout",Auth.logout);
router.post('/refresh-token', Auth.refreshToken);
router.post('/reset-password/request', Auth.ResetPasswordRequest);
router.post('/reset-password/confirm', Auth.ConfirmPasswordRequest);
router.post('/change-password/',Auth.ChangePassword)

module.exports=router