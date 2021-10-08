//로그인 안한 유저들을 페이지에 접속하지 못하게 막는 미들웨어
export const protectMiddleware = (req, res, next) => {
    
    if(Boolean(req.session.loggedIn) != true)
    {   
        return res.redirect("/");
    }
    next();
}

//로그인 했는데 또 로그인 창으로 넘어가지 못하도록 막는 미들웨어
export const loggedInMiddleware = (req, res, next) => {

    if(Boolean(req.session.loggedIn) == true)
    {
        return res.redirect(`/users/${req.session.user._id}`);
    }
    next();
}


