var db = require('../connect')
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
const moment = require('moment/moment');
require('dotenv').config();
const validator = require('validator');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const session = require('express-session');
//RESGISTER
exports.register = (req, res) => {
   const { username, email, password ,confirm_password, name } = req.body;

    // Kiểm tra sự tồn tại của các trường
    if (!username || !email || !password || !name || !confirm_password) {
        return res.status(400).json("All fields are required");
    }

    // Kiểm tra ràng buộc độ dài và định dạng
    if (!validator.isLength(username, { min: 3, max: 20 }) || !validator.isAlphanumeric(username)) {
        return res.status(400).json("Username must be 3-20 characters long and contain only letters and numbers");
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json("Invalid email format");
    }

    if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
        return res.status(400).json("Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character");
    }

    if (!validator.isLength(name, { max: 30 }) ) {
        return res.status(400).json("Name must be up to 30 characters long");
    }
    if (password !== confirm_password) {
        return res.status(400).json('Passwords do not match');
    }
    // Kiểm tra username hoặc email đã tồn tại
    const q = "SELECT * FROM users WHERE username = ? OR email = ?";
    db.query(q, [username, email], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length) return res.status(409).json("User or email already exists");

        // Tạo mã xác thực (token)
        const token = crypto.randomBytes(32).toString('hex');
        const expires_at = moment().add(10, 'minutes').format('YYYY-MM-DD HH:mm:ss'); // Hết hạn sau 10 phút

        // Lưu thông tin tài khoản tạm thời và token vào database
        const insertQuery = "INSERT INTO pending_users (username, email, password, name, token, expires_at) VALUES (?, ?, ?, ?, ?, ?)";
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        db.query(insertQuery, [username, email, hashedPassword, name, token, expires_at], (err, result) => {
            if (err) return res.status(500).json(err);

            // Gửi email chứa mã xác thực
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Email Verification',
                text: `Please verify your email using the following token: ${token}. The token is valid for 10 minutes.`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) return res.status(500).json(error);
                return res.status(200).json("Verification email has been sent");
            });
        });
    }); 
}
exports.RegisterVerifyEmail = (req, res) => {
    const { token } = req.body;

    const q = "SELECT * FROM pending_users WHERE token = ? AND expires_at > NOW()";
    db.query(q, [token], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(400).json("Invalid or expired token");

        // Thêm tài khoản vào bảng `users`
        const { username, email, password, name } = data[0];
        const insertUserQuery = "INSERT INTO users (username, email, password, name) VALUES (?, ?, ?, ?)";

        db.query(insertUserQuery, [username, email, password, name], (err, result) => {
            if (err) return res.status(500).json(err);

            // Xóa bản ghi tạm thời sau khi xác thực
            const deleteQuery = "DELETE FROM pending_users WHERE email = ?";
            db.query(deleteQuery, [email], (err, result) => {
                if (err) return res.status(500).json(err);
                return res.status(200).json("Account has been verified and created successfully");
            });
        });
    });
}
//LOGIN JWT
exports.login = (req, res) => {
    const { username, password } = req.body;

    // Kiểm tra sự tồn tại của username và password
    if (!username || !password) {
        return res.status(400).json("Username and password are required");
    }

    // Kiểm tra ràng buộc độ dài và định dạng của username
    if (!validator.isLength(username, { min: 3, max: 20 }) || !validator.isAlphanumeric(username)) {
        return res.status(400).json("Username must be 3-20 characters long and contain only letters and numbers");
    }

    // Kiểm tra độ dài của mật khẩu
    if (!validator.isLength(password, { min: 8 })) {
        return res.status(400).json("Password must be at least 8 characters long");
    }

    const q = "SELECT * FROM users WHERE username = ?";
    db.query(q, [username], (err, data) => {
        if (err) return res.status(500).json(err);

        // Kiểm tra username => người dùng tồn tại
        if (data.length === 0) return res.status(404).json("User not found");

        // Kiểm tra mật khẩu
        const checkPassword = bcrypt.compareSync(password, data[0].password);
        if (!checkPassword) return res.status(400).json("Wrong password or username!");

        // JWT login
        const access_token = jwt.sign(
            { id: data[0].id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
        );

        const refresh_token = jwt.sign(
            { id: data[0].id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
        );

        // Lưu refresh token vào database
        const query = "INSERT INTO refresh_tokens (token, created_at) VALUES (?,?)";
        db.query(query, [refresh_token, moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')], (err, results) => {
            if (err) return res.status(500).json(err);

            // Loại bỏ mật khẩu khỏi đối tượng trả về
            const { password, ...others } = data[0];

            res.cookie("access_token", access_token, {
               secure: process.env.NODE_ENV === 'production', // Đảm bảo chỉ gửi cookie qua HTTPS trong môi trường sản xuất
                sameSite: 'Strict', // Ngăn chặn CSRF
            }).status(200).json({ ...others, refresh_token });
        });
    });
}

exports.refreshToken = (req, res) => {
    const refresh_token = req.body.refresh_token;
    if (!refresh_token) return res.sendStatus(401);

    const query = "SELECT * FROM refresh_tokens WHERE token = ?";
    db.query(query, [refresh_token], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(403).json('refresh-token does not exist');

        jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
            if (err) return res.status(400).json("refresh-token invalid");
            const access_token = jwt.sign({ id: data.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
            res.cookie("access_token", access_token, {
                httpOnly: true,
               secure: process.env.NODE_ENV === 'production', // Đảm bảo chỉ gửi cookie qua HTTPS trong môi trường sản xuất
                sameSite: 'Strict', // Ngăn chặn CSRF
            }).status(200).json({ access_token });
        });
    });
};
// LOGOUT
exports.logout = (req, res) => {
    const refresh_token = req.body.refresh_token;
    if (!refresh_token) {
        return res.status(400).json({ message: 'Refresh token is required' });
    }
    const query = "DELETE FROM refresh_tokens WHERE token = ?";
    db.query(query, [refresh_token], (err, results) => {
        if (err) return res.status(500).json(err);
        res.clearCookie('access_token');
        return res.status(200).json('Logged out successfully');
    });
};

//RESET PASSWORD
exports.ResetPasswordRequest = (req, res) => { 
    const { email } = req.body;

    // Kiểm tra xem email có tồn tại trong bảng users không
    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkUserQuery, [email], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json('Email not found' );

        // Tạo mã xác thực ngẫu nhiên
        const token = crypto.randomBytes(32).toString('hex');
        const hashedToken = bcrypt.hashSync(token, 10);

        // Thời gian hết hạn token (10 phút)
        const expiresAt = moment().add(10, 'minutes').format('YYYY-MM-DD HH:mm:ss');

        // Lưu token và thời gian hết hạn vào database
        const insertTokenQuery = 'INSERT INTO password_reset_tokens (email, token, expires_at) VALUES (?, ?, ?)';
        db.query(insertTokenQuery, [email, hashedToken, expiresAt], (err) => {
            if (err) return res.status(500).json({ error: 'Database error' });

            // Gửi email với mã xác thực
            const transporter = nodemailer.createTransport({
                service: 'Gmail', // Hoặc dịch vụ email khác
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USERNAME,
                to: email,
                subject: 'Password Reset Request',
                text: `Your password reset token is: ${token}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) return res.status(500).json({ error: 'Error sending email' });
                res.status(200).json({ message: 'Reset token sent to your email' });
            });
        });
    });
}
exports.ConfirmPasswordRequest = (req, res) => { 
    const { email, token } = req.body;

    const query = 'SELECT * FROM password_reset_tokens WHERE email = ? ORDER BY id DESC LIMIT 1';
    db.query(query, [email], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(400).json('Invalid email or token' );

        const dbToken = results[0];
        
        // Kiểm tra thời gian hết hạn token
        if (moment().isAfter(dbToken.expires_at)) {
            return res.status(400).json('Token has expired');
        }

        // Kiểm tra mã token hợp lệ
        const isTokenValid = bcrypt.compareSync(token, dbToken.token);
        if (!isTokenValid) return res.status(400).json('Invalid token');
        res.cookie("isVerified",true, {
                httpOnly: true,
               secure: process.env.NODE_ENV === 'production', // Đảm bảo chỉ gửi cookie qua HTTPS trong môi trường sản xuất
                sameSite: 'Strict', // Ngăn chặn CSRF
        });
        res.cookie("email",email, {
                httpOnly: true,
               secure: process.env.NODE_ENV === 'production', // Đảm bảo chỉ gửi cookie qua HTTPS trong môi trường sản xuất
                sameSite: 'Strict', // Ngăn chặn CSRF
        });
        res.status(200).json('Token verified successfully' );
    });
}
exports.ChangePassword = (req, res) => {
    const { password, confirm_password} = req.body;
    // Kiểm tra xem mã token đã được xác thực chưa
    if (!req.cookies.isVerified||!req.cookies.email) {
        return res.status(401).json('Unauthorized or session expired');
    }
    if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
        return res.status(400).json("Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character");
    }
    if (password !== confirm_password) {
        return res.status(400).json('Passwords do not match');
    }
    const email = req.cookies.email;
    // Mã hóa mật khẩu mới
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        // Cập nhật mật khẩu trong database
        const query = 'UPDATE users SET password = ? WHERE email = ?';
        db.query(query, [hashedPassword, email], (err) => {
            if (err) return res.status(500).json(err);

            const deleteQuery = "DELETE FROM password_reset_tokens WHERE email = ?";
            db.query(deleteQuery, [email], (err, result) => {
                if (err) return res.status(500).json(err);
                    res.clearCookie('isVerified');
                    res.clearCookie('email');
                    return res.status(200).json("Password reset successfully");
            });
        });
    
 }
