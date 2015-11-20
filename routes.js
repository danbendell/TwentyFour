module.exports = function(router)
{
    router.get('*', function(req, res)
    {
        res.sendFile('/public/index.html', {"root": __dirname});
    });
};