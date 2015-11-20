module.exports = function(router)
{
    //router.post('/api/session', validator.postSession, controllers.session.create);
    //
    //router.post('/api/user', validator.requireAuth, controllers.user.create);
    //
    //router.post('/api/team', validator.requireAuth, validator.postTeam, controllers.team.create);

    router.get('*', function(req, res)
    {
        res.sendFile('/index.html', {"root": __dirname});
    });
};